import { useEffect, useRef, useState, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const DETECTION_INTERVAL_MS = 1500;
const PHONE_CLASSES = ['cell phone', 'remote'];
const PERSON_CLASS = 'person';

// ─── Talking detection config ────────────────────────────────────────────────
const TALKING_VOLUME_THRESHOLD = 18;   // 0-255 range, mic volume jis par "talking" count ho
const TALKING_DURATION_MS      = 2000; // kitne ms tak lagatar volume high rahe tab alert fire ho
// ─────────────────────────────────────────────────────────────────────────────

export const useDistractionDetection = ({ enabled, onDistraction }) => {
  const modelRef     = useRef(null);
  const intervalRef  = useRef(null);
  const videoRef     = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [detecting, setDetecting]     = useState(false);

  // ── Audio refs for talking detection ──────────────────────────────────────
  const audioCtxRef     = useRef(null);
  const analyserRef     = useRef(null);
  const micStreamRef    = useRef(null);
  const talkingStartRef = useRef(null);
  // ──────────────────────────────────────────────────────────────────────────

  // Load COCO-SSD model — mobilenet_v2 full (lite se zyada accurate)
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      try {
        const model = await cocoSsd.load({ base: 'mobilenet_v2' });
        if (!cancelled) {
          modelRef.current = model;
          setModelLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load TF model:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [enabled]);

  // ── Mic setup ─────────────────────────────────────────────────────────────
  const startMic = useCallback(async () => {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const ctx      = new (window.AudioContext || window.webkitAudioContext)();
      const source   = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;

      source.connect(analyser);
      audioCtxRef.current  = ctx;
      analyserRef.current  = analyser;
    } catch (err) {
      console.warn('Mic access denied — talking detection disabled:', err);
    }
  }, []);

  const stopMic = useCallback(() => {
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    micStreamRef.current    = null;
    audioCtxRef.current     = null;
    analyserRef.current     = null;
    talkingStartRef.current = null;
  }, []);

  // Returns true if sustained talking detected
  const checkTalking = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return false;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    // Speech range: mid frequencies (300Hz–3000Hz approx)
    const midStart = Math.floor(data.length * 0.1);
    const midEnd   = Math.floor(data.length * 0.5);
    const slice    = data.slice(midStart, midEnd);
    const avg      = slice.reduce((a, b) => a + b, 0) / slice.length;

    if (avg > TALKING_VOLUME_THRESHOLD) {
      if (!talkingStartRef.current) {
        talkingStartRef.current = Date.now();
      } else if (Date.now() - talkingStartRef.current > TALKING_DURATION_MS) {
        talkingStartRef.current = null;
        return true; // sustained talking confirmed
      }
    } else {
      talkingStartRef.current = null;
    }
    return false;
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const runDetection = useCallback(async () => {
    if (!modelRef.current || !videoRef.current || videoRef.current.readyState < 2) return;

    try {
      const predictions = await modelRef.current.detect(videoRef.current);

      const persons = predictions.filter(p => p.class === PERSON_CLASS && p.score > 0.50);
      // Reduced threshold further to 0.20 to catch more phones correctly
      const phones  = predictions.filter(p => PHONE_CLASSES.includes(p.class) && p.score > 0.20);

      // 1. Koi nahi baitha
      if (persons.length === 0) {
        onDistraction({ type: 'absent', predictions });
        return;
      }

      // 2. Multiple log aa gaye
      if (persons.length > 1) {
        onDistraction({ type: 'multiple_people', predictions });
        return;
      }

      // 3. Phone visible
      if (phones.length > 0) {
        onDistraction({ type: 'phone_detected', predictions });
        return;
      }

      // 4. Talking detected via audio analysis
      if (checkTalking()) {
        onDistraction({ type: 'talking', predictions });
        return;
      }

      // 5. Face away — improved: bounding box aspect ratio check
      //    Jab koi side pe muh karta hai, person bbox narrow ho jaata hai
      const person = persons[0];
      const [personX, , personW, personH] = person.bbox;
      const aspectRatio = personW / personH;

      if (aspectRatio < 0.25) {
        onDistraction({ type: 'face_away', predictions });
        return;
      }

      // 6. Person frame ke edge pe chala gaya (screen se door ho raha hai)
      const videoW   = videoRef.current.videoWidth || 640;
      const isNearEdge = personX < videoW * 0.05 || (personX + personW) > videoW * 0.95;
      if (isNearEdge) {
        onDistraction({ type: 'face_away', predictions });
      }

    } catch (err) {
      console.warn('Detection error:', err);
    }
  }, [onDistraction, checkTalking]);

  const startDetection = useCallback(async (videoElement) => {
    videoRef.current = videoElement;
    await startMic(); // mic bhi start karo talking ke liye
    setDetecting(true);
    intervalRef.current = setInterval(runDetection, DETECTION_INTERVAL_MS);
  }, [runDetection, startMic]);

  const stopDetection = useCallback(() => {
    clearInterval(intervalRef.current);
    stopMic();
    setDetecting(false);
  }, [stopMic]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      stopMic();
    };
  }, [stopMic]);

  return { modelLoaded, detecting, startDetection, stopDetection };
};

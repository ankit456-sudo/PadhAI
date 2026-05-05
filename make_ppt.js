const pptxgen = require("/home/claude/.npm-global/lib/node_modules/pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "PadhAI - Every Focused Minute Counts";

const DARK = "0A0A0F";
const PURPLE = "7850FF";
const VIOLET = "C062FF";
const GREEN = "00C896";
const LIGHT = "E8E8F0";
const MUTED = "555566";
const CARD = "14141F";
const BORDER = "1E1E30";

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.4 });

// ─────────────────────────────────────────────
// SLIDE 1: TITLE
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  // Purple glow blob (left)
  s.addShape(pres.shapes.OVAL, { x: -1, y: -0.5, w: 5, h: 4, fill: { color: PURPLE, transparency: 88 }, line: { color: DARK } });
  // Violet glow blob (right)
  s.addShape(pres.shapes.OVAL, { x: 7, y: 2.5, w: 4, h: 4, fill: { color: VIOLET, transparency: 90 }, line: { color: DARK } });

  // Badge
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.2, y: 0.5, w: 3.6, h: 0.38, fill: { color: "1A0F35" }, line: { color: PURPLE, pt: 1 }, rectRadius: 0.1 });
  s.addText("MCA PROJECT · GLA UNIVERSITY · 2025-26", { x: 3.2, y: 0.5, w: 3.6, h: 0.38, fontSize: 8, color: VIOLET, bold: true, align: "center", valign: "middle", charSpacing: 2 });

  // Logo box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.4, y: 1.1, w: 1.2, h: 1.2, fill: { color: PURPLE }, line: { color: VIOLET, pt: 2 }, rectRadius: 0.18 });
  s.addText("P", { x: 4.4, y: 1.1, w: 1.2, h: 1.2, fontSize: 40, color: LIGHT, bold: true, align: "center", valign: "middle" });

  // Title
  s.addText("PadhAI", { x: 1, y: 2.5, w: 8, h: 0.9, fontSize: 54, color: LIGHT, bold: true, align: "center", fontFace: "Georgia", charSpacing: -1 });

  // Tagline gradient effect (two text elements)
  s.addText("Every focused minute counts.", { x: 1, y: 3.45, w: 8, h: 0.55, fontSize: 20, color: VIOLET, align: "center", fontFace: "Calibri", italic: true });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 4.1, w: 3, h: 0.04, fill: { color: PURPLE, transparency: 30 }, line: { color: DARK } });

  // Bottom info
  s.addText("AI-Powered Student Accountability · MERN Stack · TensorFlow.js · Socket.io", {
    x: 1, y: 4.3, w: 8, h: 0.4, fontSize: 11, color: MUTED, align: "center", fontFace: "Calibri"
  });

  // Group G-52 badge
  s.addText("Group G-52", { x: 3.8, y: 4.9, w: 2.4, h: 0.35, fontSize: 10, color: MUTED, align: "center", fontFace: "Calibri" });
}

// ─────────────────────────────────────────────
// SLIDE 2: PROBLEM STATEMENT
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.OVAL, { x: 7, y: -1, w: 5, h: 5, fill: { color: PURPLE, transparency: 92 }, line: { color: DARK } });

  s.addText("THE PROBLEM", { x: 0.5, y: 0.3, w: 4, h: 0.35, fontSize: 10, color: VIOLET, bold: true, charSpacing: 3, fontFace: "Calibri" });
  s.addText("Students lie to themselves\nabout how much they study.", {
    x: 0.5, y: 0.75, w: 6, h: 1.4, fontSize: 30, color: LIGHT, bold: true, fontFace: "Georgia", lineSpacingMultiple: 1.15
  });

  const problems = [
    { icon: "📱", title: "Phone distractions", desc: "Avg student checks phone 96x/day during study" },
    { icon: "🎮", title: "Multitasking illusion", desc: "Switching tabs resets deep focus every time" },
    { icon: "⏱", title: "Fake study time", desc: "4 hours of 'studying' = maybe 45 min of real focus" },
    { icon: "📉", title: "No accountability", desc: "No system to measure genuine cognitive effort" },
  ];

  problems.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.7;
    const y = 2.4 + row * 1.4;

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 1.2, fill: { color: CARD }, line: { color: BORDER, pt: 1 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.07, h: 1.2, fill: { color: PURPLE }, line: { color: DARK } });
    s.addText(p.icon, { x: x + 0.15, y, w: 0.8, h: 1.2, fontSize: 20, align: "center", valign: "middle" });
    s.addText(p.title, { x: x + 1, y: y + 0.1, w: 3.1, h: 0.4, fontSize: 13, color: LIGHT, bold: true, fontFace: "Calibri" });
    s.addText(p.desc, { x: x + 1, y: y + 0.5, w: 3.1, h: 0.6, fontSize: 10, color: MUTED, fontFace: "Calibri" });
  });
}

// ─────────────────────────────────────────────
// SLIDE 3: SOLUTION
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.OVAL, { x: -1, y: 2, w: 4, h: 4, fill: { color: "005040", transparency: 80 }, line: { color: DARK } });

  s.addText("OUR SOLUTION", { x: 0.5, y: 0.3, w: 4, h: 0.35, fontSize: 10, color: GREEN, bold: true, charSpacing: 3, fontFace: "Calibri" });
  s.addText("PadhAI: A digital supervisor\nthat never blinks.", {
    x: 0.5, y: 0.75, w: 9, h: 1.2, fontSize: 30, color: LIGHT, bold: true, fontFace: "Georgia", lineSpacingMultiple: 1.15
  });

  const features = [
    { num: "01", title: "Virtual Study Mode", desc: "Webcam-based AI monitoring using TensorFlow.js detects phone, talking, or leaving.", color: PURPLE },
    { num: "02", title: "Smart Timer Control", desc: "Socket.io pauses the timer the moment a distraction is detected — in real-time.", color: VIOLET },
    { num: "03", title: "Deep Work Analysis", desc: "MongoDB logs every event. Only genuine focus counts toward your study time.", color: GREEN },
    { num: "04", title: "Instant Alerts", desc: "Audio alert fires immediately so you self-correct and get back on track.", color: "FF6B6B" },
  ];

  features.forEach((f, i) => {
    const x = 0.5 + (i % 2) * 4.7;
    const y = 2.25 + Math.floor(i / 2) * 1.5;

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 1.3, fill: { color: CARD }, line: { color: BORDER, pt: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 0.08, fill: { color: f.color }, line: { color: DARK } });
    s.addText(f.num, { x: x + 0.15, y: y + 0.15, w: 0.55, h: 0.55, fontSize: 18, color: f.color, bold: true, fontFace: "Georgia" });
    s.addText(f.title, { x: x + 0.15, y: y + 0.6, w: 4, h: 0.35, fontSize: 13, color: LIGHT, bold: true, fontFace: "Calibri" });
    s.addText(f.desc, { x: x + 0.15, y: y + 0.9, w: 4, h: 0.38, fontSize: 10, color: MUTED, fontFace: "Calibri" });
  });
}

// ─────────────────────────────────────────────
// SLIDE 4: TECH STACK
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.OVAL, { x: 6, y: 1, w: 6, h: 6, fill: { color: PURPLE, transparency: 93 }, line: { color: DARK } });

  s.addText("TECHNOLOGY STACK", { x: 0.5, y: 0.3, w: 5, h: 0.35, fontSize: 10, color: VIOLET, bold: true, charSpacing: 3, fontFace: "Calibri" });
  s.addText("MERN Stack + AI Layer", { x: 0.5, y: 0.75, w: 7, h: 0.75, fontSize: 32, color: LIGHT, bold: true, fontFace: "Georgia" });

  const stack = [
    { layer: "Frontend", techs: ["React.js", "TensorFlow.js", "Socket.io Client", "Chart.js"], color: PURPLE },
    { layer: "Backend", techs: ["Node.js", "Express.js", "Socket.io Server", "REST API"], color: VIOLET },
    { layer: "Database", techs: ["MongoDB", "Mongoose ODM", "Session Logs", "Analytics"], color: GREEN },
    { layer: "AI / CV", techs: ["TensorFlow.js", "Face API", "Pose Detection", "Browser ML"], color: "FFB800" },
  ];

  stack.forEach((item, i) => {
    const x = 0.5 + (i % 2) * 4.7;
    const y = 1.9 + Math.floor(i / 2) * 1.75;

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 1.55, fill: { color: CARD }, line: { color: BORDER, pt: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h: 1.55, fill: { color: item.color }, line: { color: DARK } });

    s.addText(item.layer, { x: x + 0.25, y: y + 0.12, w: 3.8, h: 0.38, fontSize: 14, color: item.color, bold: true, fontFace: "Calibri" });

    item.techs.forEach((t, j) => {
      const col = j % 2;
      const row = Math.floor(j / 2);
      s.addText(`· ${t}`, { x: x + 0.25 + col * 2, y: y + 0.55 + row * 0.38, w: 2, h: 0.35, fontSize: 10, color: MUTED, fontFace: "Calibri" });
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 5: HOW IT WORKS
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addText("HOW IT WORKS", { x: 0.5, y: 0.3, w: 5, h: 0.35, fontSize: 10, color: VIOLET, bold: true, charSpacing: 3, fontFace: "Calibri" });
  s.addText("From webcam to deep work analytics", { x: 0.5, y: 0.75, w: 9, h: 0.6, fontSize: 26, color: LIGHT, bold: true, fontFace: "Georgia" });

  const steps = [
    { n: "1", label: "Student logs in & sets subject", color: PURPLE },
    { n: "2", label: "Webcam feed starts, TF.js loads", color: VIOLET },
    { n: "3", label: "AI monitors every frame for distractions", color: "5090FF" },
    { n: "4", label: "Distraction detected → audio alert fires", color: "FF6B6B" },
    { n: "5", label: "Socket.io pauses timer instantly", color: "FFB800" },
    { n: "6", label: "Event logged to MongoDB", color: GREEN },
    { n: "7", label: "Session ends → Deep Work report generated", color: "00E5AC" },
  ];

  steps.forEach((step, i) => {
    const y = 1.6 + i * 0.52;

    // Line connector (not for last)
    if (i < steps.length - 1) {
      s.addShape(pres.shapes.LINE, { x: 1.15, y: y + 0.46, w: 0, h: 0.1, line: { color: BORDER, pt: 1 } });
    }

    // Circle number
    s.addShape(pres.shapes.OVAL, { x: 0.5, y, w: 0.42, h: 0.42, fill: { color: step.color }, line: { color: DARK } });
    s.addText(step.n, { x: 0.5, y, w: 0.42, h: 0.42, fontSize: 11, color: DARK, bold: true, align: "center", valign: "middle" });

    // Step bar
    s.addShape(pres.shapes.RECTANGLE, { x: 1.05, y: y + 0.03, w: 8.5, h: 0.36, fill: { color: CARD }, line: { color: BORDER, pt: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 1.05, y: y + 0.03, w: 0.06, h: 0.36, fill: { color: step.color }, line: { color: DARK } });
    s.addText(step.label, { x: 1.2, y: y + 0.03, w: 8.2, h: 0.36, fontSize: 12, color: LIGHT, valign: "middle", fontFace: "Calibri" });
  });
}

// ─────────────────────────────────────────────
// SLIDE 6: TEAM
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.OVAL, { x: -2, y: -1, w: 6, h: 6, fill: { color: PURPLE, transparency: 92 }, line: { color: DARK } });

  s.addText("THE TEAM", { x: 0.5, y: 0.3, w: 4, h: 0.35, fontSize: 10, color: VIOLET, bold: true, charSpacing: 3, fontFace: "Calibri" });
  s.addText("Group G-52 · Section D · MCA 2025-26", { x: 0.5, y: 0.75, w: 9, h: 0.6, fontSize: 22, color: LIGHT, bold: true, fontFace: "Georgia" });

  const members = [
    { name: "Ankit Yadav", roll: "12584200030", cpi: "7.04", initials: "AY", color: PURPLE },
    { name: "Ankit Saini", roll: "12584200028", cpi: "7.33", initials: "AS", color: VIOLET },
    { name: "Shivam Chaudhary", roll: "12584200175", cpi: "7.58", initials: "SC", color: GREEN },
    { name: "Vanshika Goyal", roll: "12584200203", cpi: "8.12", initials: "VG", color: "FF6B6B" },
    { name: "Varchasv Pratap", roll: "12584200205", cpi: "6.57", initials: "VP", color: "FFB800" },
  ];

  const cols = [0, 1, 2, 3, 4];
  const positions = [
    { x: 0.5, y: 1.7 }, { x: 2.55, y: 1.7 }, { x: 4.6, y: 1.7 }, { x: 6.65, y: 1.7 }, { x: 8.0, y: 1.7 }
  ];

  const cardW = 1.75;
  members.forEach((m, i) => {
    const { x, y } = positions[i];

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: 2.8, fill: { color: CARD }, line: { color: BORDER, pt: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: 0.07, fill: { color: m.color }, line: { color: DARK } });

    // Avatar circle
    s.addShape(pres.shapes.OVAL, { x: x + (cardW - 0.8) / 2, y: y + 0.2, w: 0.8, h: 0.8, fill: { color: m.color, transparency: 20 }, line: { color: m.color, pt: 2 } });
    s.addText(m.initials, { x: x + (cardW - 0.8) / 2, y: y + 0.2, w: 0.8, h: 0.8, fontSize: 14, color: LIGHT, bold: true, align: "center", valign: "middle" });

    s.addText(m.name, { x, y: y + 1.15, w: cardW, h: 0.5, fontSize: 11, color: LIGHT, bold: true, align: "center", fontFace: "Calibri", margin: 0 });
    s.addText(m.roll, { x, y: y + 1.65, w: cardW, h: 0.4, fontSize: 8, color: MUTED, align: "center", fontFace: "Calibri" });

    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.35, y: y + 2.1, w: cardW - 0.7, h: 0.42, fill: { color: m.color, transparency: 85 }, line: { color: m.color, pt: 1 } });
    s.addText(`CPI: ${m.cpi}`, { x: x + 0.35, y: y + 2.1, w: cardW - 0.7, h: 0.42, fontSize: 11, color: m.color, bold: true, align: "center", valign: "middle", fontFace: "Calibri" });
  });

  // Supervisor
  s.addShape(pres.shapes.RECTANGLE, { x: 2, y: 4.75, w: 6, h: 0.65, fill: { color: CARD }, line: { color: BORDER, pt: 1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 2, y: 4.75, w: 0.07, h: 0.65, fill: { color: VIOLET }, line: { color: DARK } });
  s.addText("Supervisor: Mr. Mohd. Shavez  ·  Assistant Professor  ·  GLA University", {
    x: 2.2, y: 4.75, w: 5.7, h: 0.65, fontSize: 11, color: MUTED, valign: "middle", fontFace: "Calibri"
  });
}

// ─────────────────────────────────────────────
// SLIDE 7: CLOSING
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.OVAL, { x: 1, y: -0.5, w: 8, h: 8, fill: { color: PURPLE, transparency: 91 }, line: { color: DARK } });

  s.addText("Thank You", { x: 0.5, y: 1.1, w: 9, h: 1.2, fontSize: 52, color: LIGHT, bold: true, align: "center", fontFace: "Georgia" });
  s.addText("Every focused minute counts.", {
    x: 1, y: 2.5, w: 8, h: 0.6, fontSize: 22, color: VIOLET, align: "center", fontFace: "Calibri", italic: true
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.25, w: 3, h: 0.04, fill: { color: PURPLE, transparency: 30 }, line: { color: DARK } });

  const tags = ["MongoDB", "Express", "React", "Node.js", "TensorFlow.js", "Socket.io"];
  const startX = (10 - tags.length * 1.55) / 2;
  tags.forEach((t, i) => {
    const x = startX + i * 1.55;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 3.5, w: 1.45, h: 0.38, fill: { color: CARD }, line: { color: BORDER, pt: 1 } });
    s.addText(t, { x, y: 3.5, w: 1.45, h: 0.38, fontSize: 9, color: MUTED, align: "center", valign: "middle", fontFace: "Calibri" });
  });

  s.addText("GLA University, Mathura  ·  Department of Computer Engineering & Applications  ·  Group G-52", {
    x: 0.5, y: 5.1, w: 9, h: 0.4, fontSize: 10, color: "333344", align: "center", fontFace: "Calibri"
  });
}

pres.writeFile({ fileName: "/mnt/user-data/outputs/PadhAI_Presentation.pptx" })
  .then(() => console.log("✅ PPT created!"))
  .catch(e => console.error("❌ Error:", e));

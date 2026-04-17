from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import copy

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

# ── Color Palette ──
C_BG_DARK  = RGBColor(0x0F, 0x0F, 0x1A)   # Deep navy-black
C_BG_CARD  = RGBColor(0x16, 0x21, 0x3E)   # Card navy
C_ACCENT   = RGBColor(0x6C, 0x63, 0xFF)   # Purple accent
C_ACCENT_L = RGBColor(0xA7, 0x8B, 0xFA)   # Light purple
C_GREEN    = RGBColor(0x10, 0xB9, 0x81)   # Emerald green
C_YELLOW   = RGBColor(0xF5, 0x9E, 0x0B)   # Amber
C_RED      = RGBColor(0xEF, 0x44, 0x44)   # Red
C_WHITE    = RGBColor(0xFF, 0xFF, 0xFF)
C_GRAY     = RGBColor(0x94, 0xA3, 0xB8)   # Slate gray
C_TEXT     = RGBColor(0xE2, 0xE8, 0xF0)   # Light text

BLANK_LAYOUT = 6

def add_rect(slide, x, y, w, h, color, transparency=None):
    shape = slide.shapes.add_shape(1, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    if transparency is not None:
        shape.fill.fore_color.theme_color = None
    return shape

def add_text(slide, text, x, y, w, h, size, color, bold=False, align=PP_ALIGN.LEFT, italic=False, font="Calibri"):
    txBox = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.italic = italic
    run.font.name = font
    return txBox

def dark_bg(slide):
    add_rect(slide, 0, 0, 13.33, 7.5, C_BG_DARK)

def accent_bar_left(slide, color=None):
    c = color or C_ACCENT
    add_rect(slide, 0, 0, 0.35, 7.5, c)

def slide_number(slide, n):
    add_text(slide, str(n), 12.8, 7.1, 0.5, 0.35, 10, C_GRAY, align=PP_ALIGN.RIGHT)

# ══════════════════════════════════════════════
# SLIDE 1 — Title
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)

# Purple gradient strip left
add_rect(sl, 0, 0, 4.2, 7.5, C_ACCENT)
# Darker overlay on strip
add_rect(sl, 0, 0, 4.2, 7.5, RGBColor(0x1A, 0x10, 0x4A))

# Left decorative circles
for cy, cr, alpha in [(1.2, 1.8, RGBColor(0x6C,0x63,0xFF)), (5.5, 1.2, RGBColor(0xA7,0x8B,0xFA))]:
    sh = sl.shapes.add_shape(9, Inches(0.3), Inches(cy), Inches(cr), Inches(cr))  # 9=oval
    sh.fill.solid(); sh.fill.fore_color.rgb = alpha; sh.line.fill.background()

# Large LOGO text on strip
add_text(sl, "Padh", 0.5, 2.1, 2.0, 1.2, 52, C_WHITE, bold=True, font="Calibri")
add_text(sl, "AI", 2.5, 2.1, 1.5, 1.2, 52, C_ACCENT_L, bold=True, font="Calibri")
add_text(sl, "Every focused minute counts", 0.5, 3.4, 3.4, 0.6, 14, RGBColor(0xC4,0xB5,0xFD), italic=True)

# Right side content
add_text(sl, "AI-Powered Study\nAccountability System", 4.8, 1.4, 7.8, 1.8, 36, C_TEXT, bold=True, font="Calibri")
add_text(sl, "MERN Stack  ·  TensorFlow.js  ·  Socket.io", 4.8, 3.1, 7.5, 0.5, 14, C_ACCENT_L)

# Info pills
for i, (label, val) in enumerate([("Group", "G-52"), ("Course", "MCA 2025-26"), ("University", "GLA University")]):
    bx = 4.8 + i * 2.7
    add_rect(sl, bx, 4.0, 2.4, 0.55, C_BG_CARD)
    add_text(sl, label, bx+0.12, 4.0, 2.2, 0.28, 9, C_GRAY)
    add_text(sl, val, bx+0.12, 4.28, 2.2, 0.28, 11, C_WHITE, bold=True)

# Supervisor
add_text(sl, "Supervisor: Mr. Mohd. Shavez  |  Dept. of Computer Engineering & Applications", 4.8, 5.0, 8.0, 0.4, 11, C_GRAY)

# Team names strip
add_rect(sl, 4.7, 5.7, 8.3, 1.4, C_BG_CARD)
add_text(sl, "TEAM  G-52", 4.9, 5.75, 2.0, 0.35, 10, C_ACCENT_L, bold=True)
names = "Ankit Yadav · Ankit Saini · Shivam Chaudhary · Vanshika Goyal · Varchasv Pratap"
add_text(sl, names, 4.9, 6.15, 8.0, 0.55, 11, C_TEXT)

# ══════════════════════════════════════════════
# SLIDE 2 — Problem Statement
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_RED)
slide_number(sl, 2)

add_text(sl, "The Problem", 0.7, 0.35, 8, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "Why students struggle with self-directed study", 0.7, 1.0, 9, 0.4, 14, C_GRAY)

problems = [
    ("📱", "Phone Addiction", "Students check phones every 4–6 min on average during study sessions, losing deep focus."),
    ("😴", "Procrastination", "Without accountability, 70% of study time is lost to distraction and task-switching."),
    ("🎭", "Fake Study Hours", "Traditional timers log ALL time — not just focused time — giving false productivity."),
    ("📊", "No Insights", "Students have zero data on WHEN and WHY they get distracted most."),
]

for i, (icon, title, desc) in enumerate(problems):
    col = i % 2; row = i // 2
    bx = 0.65 + col * 6.2
    by = 1.65 + row * 2.75
    add_rect(sl, bx, by, 5.9, 2.5, C_BG_CARD)
    add_rect(sl, bx, by, 0.08, 2.5, C_RED)  # left accent
    add_text(sl, icon, bx+0.25, by+0.3, 0.8, 0.9, 28, C_WHITE)
    add_text(sl, title, bx+1.1, by+0.3, 4.6, 0.45, 16, C_WHITE, bold=True)
    add_text(sl, desc, bx+1.1, by+0.82, 4.6, 1.45, 12, C_GRAY)

# ══════════════════════════════════════════════
# SLIDE 3 — Solution Overview
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_GREEN)
slide_number(sl, 3)

add_text(sl, "PadhAI — The Solution", 0.7, 0.35, 10, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "A digital supervisor that transforms unfocused hours into deep work", 0.7, 1.0, 11, 0.4, 14, C_GRAY)

# Central solution box
add_rect(sl, 4.2, 1.55, 4.9, 1.1, C_ACCENT)
add_text(sl, "🤖  PadhAI Platform", 4.4, 1.65, 4.5, 0.75, 18, C_WHITE, bold=True, align=PP_ALIGN.CENTER)

features = [
    (0.5, 3.1, "👁️ Computer Vision", "TensorFlow.js monitors webcam for 5 distraction types in real-time"),
    (0.5, 5.0, "⏱️ Smart Timer", "Socket.io pauses timer instantly on distraction — only genuine focus counted"),
    (6.8, 3.1, "🔔 Instant Alerts", "Audio beep + visual warning fires within 1.5 seconds of detection"),
    (6.8, 5.0, "📊 Deep Work Report", "Per-session focus score, distraction log & weekly analytics dashboard"),
]

for bx, by, title, desc in features:
    add_rect(sl, bx, by, 5.8, 1.7, C_BG_CARD)
    add_rect(sl, bx, by, 0.08, 1.7, C_GREEN)
    add_text(sl, title, bx+0.22, by+0.2, 5.3, 0.42, 14, C_ACCENT_L, bold=True)
    add_text(sl, desc, bx+0.22, by+0.68, 5.3, 0.9, 11.5, C_GRAY)

# ══════════════════════════════════════════════
# SLIDE 4 — Tech Stack
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_ACCENT)
slide_number(sl, 4)

add_text(sl, "Technology Stack", 0.7, 0.35, 10, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "Modern, production-grade technologies chosen for performance and scalability", 0.7, 1.0, 11, 0.4, 14, C_GRAY)

techs = [
    ("M", C_GREEN,  "MongoDB",       "NoSQL Database",       "Stores sessions, users, distraction logs with flexible schema"),
    ("E", C_YELLOW, "Express.js",    "Backend Framework",    "RESTful API with JWT auth, session routes and middleware"),
    ("R", C_ACCENT, "React 18",      "Frontend Library",     "Component-based UI with hooks, routing and real-time state"),
    ("N", C_GREEN,  "Node.js",       "Runtime Environment",  "Scalable server hosting Express + Socket.io on a single port"),
    ("T", C_RED,    "TensorFlow.js", "AI / Computer Vision", "COCO-SSD model runs entirely in-browser — no cloud needed"),
    ("S", C_ACCENT_L,"Socket.io",   "Real-time Engine",     "Bidirectional events pause/resume study timer in <50ms"),
]

cols = 3
for i, (letter, color, name, role, desc) in enumerate(techs):
    col = i % cols; row = i // cols
    bx = 0.6 + col * 4.2
    by = 1.7 + row * 2.5
    add_rect(sl, bx, by, 3.95, 2.2, C_BG_CARD)
    # Letter badge
    badge = sl.shapes.add_shape(1, Inches(bx+0.2), Inches(by+0.25), Inches(0.75), Inches(0.75))
    badge.fill.solid(); badge.fill.fore_color.rgb = color; badge.line.fill.background()
    add_text(sl, letter, bx+0.22, by+0.26, 0.7, 0.65, 22, C_WHITE, bold=True, align=PP_ALIGN.CENTER)
    add_text(sl, name, bx+1.1, by+0.22, 2.7, 0.42, 15, C_WHITE, bold=True)
    add_text(sl, role, bx+1.1, by+0.64, 2.7, 0.3, 10, color)
    add_text(sl, desc, bx+0.2, by+1.18, 3.55, 0.85, 10.5, C_GRAY)

# ══════════════════════════════════════════════
# SLIDE 5 — System Architecture
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_YELLOW)
slide_number(sl, 5)

add_text(sl, "System Architecture", 0.7, 0.35, 10, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "Three-tier MERN architecture with real-time Socket.io communication layer", 0.7, 1.0, 11, 0.4, 14, C_GRAY)

# Draw architecture flow: Browser → Node/Express → MongoDB
layers = [
    (0.55, 1.65, 3.85, 5.6, C_ACCENT,  "🖥️  CLIENT (Browser)", ["React 18 UI", "TensorFlow.js AI", "Socket.io client", "Webcam feed"]),
    (4.74, 1.65, 3.85, 5.6, C_GREEN,   "⚙️  SERVER (Node.js)", ["Express REST API", "Socket.io server", "JWT Auth", "Business logic"]),
    (8.93, 1.65, 3.85, 5.6, C_YELLOW,  "🗄️  DATABASE (Mongo)", ["Users collection", "Sessions collection", "Distractions log", "Analytics agg."]),
]

for bx, by, bw, bh, color, title, items in layers:
    add_rect(sl, bx, by, bw, bh, C_BG_CARD)
    add_rect(sl, bx, by, bw, 0.62, color)
    add_text(sl, title, bx+0.15, by+0.1, bw-0.2, 0.46, 12, C_WHITE, bold=True)
    for j, item in enumerate(items):
        add_text(sl, "• " + item, bx+0.2, by+0.9+j*1.05, bw-0.35, 0.85, 12.5, C_TEXT)

# Arrows between columns — positioned in the gap
for ax in [4.43, 8.63]:
    add_text(sl, "⇄", ax, 4.1, 0.52, 0.52, 22, C_GRAY, align=PP_ALIGN.CENTER)
    add_text(sl, "REST/WS", ax-0.04, 4.65, 0.62, 0.3, 8, C_GRAY, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════
# SLIDE 6 — AI Distraction Detection
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_RED)
slide_number(sl, 6)

add_text(sl, "AI Distraction Detection", 0.7, 0.35, 10, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "TensorFlow.js COCO-SSD model — runs 100% in-browser, no server round-trip", 0.7, 1.0, 11, 0.4, 14, C_GRAY)

# Flow steps
steps = [
    ("1", C_ACCENT,  "Webcam\nCapture", "Browser getUserMedia()"),
    ("2", C_GREEN,   "TF.js\nInference", "COCO-SSD every 1.5s"),
    ("3", C_YELLOW,  "Classify\nDistraction", "5 detection types"),
    ("4", C_RED,     "Socket.io\nEvent", "Emit to server"),
    ("5", C_ACCENT_L,"Pause Timer\n+ Alert", "Audio + Visual"),
]

for i, (num, color, title, sub) in enumerate(steps):
    bx = 0.55 + i * 2.48
    add_rect(sl, bx, 1.65, 2.15, 2.6, C_BG_CARD)
    badge = sl.shapes.add_shape(9, Inches(bx+0.65), Inches(1.82), Inches(0.85), Inches(0.85))
    badge.fill.solid(); badge.fill.fore_color.rgb = color; badge.line.fill.background()
    add_text(sl, num, bx+0.68, 1.84, 0.8, 0.75, 22, C_WHITE, bold=True, align=PP_ALIGN.CENTER)
    add_text(sl, title, bx+0.12, 2.82, 1.95, 0.65, 13, C_WHITE, bold=True, align=PP_ALIGN.CENTER)
    add_text(sl, sub, bx+0.12, 3.5, 1.95, 0.5, 9.5, C_GRAY, align=PP_ALIGN.CENTER)
    if i < 4:
        add_text(sl, "→", bx+2.18, 2.6, 0.3, 0.4, 18, C_GRAY, align=PP_ALIGN.CENTER)

# Distraction types
add_text(sl, "Detection Categories", 0.6, 4.5, 5, 0.4, 13, C_ACCENT_L, bold=True)
dist_types = [
    ("📱", "Phone Detected",   C_RED),
    ("👀", "Face Away",        C_YELLOW),
    ("🗣️", "Talking",          C_ACCENT),
    ("🚫", "Student Absent",   C_RED),
    ("👥", "Multiple People",  C_GREEN),
]
for i, (icon, label, color) in enumerate(dist_types):
    bx = 0.55 + i * 2.48
    add_rect(sl, bx, 5.05, 2.15, 1.2, C_BG_CARD)
    add_rect(sl, bx, 5.05, 2.15, 0.09, color)
    add_text(sl, f"{icon} {label}", bx+0.15, 5.22, 1.9, 0.65, 11.5, C_TEXT)

# ══════════════════════════════════════════════
# SLIDE 7 — Key Features
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_ACCENT_L)
slide_number(sl, 7)

add_text(sl, "Key Features", 0.7, 0.35, 10, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "Everything a student needs to build elite focus habits", 0.7, 1.0, 11, 0.4, 14, C_GRAY)

features = [
    ("🎯", "Virtual Study Mode",     "Webcam-based AI accountability session with real-time monitoring.",            C_ACCENT),
    ("⏸️", "Smart Timer Pause",      "Timer stops automatically on distraction. Only genuine focus time is logged.", C_RED),
    ("🔔", "Audio Alert System",     "Web Audio API generates instant beep sound on every distraction event.",       C_YELLOW),
    ("📊", "Deep Work Analytics",    "Weekly charts, subject breakdown, distraction pie chart and focus scores.",   C_GREEN),
    ("🔥", "Streak Tracking",        "Daily login streak motivates consistent study habits over weeks/months.",      C_RED),
    ("🔒", "Secure Auth System",     "JWT-based login with bcrypt password hashing and protected API routes.",       C_ACCENT_L),
]

for i, (icon, title, desc, color) in enumerate(features):
    col = i % 2; row = i // 2
    bx = 0.6 + col * 6.35
    by = 1.65 + row * 1.85
    add_rect(sl, bx, by, 6.1, 1.65, C_BG_CARD)
    add_rect(sl, bx, by, 0.08, 1.65, color)
    add_text(sl, icon, bx+0.2, by+0.25, 0.8, 0.75, 26, C_WHITE)
    add_text(sl, title, bx+1.1, by+0.22, 4.8, 0.42, 14, C_WHITE, bold=True)
    add_text(sl, desc, bx+1.1, by+0.65, 4.8, 0.85, 11, C_GRAY)

# ══════════════════════════════════════════════
# SLIDE 8 — Database Design
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_GREEN)
slide_number(sl, 8)

add_text(sl, "Database Design", 0.7, 0.35, 10, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "MongoDB collections with Mongoose schemas — flexible, scalable NoSQL design", 0.7, 1.0, 11, 0.4, 14, C_GRAY)

# User schema
add_rect(sl, 0.6, 1.65, 5.8, 5.4, C_BG_CARD)
add_rect(sl, 0.6, 1.65, 5.8, 0.52, C_GREEN)
add_text(sl, "👤  User Schema", 0.75, 1.7, 5.5, 0.42, 14, C_WHITE, bold=True)
user_fields = [
    ("name", "String", "required"),
    ("email", "String", "unique, lowercase"),
    ("password", "String", "bcrypt hashed"),
    ("streak", "Number", "daily study streak"),
    ("totalStudyMinutes", "Number", "all-time count"),
    ("lastStudyDate", "Date", "for streak calc"),
]
for j, (field, dtype, note) in enumerate(user_fields):
    by = 2.32 + j * 0.72
    add_text(sl, field, 0.85, by, 1.8, 0.5, 11.5, C_ACCENT_L, bold=True)
    add_text(sl, dtype, 2.7, by, 1.2, 0.5, 11, C_YELLOW)
    add_text(sl, note, 4.0, by, 2.2, 0.5, 10, C_GRAY)

# Session schema
add_rect(sl, 6.85, 1.65, 6.1, 5.4, C_BG_CARD)
add_rect(sl, 6.85, 1.65, 6.1, 0.52, C_ACCENT)
add_text(sl, "📚  StudySession Schema", 7.0, 1.7, 5.8, 0.42, 14, C_WHITE, bold=True)
sess_fields = [
    ("user", "ObjectId", "ref: User"),
    ("subject", "String", "required"),
    ("goalMinutes", "Number", "target duration"),
    ("focusedSeconds", "Number", "actual focus time"),
    ("distractions", "[{type, time}]", "distraction log"),
    ("focusScore", "Number", "0-100 quality score"),
    ("status", "Enum", "in_progress / completed"),
]
for j, (field, dtype, note) in enumerate(sess_fields):
    by = 2.32 + j * 0.7
    add_text(sl, field, 7.05, by, 2.1, 0.5, 11.5, C_ACCENT_L, bold=True)
    add_text(sl, dtype, 9.2, by, 1.5, 0.5, 11, C_YELLOW)
    add_text(sl, note, 10.75, by, 2.0, 0.5, 10, C_GRAY)

# ══════════════════════════════════════════════
# SLIDE 9 — Team Members
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)
accent_bar_left(sl, C_ACCENT)
slide_number(sl, 9)

add_text(sl, "Our Team — Group G-52", 0.7, 0.35, 10, 0.65, 30, C_WHITE, bold=True, font="Calibri")
add_text(sl, "MCA 2025-26  ·  Department of Computer Engineering & Applications  ·  GLA University, Mathura", 0.7, 1.0, 12, 0.4, 13, C_GRAY)

members = [
    ("AY", C_ACCENT,   "Ankit Yadav",      "12584200030", "D / 11", "7.04", "Backend Dev"),
    ("AS", C_GREEN,    "Ankit Saini",       "12584200028", "D / 10", "7.33", "Frontend Dev"),
    ("SC", C_YELLOW,   "Shivam Chaudhary",  "12584200175", "D / 40", "7.58", "AI Integration"),
    ("VG", C_RED,      "Vanshika Goyal",    "12584200203", "D / 47", "8.12", "UI/UX Design"),
    ("VP", C_ACCENT_L, "Varchasv Pratap",   "12584200205", "D / 48", "6.57", "Database & API"),
]

for i, (initials, color, name, roll, sec, cpi, role) in enumerate(members):
    bx = 0.55 + i * 2.48
    by = 1.75
    add_rect(sl, bx, by, 2.18, 4.6, C_BG_CARD)
    # Avatar circle
    circ = sl.shapes.add_shape(9, Inches(bx+0.47), Inches(by+0.22), Inches(1.25), Inches(1.25))
    circ.fill.solid(); circ.fill.fore_color.rgb = color; circ.line.fill.background()
    add_text(sl, initials, bx+0.48, by+0.36, 1.2, 0.85, 26, C_WHITE, bold=True, align=PP_ALIGN.CENTER)
    add_text(sl, name, bx+0.1, by+1.62, 2.0, 0.55, 12, C_WHITE, bold=True, align=PP_ALIGN.CENTER)
    add_text(sl, role, bx+0.1, by+2.18, 2.0, 0.35, 10, color, align=PP_ALIGN.CENTER)
    add_text(sl, roll, bx+0.1, by+2.68, 2.0, 0.32, 9.5, C_GRAY, align=PP_ALIGN.CENTER)
    add_text(sl, f"Sec-{sec}  |  CPI {cpi}", bx+0.1, by+3.1, 2.0, 0.32, 9, C_GRAY, align=PP_ALIGN.CENTER)

# Supervisor box
add_rect(sl, 0.55, 6.6, 12.3, 0.7, C_BG_CARD)
add_rect(sl, 0.55, 6.6, 0.07, 0.7, C_ACCENT)
add_text(sl, "🎓  Supervisor: Mr. Mohd. Shavez   |   Designation: Asst. Professor   |   Contact: 8960360768", 0.75, 6.72, 12.0, 0.42, 12, C_TEXT)

# ══════════════════════════════════════════════
# SLIDE 10 — Future Scope & Conclusion
# ══════════════════════════════════════════════
sl = prs.slides.add_slide(prs.slide_layouts[BLANK_LAYOUT])
dark_bg(sl)

# Full accent left strip
add_rect(sl, 0, 0, 4.5, 7.5, C_ACCENT)
add_rect(sl, 0, 0, 4.5, 7.5, RGBColor(0x1A, 0x10, 0x4A))

add_text(sl, "Future\nScope &\nConclusion", 0.3, 1.1, 3.8, 3.0, 34, C_WHITE, bold=True, font="Calibri")
add_text(sl, "Building the future of\nstudent productivity", 0.3, 4.2, 3.8, 1.0, 13, C_ACCENT_L, italic=True)

future = [
    ("🧠", "Facial Emotion AI",    "Detect stress/confusion and suggest breaks automatically."),
    ("📱", "Mobile App",           "React Native companion app with offline support."),
    ("🏆", "Leaderboard",          "Group study competitions and peer accountability features."),
    ("🤝", "Pomodoro Integration", "Built-in Pomodoro timer with AI-adjusted break intervals."),
    ("📧", "Parent Dashboard",     "Weekly focus report sent to parents/teachers via email."),
]

for i, (icon, title, desc) in enumerate(future):
    by = 1.1 + i * 1.2
    add_rect(sl, 4.8, by, 8.2, 1.05, C_BG_CARD)
    add_text(sl, icon, 5.0, by+0.18, 0.7, 0.65, 22, C_WHITE)
    add_text(sl, title, 5.75, by+0.1, 3.0, 0.38, 13, C_ACCENT_L, bold=True)
    add_text(sl, desc, 5.75, by+0.5, 7.0, 0.45, 11, C_GRAY)

slide_number(sl, 10)

# Save
out = "/home/claude/padhai/PadhAI_Presentation_G52.pptx"
prs.save(out)
print("✅ Saved:", out)

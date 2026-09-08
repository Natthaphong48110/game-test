import { RoboLevel, SequenceTask, PatternQuestion, AbstractionScenario, Badge } from '../types';

export const roboLevels: RoboLevel[] = [
  {
    id: 1,
    title: "ด่านที่ 1: เดินตรงไปข้างหน้า",
    story: "ช่วยพาน้องโรโบเดินตรงไปข้างหน้า 3 ช่อง เพื่อไปแตะธงชัยชนะสีเขียว!",
    gridSize: { rows: 4, cols: 5 },
    start: { x: 0, y: 1, dir: 'right' },
    target: { x: 3, y: 1 },
    gems: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
    obstacles: [],
    allowedBlocks: ['forward'],
    hint: "ใช้คำสั่ง 'เดินหน้า' 3 ครั้ง น้องโรโบจะเก็บพลังงานและไปถึงธงชัยชนะ",
    maxBlocks: 4
  },
  {
    id: 2,
    title: "ด่านที่ 2: เลี้ยวหลบก้อนหิน",
    story: "มีก้อนหินขวางหน้าอยู่ตรงกลาง น้องโรโบต้องเดินหน้า เลี้ยวซ้าย แล้วเดินต่อไปถึงเป้าหมาย!",
    gridSize: { rows: 4, cols: 5 },
    start: { x: 0, y: 2, dir: 'right' },
    target: { x: 3, y: 0 },
    gems: [{ x: 2, y: 2 }, { x: 2, y: 0 }],
    obstacles: [{ x: 2, y: 1, type: 'rock' }],
    allowedBlocks: ['forward', 'turn_left', 'turn_right'],
    hint: "เดินหน้า 2 ก้าว แล้วหันหน้าเลี้ยวซ้าย จากนั้นเดินหน้าต่อไป!",
    maxBlocks: 7
  },
  {
    id: 3,
    title: "ด่านที่ 3: กระโดดข้ามแอ่งน้ำ",
    story: "ข้างหน้ามีแอ่งน้ำขวางอยู่! เราเดินลุยไม่ได้ ต้องใช้พลัง 'กระโดด' ข้าม 1 ช่อง!",
    gridSize: { rows: 4, cols: 5 },
    start: { x: 0, y: 1, dir: 'right' },
    target: { x: 4, y: 1 },
    gems: [{ x: 1, y: 1 }, { x: 3, y: 1 }],
    obstacles: [{ x: 2, y: 1, type: 'water' }],
    allowedBlocks: ['forward', 'jump'],
    hint: "เดินหน้า 1 ก้าว แล้วกดคำสั่ง 'กระโดดข้าม' จากนั้นเดินหน้าต่ออีก 1 ก้าว",
    maxBlocks: 5
  },
  {
    id: 4,
    title: "ด่านที่ 4: นักสำรวจเขาวงกตตัวจิ๋ว",
    story: "ภารกิจเก็บอัญมณีพลังงานสีฟ้าให้ครบทุกเม็ดก่อนเดินเข้าสู่เส้นชัย!",
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 0, dir: 'right' },
    target: { x: 4, y: 4 },
    gems: [{ x: 2, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 2 }],
    obstacles: [
      { x: 1, y: 1, type: 'rock' },
      { x: 3, y: 1, type: 'rock' },
      { x: 2, y: 3, type: 'rock' }
    ],
    allowedBlocks: ['forward', 'turn_left', 'turn_right', 'jump'],
    hint: "วางแผนทีละจุด: เดินตรงไปช่อง (2,0) เลี้ยวขวาลงมา แล้วเดินต่อตามเส้นทาง",
    maxBlocks: 12
  }
];

export const sequenceTasks: SequenceTask[] = [
  {
    id: "brush-teeth",
    title: "ภารกิจ: แปรงฟันให้สะอาดปิ๊ง",
    description: "ช่วยน้องโรโบเรียงลำดับขั้นตอนการแปรงฟันที่ถูกต้องตั้งแต่เริ่มต้นจนเสร็จสิ้น",
    category: "สุขอนามัยในชีวิตประจำวัน",
    steps: [
      { id: "s1", text: "หยิบแปรงสีฟันและบีบยาสีฟันใส่ขนแปรง", icon: "Sparkles", order: 1 },
      { id: "s2", text: "บ้วนปากด้วยน้ำสะอาด 1 ครั้ง", icon: "Droplet", order: 2 },
      { id: "s3", text: "แปรงฟันให้ทั่วทุกซี่ ทั้งฟันบน ฟันล่าง และลิ้น อย่างน้อย 2 นาที", icon: "Smile", order: 3 },
      { id: "s4", text: "บ้วนน้ำสะอาดล้างฟองออก และล้างแปรงสีฟันให้แห้ง", icon: "CheckCircle2", order: 4 }
    ],
    successExplanation: "ยอดเยี่ยมมาก! การแปรงฟันต้องบีบยาสีฟันก่อน แล้วแปรงให้ทั่ว จากนั้นบ้วนปากตามลำดับ ถ้าสลับลำดับฟันจะไม่สะอาดนะ!"
  },
  {
    id: "chocolate-milk",
    title: "ภารกิจ: ชงนมช็อกโกแลตแสนอร่อย",
    description: "ถ้าเราอยากดื่มนมช็อกโกแลตร้อนๆ เราควรทำอะไรก่อนหลังนะ?",
    category: "การทำอาหารและเครื่องดื่ม",
    steps: [
      { id: "m1", text: "เตรียมแก้วน้ำที่สะอาดวางบนโต๊ะ", icon: "CupSoda", order: 1 },
      { id: "m2", text: "ตักผงช็อกโกแลต 2 ช้อนใส่ลงในแก้ว", icon: "Cookie", order: 2 },
      { id: "m3", text: "รินน้ำอุ่นหรือนมอุ่นลงในแก้วอย่างระมัดระวัง", icon: "Flame", order: 3 },
      { id: "m4", text: "ใช้ช้อนคนให้ผงช็อกโกแลตละลายจนเข้ากันดี", icon: "RefreshCw", order: 4 }
    ],
    successExplanation: "เก่งสุดๆ! เราต้องใส่ผงช็อกโกแลตลงแก้วก่อน แล้วเทนมอุ่นตาม จากนั้นจึงคนให้ละลายเข้ากัน อร่อยชัวร์!"
  },
  {
    id: "plant-seed",
    title: "ภารกิจ: ปลูกต้นถั่วเขียวจอมพลัง",
    description: "ต้นไม้จะโตได้ต้องมีขั้นตอนที่ถูกต้อง เรียงลำดับการปลูกให้ต้นไม้เติบโตแข็งแรงกันเถอะ",
    category: "วิทยาศาสตร์ธรรมชาติ",
    steps: [
      { id: "p1", text: "ใส่ดินร่วนลงในกระถางให้เกือบเต็ม", icon: "Flower2", order: 1 },
      { id: "p2", text: "ใช้นิ้วกดดินเป็นหลุมตื้นๆ แล้วหยอดเมล็ดถั่วเขียวลงไป", icon: "Sprout", order: 2 },
      { id: "p3", text: "กลบดินบางๆ ทับเมล็ดไว้เพื่อกันแดดเผา", icon: "Shield", order: 3 },
      { id: "p4", text: "รดน้ำพอชุ่ม แล้วนำกระถางไปวางในที่ที่มีแสงแดดส่องถึง", icon: "Sun", order: 4 }
    ],
    successExplanation: "ถูกต้องเลยครับ! ใส่ดิน หยอดเมล็ด กลบดิน และรดน้ำตามลำดับ อีกไม่กี่วันต้นกล้าก็จะงอกงามแล้ว!"
  },
  {
    id: "school-bag",
    title: "ภารกิจ: จัดกระเป๋านักเรียนตอนเย็น",
    description: "ก่อนเข้านอน ต้องเตรียมอุปกรณ์การเรียนให้พร้อมสำหรับวันพรุ่งนี้",
    category: "การจัดระเบียบ",
    steps: [
      { id: "b1", text: "เปิดดูตารางสอนของวันพรุ่งนี้ว่ามีวิชาอะไรบ้าง", icon: "Calendar", order: 1 },
      { id: "b2", text: "หยิบหนังสือและสมุดเฉพาะวิชาที่ต้องเรียนออกมา", icon: "BookOpen", order: 2 },
      { id: "b3", text: "ตรวจกล่องดินสอ ยางลบ และไม้บรรทัดว่าครบถ้วน", icon: "PenTool", order: 3 },
      { id: "b4", text: "ใส่ของทั้งหมดลงกระเป๋าอย่างเป็นระเบียบและรูดซิปปิด", icon: "CheckCheck", order: 4 }
    ],
    successExplanation: "เป๊ะมาก! ต้องดูตารางสอนก่อน จะได้ไม่แบกหนังสือหนักเกินไป การคิดเป็นระบบช่วยให้ชีวิตง่ายขึ้นเยอะ!"
  }
];

export const patternQuestions: PatternQuestion[] = [
  {
    id: "pat-1",
    title: "ปริศนาที่ 1: ผลไม้วิ่งแข่ง",
    sequence: [
      { label: "แอปเปิ้ล", icon: "🍎", color: "bg-red-100 border-red-300 text-red-700" },
      { label: "กล้วย", icon: "🍌", color: "bg-amber-100 border-amber-300 text-amber-700" },
      { label: "แอปเปิ้ล", icon: "🍎", color: "bg-red-100 border-red-300 text-red-700" },
      { label: "กล้วย", icon: "🍌", color: "bg-amber-100 border-amber-300 text-amber-700" },
      { label: "แอปเปิ้ล", icon: "🍎", color: "bg-red-100 border-red-300 text-red-700" }
    ],
    options: [
      { label: "กล้วย", icon: "🍌", color: "bg-amber-100 border-amber-300 text-amber-700" },
      { label: "แอปเปิ้ล", icon: "🍎", color: "bg-red-100 border-red-300 text-red-700" },
      { label: "ส้ม", icon: "🍊", color: "bg-orange-100 border-orange-300 text-orange-700" }
    ],
    correctIndex: 0,
    explanation: "แพทเทิร์นนี้คือการสลับกัน: แอปเปิ้ล -> กล้วย -> แอปเปิ้ล -> กล้วย -> แอปเปิ้ล ตัวต่อไปจึงต้องเป็น 'กล้วย' ครับ!"
  },
  {
    id: "pat-2",
    title: "ปริศนาที่ 2: รูปทรงเรขาคณิตจอมซน",
    sequence: [
      { label: "วงกลม", icon: "🟡", color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
      { label: "สี่เหลี่ยม", icon: "🟦", color: "bg-blue-100 border-blue-300 text-blue-700" },
      { label: "สามเหลี่ยม", icon: "🔺", color: "bg-rose-100 border-rose-300 text-rose-700" },
      { label: "วงกลม", icon: "🟡", color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
      { label: "สี่เหลี่ยม", icon: "🟦", color: "bg-blue-100 border-blue-300 text-blue-700" }
    ],
    options: [
      { label: "วงกลม", icon: "🟡", color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
      { label: "สามเหลี่ยม", icon: "🔺", color: "bg-rose-100 border-rose-300 text-rose-700" },
      { label: "ดาว", icon: "⭐", color: "bg-amber-100 border-amber-300 text-amber-700" }
    ],
    correctIndex: 1,
    explanation: "รูปแบบวนซ้ำ 3 ชิ้น คือ: วงกลม -> สี่เหลี่ยม -> สามเหลี่ยม พอครบรอบก็เริ่มใหม่ ดังนั้นถัดจากสี่เหลี่ยมคือ 'สามเหลี่ยม' ครับ!"
  },
  {
    id: "pat-3",
    title: "ปริศนาที่ 3: นับจำนวนลูกบอลพลังงาน",
    sequence: [
      { label: "2 ลูก", icon: "⚽⚽", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
      { label: "4 ลูก", icon: "⚽x4", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
      { label: "6 ลูก", icon: "⚽x6", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
      { label: "8 ลูก", icon: "⚽x8", color: "bg-emerald-100 border-emerald-300 text-emerald-700" }
    ],
    options: [
      { label: "9 ลูก", icon: "⚽x9", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
      { label: "10 ลูก", icon: "⚽x10", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
      { label: "12 ลูก", icon: "⚽x12", color: "bg-emerald-100 border-emerald-300 text-emerald-700" }
    ],
    correctIndex: 1,
    explanation: "รูปแบบนี้คือการเพิ่มขึ้นทีละ +2 (2, 4, 6, 8, ...) ดังนั้นจำนวนถัดไป 8 + 2 = 10 ลูก พอดีเป๊ะเลย!"
  },
  {
    id: "pat-4",
    title: "ปริศนาที่ 4: คำสั่งลูกศรหุ่นยนต์",
    sequence: [
      { label: "ขึ้น", icon: "⬆️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
      { label: "ขวา", icon: "➡️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
      { label: "ลง", icon: "⬇️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
      { label: "ขึ้น", icon: "⬆️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
      { label: "ขวา", icon: "➡️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" }
    ],
    options: [
      { label: "ซ้าย", icon: "⬅️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
      { label: "ลง", icon: "⬇️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
      { label: "ขึ้น", icon: "⬆️", color: "bg-indigo-100 border-indigo-300 text-indigo-700" }
    ],
    correctIndex: 1,
    explanation: "ชุดคำสั่งคือ: ขึ้น -> ขวา -> ลง (วนซ้ำ) ดังนั้นตัวถัดไปคือ 'ลูกศรชี้ลง ⬇️' สุดยอดมาก!"
  }
];

export const abstractionScenarios: AbstractionScenario[] = [
  {
    id: "abs-swim",
    title: "นักสืบคัดกรอง: เตรียมตัวไปเรียนว่ายน้ำ 🏊‍♂️",
    mission: "เลือกเฉพาะ 3 สิ่งที่ 'จำเป็นต้องใช้จริงๆ' สำหรับชั่วโมงเรียนว่ายน้ำ (คัดสิ่งไม่จำเป็นออกไป!)",
    targetCount: 3,
    items: [
      { id: "i1", name: "ชุดว่ายน้ำ", icon: "🩳", isEssential: true, reason: "จำเป็น: ต้องสวมใส่เพื่อลงสระว่ายน้ำตามกฎระเบียบ" },
      { id: "i2", name: "แว่นตาว่ายน้ำ", icon: "🥽", isEssential: true, reason: "จำเป็น: ช่วยปกป้องดวงตาจากคลอรีนและมองเห็นใต้น้ำ" },
      { id: "i3", name: "หมอนหนุนนอน", icon: "🛌", isEssential: false, reason: "ไม่จำเป็น: เราไปว่ายน้ำ ไม่ได้ไปนอนหลับนะจ๊ะ" },
      { id: "i4", name: "หมวกว่ายน้ำ", icon: "🏊", isEssential: true, reason: "จำเป็น: เก็บเส้นผมไม่ให้บังตาและน้ำในสระสะอาด" },
      { id: "i5", name: "ร่มกันฝน", icon: "☂️", isEssential: false, reason: "ไม่จำเป็น: สระว่ายน้ำในร่ม และเราตัวเปียกอยู่แล้ว" },
      { id: "i6", name: "รองเท้าโรลเลอร์เบลด", icon: "🛼", isEssential: false, reason: "ไม่จำเป็น: เล่นรอบสระอันตรายมาก ห้ามเด็ดขาด" }
    ],
    tips: "การคิดเชิงนามธรรม (Abstraction) คือการสนใจเฉพาะสิ่งที่เกี่ยวข้องกับเป้าหมายของเราเท่านั้น!"
  },
  {
    id: "abs-card",
    title: "นักสืบคัดกรอง: ข้อมูลทำบัตรประจำตัวนักเรียน 🪪",
    mission: "โรงเรียนจะทำบัตรนักเรียนให้ ข้อมูลไหนคือ 3 อย่างที่ 'สำคัญและจำเป็น' ที่สุด?",
    targetCount: 3,
    items: [
      { id: "c1", name: "ชื่อ-นามสกุล", icon: "✍️", isEssential: true, reason: "จำเป็น: บอกตัวตนชัดเจนว่าบัตรนี้เป็นของใคร" },
      { id: "c2", name: "รูปถ่ายหน้าตรง", icon: "📷", isEssential: true, reason: "จำเป็น: ยืนยันใบหน้าของเจ้าของบัตร" },
      { id: "c3", name: "ชื่อการ์ตูนที่ชอบดู", icon: "📺", isEssential: false, reason: "ไม่จำเป็น: เป็นความชอบส่วนตัว ไม่ต้องระบุในบัตรทางการ" },
      { id: "c4", name: "เลขประจำตัวนักเรียน", icon: "🔢", isEssential: true, reason: "จำเป็น: รหัสเฉพาะที่ไม่ซ้ำกับใครในโรงเรียน" },
      { id: "c5", name: "สีเสื้อตัวโปรด", icon: "👕", isEssential: false, reason: "ไม่จำเป็น: เปลี่ยนได้ทุกวัน ไม่เกี่ยวกับตัวตนนักเรียน" },
      { id: "c6", name: "ขนมที่ชอบกิน", icon: "🍩", isEssential: false, reason: "ไม่จำเป็น: ไม่ใช่ข้อมูลจำเป็นของโรงเรียน" }
    ],
    tips: "เวลาเก็บข้อมูล ให้เลือกเฉพาะข้อมูลที่นำไปใช้งานได้จริง เพื่อประหยัดพื้นที่และไม่สับสน!"
  }
];

export const badgesData: Badge[] = [
  {
    id: "first-step",
    title: "ก้าวแรกของนักคิด",
    description: "ผ่านบทเรียนหรือด่านแรกในเกมใดก็ได้",
    icon: "Footprints",
    color: "from-amber-400 to-orange-500",
    requirementStars: 1
  },
  {
    id: "robo-master",
    title: "ผู้บัญชาการหุ่นยนต์",
    description: "เขียนคำสั่งพาน้องโรโบผ่านด่านในเกมพาน้องโรโบ",
    icon: "Bot",
    color: "from-blue-400 to-cyan-500",
    requirementStars: 3
  },
  {
    id: "step-detective",
    title: "นักสืบเรียงขั้นตอน",
    description: "จัดลำดับขั้นตอนภารกิจในชีวิตประจำวันได้ถูกต้อง",
    icon: "ListChecks",
    color: "from-emerald-400 to-teal-500",
    requirementStars: 5
  },
  {
    id: "pattern-genius",
    title: "เซียนถอดรหัสแพทเทิร์น",
    description: "มองเห็นและตอบรูปแบบที่ซ่อนอยู่ได้ครบถ้วน",
    icon: "Sparkles",
    color: "from-purple-400 to-pink-500",
    requirementStars: 8
  },
  {
    id: "abstraction-hero",
    title: "ฮีโร่คัดกรองสาระสำคัญ",
    description: "แยกแยะสิ่งจำเป็นและสิ่งไม่จำเป็นได้อย่างแม่นยำ",
    icon: "Target",
    color: "from-rose-400 to-red-500",
    requirementStars: 10
  },
  {
    id: "grand-master",
    title: "ยอดอัจฉริยะอัลกอริทึม",
    description: "สะสมดวงดาวครบ 15 ดวง ครองตำแหน่งสุดยอดนักคิด!",
    icon: "Crown",
    color: "from-yellow-300 via-amber-400 to-yellow-600",
    requirementStars: 15
  }
];

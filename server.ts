import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Robot Tutor Endpoint for Kids (เรื่องอัลกอริทึมและการคิดเชิงคำนวณ)
  app.post("/api/chat", async (req, res) => {
    const { message, topic } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "โปรดระบุข้อความคำถาม" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Friendly fallback responses if API key is not yet set
      const lower = message.toLowerCase();
      let fallbackReply = "สวัสดีครับน้องๆ! พี่โรโบยินดีช่วยตอบเสมอ อัลกอริทึมก็เหมือน 'ขั้นตอนการทำสิ่งต่างๆ ทีละสเต็ป' เช่น การแปรงฟัน หรือการผูกเชือกรองเท้า ถ้าทำตามลำดับที่ถูกต้อง เราก็จะทำสำเร็จอย่างสวยงามแน่นอนครับ!";
      
      if (lower.includes("แปรงฟัน") || lower.includes("ชีวิตประจำวัน")) {
        fallbackReply = "ตัวอย่างอัลกอริทึมในชีวิตประจำวัน เช่น การแปรงฟัน: 1. บีบยาสีฟันใส่แปรง 2. บ้วนปากด้วยน้ำ 3. แปรงฟันให้ทั่วทุกซี่อย่างน้อย 2 นาที 4. บ้วนปากให้สะอาด นี่แหละคืออัลกอริทึมที่มีขั้นตอนชัดเจนครับ!";
      } else if (lower.includes("เกม") || lower.includes("เดิน") || lower.includes("หุ่นยนต์")) {
        fallbackReply = "เวลาเราเขียนโค้ดสั่งหุ่นยนต์เดินในเกม หุ่นยนต์จะทำตามคำสั่งทีละบรรทัดจากบนลงล่าง ถ้าสั่งให้เดินหน้า 2 ก้าว แล้วเลี้ยวขวา หุ่นยนต์ก็จะทำตามนั้นเป๊ะๆ เลยครับ ลองจัดลำดับคำสั่งดูนะ!";
      } else if (lower.includes("คิดเชิงคำนวณ") || lower.includes("คืออะไร")) {
        fallbackReply = "การคิดเชิงคำนวณ (Computational Thinking) มี 4 เสาหลักง่ายๆ ครับ:\n1. การแยกย่อยปัญหา (แบ่งเป็นส่วนเล็กๆ)\n2. การหารูปแบบ (สิ่งที่ซ้ำๆ หรือเหมือนกัน)\n3. การคัดกรองสาระสำคัญ (มองเฉพาะจุดที่ต้องใช้)\n4. การออกแบบอัลกอริทึม (วางขั้นตอน 1-2-3)!";
      }

      res.json({
        reply: fallbackReply,
        source: "fallback",
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `คุณคือ "พี่โรโบ" (Robo) หุ่นยนต์ผู้ช่วยสอนวิชาการคิดเชิงคำนวณและวิทยาการคำนวณ (อัลกอริทึม) สำหรับเด็กนักเรียนชั้นประถมศึกษา (อายุ 6-12 ปี)
คำแนะนำในการตอบ:
- ใช้ภาษาไทยที่เข้าใจง่าย น่ารัก อบอุ่น สุภาพ เป็นกันเอง มีความกระตือรือร้น (ใช้คำแทนตัวเองว่า 'พี่โรโบ' เรียกเด็กๆ ว่า 'น้องๆ' หรือ 'คนเก่ง')
- อธิบายสั้นกระชับ ไม่ยาวเกิน 3-4 ประโยคต่อหนึ่งหัวข้อ เพื่อไม่ให้เด็กเบื่อ
- ยกตัวอย่างสิ่งรอบตัวที่เด็กคุ้นเคย เช่น ขนม ของเล่น สัตว์เลี้ยง เกม การจัดกระเป๋า หรือการแปรงฟัน
- ตอบคำถามเกี่ยวกับ: อัลกอริทึม (Algorithm), ลำดับขั้นตอน, เงื่อนไข (If-Else), การวนซ้ำ (Loop), หรือการแก้ปัญหาในเกมฝึกสมอง
- คำถามจากน้อง: "${message}"
- หัวข้อที่กำลังเรียนรู้: "${topic || 'ทั่วไป'}"`;

      // Use robust model fallback sequence to prevent 503 high demand spikes
      const candidateModels = [
        "gemini-flash-latest",
        "gemini-3.1-flash-lite",
        "gemini-3.8-flash",
      ];

      let replyText = "";
      let modelUsed = "";

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
          });
          if (response && response.text) {
            replyText = response.text.trim();
            modelUsed = modelName;
            break;
          }
        } catch (modelErr: any) {
          // Log model failover gracefully without crashing
          console.warn(`Model ${modelName} unavailable (${modelErr?.status || modelErr?.message || 'error'}), trying next candidate...`);
        }
      }

      if (replyText) {
        res.json({
          reply: replyText,
          source: "gemini",
          model: modelUsed,
        });
        return;
      }

      // If all candidate models were temporarily unavailable
      res.json({
        reply: "พี่โรโบอยู่นี่ครับคนเก่ง! อัลกอริทึมก็คือขั้นตอน 1-2-3 ในการแก้ปัญหาหรือทำงานให้สำเร็จ เช่น ถ้าจะทำไข่เจียว ก็ต้อง 1. ตอกไข่ 2. ตีไข่ 3. ทอดในกระทะร้อนๆ ลองคิดทีละขั้นดูนะ!",
        source: "fallback",
      });
    } catch (err: any) {
      console.warn("Gemini API Handler notice:", err?.message || err);
      res.json({
        reply: "โอ๊ะโอ พี่โรโบกำลังประมวลผลอยู่ แต่อยากบอกน้องว่า การคิดทีละขั้นตามลำดับคือหัวใจสำคัญของอัลกอริทึมครับ ลองทำภารกิจต่อไปได้เลยนะ!",
        source: "fallback",
      });
    }
  });

  // Vite development middleware vs production static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

# 🎮 AlgoKids - ตะลุยโลกอัลกอริทึมและการคิดเชิงคำนวณ

เว็บแอปพลิเคชันเพื่อการเรียนรู้วิทยาการคำนวณและอัลกอริทึม สำหรับเด็กระดับชั้นประถมศึกษา

---

## 🚀 วิธีนำขึ้น GitHub และเปิดแสดงหน้าเว็บบน GitHub Pages

คุณสามารถเปิดใช้งานบน **GitHub Pages** ได้ง่ายๆ 2 วิธี ดังนี้ครับ:

### วิธีที่ 1: ใช้ GitHub Actions อัตโนมัติ (แนะนำ สะดวกที่สุด ✨)
ทางโปรเจกต์ได้ตั้งค่าไฟล์ `.github/workflows/deploy.yml` ไว้ให้เรียบร้อยแล้ว:

1. นำโค้ดทั้งหมดขึ้น GitHub Repository ของคุณ (เช่น `git add .`, `git commit -m "feat: init"`, `git push origin main`)
2. ไปที่หน้า GitHub Repository ของคุณบนเบราว์เซอร์
3. คลิกแท็บ **Settings** ด้านบน
4. เมนูด้านซ้ายเลือก **Pages**
5. ในส่วน **Build and deployment** > **Source** ให้เลือกเป็น:
   👉 **GitHub Actions**
6. ระบบ GitHub จะ Build และ Deploy ให้ทันทีอัตโนมัติ เมื่อเสร็จแล้วคุณจะได้รับ URL เว็บไซต์ทันที (เช่น `https://username.github.io/game-test/`)

---

### วิธีที่ 2: Deploy ผ่านคำสั่ง npm run deploy
หากต้องการ Deploy ผ่าน branch `gh-pages` โดยตรง:

1. เปิด Terminal ในเครื่องของคุณ
2. รันคำสั่ง:
   ```bash
   npm run deploy
   ```
3. ระบบจะทำการ build ไฟล์ static ไปยัง branch `gh-pages` บน GitHub ให้ทันที
4. ไปที่ **Settings** > **Pages** > **Source** เลือก **Deploy from a branch** แล้วเลือก branch `gh-pages` / `(root)`

---

## 💻 วิธีเปิดรันในเครื่อง (Local Development)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้นระบบทดสอบ
npm run dev

# 3. เปิดเบราว์เซอร์ที่ http://localhost:3000
```

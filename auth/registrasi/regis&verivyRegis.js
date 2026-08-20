
import express from "express";
import bcrypt from "bcryptjs";
import db from "../../db.js";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { body, query, validationResult } from "express-validator";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { authPlugins } from "mysql2";
// import router from "../../auth.js";


const router = express()
 dotenv.config();

 const transporter = nodemailer.createTransport({
  service: "gmail",
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  port:465,
  secure:false
 });


 
 function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  
    return res.status(400).json({ error: "Input tidak valid" });
  }
  return null;
 }



 const validasi = [
    body('username').isString().trim().isLength({ min: 3, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 200 })
  ]


 const pendingVerifications = new Map();


 
 router.post("/register", validasi, async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  let { username, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {

     const [getDataUser] = await db.query('SELECT username FROM users WHERE username = ?' , [username]);
     
     if(getDataUser.length !== 0){
       return res.status(500).json({error:'username sudah ada dalam database'})
     }
     


     const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
     if (existing.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
     }





    if (pendingVerifications.has(normalizedEmail)) {
      return res.status(400).json({ error: "Kode verifikasi sudah dikirim, cek email Anda." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate kode verifikasi (6 digit)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Simpan data sementara di memory
    pendingVerifications.set(normalizedEmail, {
      username,
      email: normalizedEmail,
      hashedPassword,
      verificationCode:verificationCode,
      createdAt: Date.now(),
    });

    // Kirim email
    await transporter.sendMail({
      from: `"Toko Abdilah Nurhidayat" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Kode Verifikasi Akun Anda",
      text: `Halo ${username},\n\nKode verifikasi Anda adalah: ${verificationCode}\n\nMasukkan kode ini di aplikasi untuk mengaktifkan akun Anda.\n\nKode berlaku 5 menit.`,
    });


    setTimeout(() => {
      pendingVerifications.delete(normalizedEmail);
    }, 5 * 60 * 1000);

    res.json({ message: `Kode verifikasi telah dikirim ke ${normalizedEmail}` , email:normalizedEmail });
  } catch (err) {
    console.error("Register error:", err);
    pendingVerifications.delete(normalizedEmail)
    res.status(500).json({ error: "Gagal mengirim kode verifikasi" });
  }
});



router.post("/verify", async (req, res) => {
  let { email, code } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  
  if(code == "" || !Number) return res.status(409).json({
    message:'Wajib diisi!',
    status:409
  })

  try {
    const pending = pendingVerifications.get(normalizedEmail);
    if (!pending) {
      console.log("PENDING MAP:", pendingVerifications);
      return res.status(404).json({
      error: "Sesi verifikasi tidak ditemukan. Silakan ulangi proses registrasi.",
      action: "RETRY_REGISTER",
      navigasi:'/halamanRegistrasi'
  });
    }


    if (Date.now() - pending.createdAt > 5 * 60 * 1000) {
      pendingVerifications.delete(normalizedEmail);
      return res.status(400).json({ error: "Kode verifikasi telah kedaluwarsa" });
    }

  
    if (pending.verificationCode !== code) {
      return res.status(400).json({ error: "Kode verifikasi salah" });
    }
    
    

    
    await db.query(
      "INSERT INTO users (username, email, password, is_verified) VALUES (?, ?, ?, ?)",
      [pending.username, pending.email, pending.hashedPassword, 1]
    );

    // Hapus dari cache
    pendingVerifications.delete(normalizedEmail);

    res.json({ message: "Akun berhasil diverifikasi dan disimpan ke database." });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Gagal memverifikasi akun" + err });
  }
});




router.post('/KIRIM_ULANG_OTP' , async(req, res)=> {
     
  const {email_registrasi} = req.body;

  try{
    if(!pendingVerifications.has(email_registrasi)){
        return res.status(404).json({message:'Tidak ada sesi registrasi,silahkan ulangin proses!'})    
    }

     const new_verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

     pendingVerifications.get(email_registrasi).verificationCode = new_verificationCode
     pendingVerifications.get(email_registrasi).createdAt = Date.now()

     await transporter.sendMail({
      from: `"Toko Abdilah Nurhidayat" <${process.env.EMAIL_USER}>`,
      to: email_registrasi,
      subject: "Kode Verifikasi Akun Anda",
      text: `Halo $,\n\nKode verifikasi Anda adalah: ${new_verificationCode}\n\nMasukkan kode ini di aplikasi untuk mengaktifkan akun Anda.\n\nKode berlaku 5 menit.`,
    });

     res.status(200).json({message:`Kode verifikasi telah dikirim ke ${email_registrasi}`})

  }
  catch(err){
     res.status(500).json({err:err})
  }
})


export default router;
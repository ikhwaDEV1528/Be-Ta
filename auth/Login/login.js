
import express from "express";
import bcrypt from "bcryptjs";
import db from "../../db.js";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { body, query, validationResult } from "express-validator";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { authPlugins } from "mysql2";



dotenv.config();
const router = express.Router();
const rahasia = process.env.JWT_SECRET || 'tokenRahasi';


const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max : 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler : (req,res) => {
    console.log('Masuk rate limit')
    return res.status(400).json({
      message:'Terlalu banyak Aksi , Coba lagi nanti!'
    })
  }
});

function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Input tidak valid" });
  }
  return null;
}


router.login('/login', (req,res)=> {
  res.status(200).json({message:'KENA BACKEND'})
})

// router.post("/login",loginLimiter,[body('username').isString().trim().isLength({ min: 1, max: 50 }),body('password').isString().isLength({ min: 1, max: 200 })],async (req, res) => {
//   console.log('Masuk ke login end')
//   const validationError = handleValidationErrors(req, res);
//   if (validationError) return;

//   const { username, password } = req.body;
  

//   try {
     
//     const [rows] =  await db.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);


//     if (rows.length == 0) {
//       console.log('info:' + rows[0])
//       return res.status(500).json({ message: "username salah/password salah" });
//     }


//       const isPasswordValid = await bcrypt.compare(password, rows[0].password);
//       if (!isPasswordValid) {
//         console.log('Passwrod salah')
//         return res.status(404).json({ message: "password salah" });
//       }

  
//       await db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [rows[0].id]);

//       const payload = {
//         id: rows[0].id,
//         username: rows[0].username,
//         role: rows[0].role
//       };

//       const token_accses = jwt.sign(payload, rahasia, { expiresIn: '3h' });
//       // const token_refresh = jwt.sign(payload, rahasia , {expiresIn:'3h'});


//       res.cookie('accses_token' , token_accses , {
//         httpOnly:true,
//         secure:false,
//         sameSite:'lax',
//         maxAge: 10 * 60 * 1000,
//         path:'/'
//       });

//       console.log('Token sudah dikirim ke Cookie')


//       return res.status(200).json({
//         message: "Login berhasil",
//         user: {
//           id: rows[0].id,
//           username: rows[0].username,
//           email: rows[0].email,
//           role: rows[0].role,
//           lasLogin: rows[0].last_login,
//         },
//         navigasi:rows[0].role == 'admin' ? '/Admin/Dashboard' : rows[0].role == 'user' ? '/User/Home':'/Driver/Dashboard'
//       });
      
//     } catch (err) {
//       console.error('Login error:', err);
//       return res.status(500).json({ message: err });
//     }
//   }
// );


export default router;
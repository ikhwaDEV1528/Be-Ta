import express from "express";
import db from "../../db.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt  from 'jsonwebtoken'


const resetPassword = express.Router();

dotenv.config()

const rahasia = process.env.JWT_SECRET

const loket = new Map()
const transport = new nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});



const limit = rateLimit({
  windowMs: 5 * 60 * 100,
  max: 5,
  standardHeaders:true,
  legacyHeaders:false,
  handler: (req ,res)=> {
    res.status(500).json({error:'terlalu banyak mencoba silahkan coba lagi 5 menit'})
  }
})



// endpoint untuk reset password , input username dan email sebelum ganti passowrd
resetPassword.post('/resetPass'  , async (req,res)=> {
   
    const {username , email} = req.body;
    const generate_otp =  Math.floor(100000 + Math.random() * 900000);

    try {
      const [rows] = await db.query(`SELECT username,email FROM users`);

      if(rows.some(item => item.username == username && item.email == email)){

        if(!loket.has(username)){
          loket.set(username,{nama:username,email:email,OTP:generate_otp})

            await transport.sendMail({
            from:'TOKO SEMBAKO <iwanbiru607@gmail.com>',
            to:email,
            sub:'KODE OTP',
            text:`INI ADALAH KODE OTP ANDA ${generate_otp}`
          });

          res.status(200).json({pesan:`kode OTP BERHASIL DI KIRIM KE EMAIL ${email}`})
        }
        else{
           const values_entry = loket.get(username);

            await transport.sendMail({
            from:'TOKO SEMBAKO <iwanbiru607@gmail.com>',
            to:email,
            sub:'KODE OTP',
            text:`INI ADALAH KODE OTP ANDA ${values_entry.OTP}`
          });

           res.status(200).json({pesan:`kode otp BERHASIL DI KIRIM KE EMAIL ${email}`})
        }
      }
      else{
         res.status(404).json({error:'Email / Password tidak di temukan'})
      }
    }
    catch(err){
       return res.status(500).json({error:err.message})
    };
});



// endpoint untuk verivikasi kode otp untuk reset password
resetPassword.post('/verivikasiResetPass' ,  limit , async (req,res)=> {
    const {username , OTP} = req.body;

    const entry_user = loket.has(username)
    if(entry_user){
     const values_entry = loket.get(username)
      if(values_entry.OTP == OTP){
        const payload ={
          username:username
        }
        loket.delete(username)
        const token = jwt.sign(payload,rahasia,{expiresIn:'2m'})
        res.status(200).json({pesan:'verivikasi berhasil', token:token});
      }
      else{
        res.status(401).json({error:'kode OTP salah!' + values_entry.OTP})
      }
    }
    else{
      res.status(404).json({error:'null entry'})
    }

});




 resetPassword.put('/updatePass' ,limit, async (req,res)=> {
  const {inputNewPass,username} = req.body;
  const hashNewPass = await bcrypt.hash(inputNewPass,10)
    try{
      const [rows] = await db.query(`UPDATE users SET password = ? WHERE username = ?`,[hashNewPass,username]);
      res.status(200).json({pesan:'sukses'})
    }
    catch(err){
      res.status(500).json({error:'gagal update password , coba lagi'})
    }
 })






 // RESET PASSWORD HALAMAN LOGIN //

 resetPassword.post('/RESET_PASS'  , async (req,res)=> {
   
    const {username , email} = req.body;
    const generate_otp =  Math.floor(100000 + Math.random() * 900000);

    try {
      const [rows] = await db.query(`SELECT username,email FROM users`);

      if(rows.some(item => item.username == username && item.email == email)){

        if(!loket.has(username)){
          loket.set(username,{nama:username,email:email,OTP:generate_otp})

            await transport.sendMail({
            from:'TOKO SEMBAKO <iwanbiru607@gmail.com>',
            to:email,
            sub:'KODE OTP',
            text:`INI ADALAH KODE OTP ANDA ${generate_otp}`
          });

          res.status(200).json({pesan:`kode OTP BERHASIL DI KIRIM KE EMAIL ${email}` , username:username})
        }
        else{
           const values_entry = loket.get(username);

            await transport.sendMail({
            from:'TOKO SEMBAKO <iwanbiru607@gmail.com>',
            to:email,
            sub:'KODE OTP',
            text:`INI ADALAH KODE OTP ANDA ${values_entry.OTP}`
          });

           res.status(200).json({pesan:`kode otp BERHASIL DI KIRIM KE EMAIL ${email}`, username:username})
        }
      }
      else{
         res.status(404).json({error:'Email tidak tertaut!'})
      }
    }
    catch(err){
       return res.status(500).json({error:err.message})
    };
});



// endpoint untuk verivikasi kode otp untuk reset password
resetPassword.post('/VERIVY_RESET_PASS' ,  limit , async (req,res)=> {
    const {username , OTP} = req.body;

    const entry_user = loket.has(username)
    if(entry_user){
     const values_entry = loket.get(username)
      if(values_entry.OTP == OTP){

        const payload = {
          username:username
        } 

        const token = jwt.sign(payload,rahasia , {expiresIn:'1m'})

        loket.delete(username)

        res.status(200).json({pesan:'verivikasi berhasil',token:token});
      }
      else{
        res.status(401).json({error:'kode OTP salah!'})
      }
    }
    else{
      res.status(404).json({error:'null entry'})
    }

});



// endpoint ganti password , ketika kode otp telah sinkron
 resetPassword.put('/UPDATE_PASS' ,limit, async (req,res)=> {
  const {inputNewPass,username} = req.body;
  if(!username || username == "") return res.status(404).json({
    message:'username undefined',
    status:404,
    navigasi:'/page_reset_pass'
  })
  const hashNewPass = await  bcrypt.hash(inputNewPass,10)
    try{
      const [rows] = await db.query(`UPDATE users SET password = ? WHERE username = ?`,[hashNewPass,username]);
      res.status(200).json({message:'sukses'})
    }
    catch(err){
      console.log(err)
      res.status(500).json({message:err})
    }
 })




 //  resetPassword.get('/cekData', async (req,res)=> {
 //     const {username} = req.query
 //     const getMap = daftarUserResetPassword.get(username)
 //     console.log(getMap)
 //     res.status(200).json({map:getMap})
 //  });

 export default resetPassword;
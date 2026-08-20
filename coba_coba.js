import express from "express";
import db from "./db.js";
import nodemailer from 'nodemailer'
import rateLimit from "express-rate-limit";


const coba_coba = express.Router();


// rate limit event 

const limit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max:5,
    legacyHeaders:false,
    standardHeaders:true,

    handler: (req , res) => {
        res.status(429).json('terlalu banyak aksi , silahkan coba lagi nanti!')
    }
});

// hasil dari registrasi
const loket = new Map();

const transport = new nodemailer.createTransport({
    service:'gmail',
    
    auth:{
        user:'tokoSembakoAbdillah@gmail.com',
        pass:'pass_app',
    }
});


coba_coba.post('/registrasi' , async (req, res)=> {
    const {email,username} = req.body;

    const generate_otp =  Math.floor(100000 + Math.random() * 900000);
    const [rows] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);

    if(rows.length !== 0){
       return res.status(409).json('account ini sudah ada dalam database!')
    }
    else{

    if(!loket.has(email)){
        loket.set(email,{nama:username,email:email,otp:generate_otp});


       const kirim_email = await transport.sendMail({
          from:'tokoSembakoAbdillah@gmail.com',
          to:email,
          sub:'kode otp',
          text:`ini kode otp anda ${generate_otp}`
       });

       res.status(200).json(`kode otp di kirim ke email ${email}`)
   }
   else{
       const value_loket_user = loket.get(email);

        const kirim_email = await transport.sendMail({
          from:'tokoSembakoAbdillah@gmail.com',
          to:value_loket_user.email,
          sub:'kode otp',
          text:`ini kode otp anda ${value_loket_user.otp}`
       });

       res.status(200).json(`kode OTP di kirim ke email ${value_loket_user.email}`)
   };
};
})


coba_coba.post('/coba_coba' , limit , async(req , res) => {
    const {email, otp} = req.body;
    
    if(loket.has(email)){
       const value_loket_user = loket.get(email);
      if(value_loket_user.otp == otp){
        loket.delete(email)
        res.status(200).json('berhasil verivikasi')
      }
      else{
       return res.status(401).json('kode otp salah')
      }
    }
    else{
     return res.status(404).json({error:'null entry'})
    }
});



export default coba_coba;
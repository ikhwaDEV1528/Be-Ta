
import express from "express";
import db from "./db.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


const ResetEmail = express.Router();
dotenv.config();


const aray = [['iwan',{nama:'iwan',umur:'12'}]]

const loket = new Map()


const transport = new nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

ResetEmail.post('/resetEmail' , async (req , res)=> {
    const {newEmail} = req.body;

    try{
      const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`,[newEmail])
      if(rows.length !== 0){
          res.status(409).json({error:'email ini sudah di gunakan oleh akun lain!'})
      }
      else{
        const generate_otp =  Math.floor(100000 + Math.random() * 900000);

        if(!loket.has(newEmail)){
            loket.set(newEmail,{email:newEmail , OTP:generate_otp});
            
            await transport.sendMail({
                from:'TOKO SEMBAKO <iwanbiru607@gmail.com>',
                to:newEmail,
                sub:'KODE OTP',
                text:`INI ADALAH KODE OTP ANDA ${generate_otp}`
            });

            res.status(200).json({pesan:`kode OTP BERHASIL DI KIRIM KE EMAIL ${newEmail}`})
        }
        else{
            const values_entry = loket.get(newEmail)
             await transport.sendMail({
                from:'TOKO SEMBAKO <iwanbiru607@gmail.com>',
                to:newEmail,
                sub:'KODE OTP',
                text:`INI ADALAH KODE OTP ANDA ${values_entry.OTP}`
            });
            res.status(200).json({pesan:`KODE OTP BERHASIL DI KIRIM KE EMAIL ${newEmail}`})
        }
      }
    }
    catch(err){
      res.status(500).json({error:err.message})
    }

});



ResetEmail.post('/verifyEmail' , async (req , res)=> {
    const {otp,newEmail,username} = req.body;
    
    if(loket.has(newEmail)){
        const values_entry = loket.get(newEmail)
        if(values_entry.OTP == otp){
            res.status(200).json({pesan:'verivikasi berhasil'})

            try{
                const [update_email_user] = await db.query(`UPDATE users SET email = ? WHERE username = ?`,[newEmail,username]);
                res.status(200).json({pesan:'email berhasil di ganti'});
                loket.delete(newEmail)
            }
            catch(err) {
                res.status(500).json({error:err.message})
            }
        }
    }
    else{
        res.status(404).json({error:'null entry'})
    }
})

export default ResetEmail;
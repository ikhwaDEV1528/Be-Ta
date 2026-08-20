import express from 'express';
import midtransClient from 'midtrans-client'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { query, Result } from 'express-validator';
import http from 'http'
import { Server } from 'socket.io';





const latihan = express();
const loketRegistrasi = new Map()
const transaport = new nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'iwanbiru607@gmail.com',
    pass: 'app pass'
  }
});


const limitInput = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders:false,
  legacyHeaders:true,
  handler: (res)=> {
    res.status(500).json({error:'terlalu banyak mencoba, coba lagi dalam 5 menit'})
  }
});

latihan.post('/registrasi' , async (req , res) => {
    const {email,username,pass} = req.body;
    const generateOTP = Math.floor(100000 + Math.random() * 900000);
    loketRegistrasi.set(email,{email:email,username:username,codeOTP:generateOTP})

    if(loketRegistrasi.get(email)){
      const getData = loketRegistrasi.get(email);
      await transaport.sendMail({
        from:'TOKO MINYAK <iwanbiru607@gmail.com>',
        to:email,
        subject:'KODE OTP REGISTRASI',
        text:`ini adalah kode OTP: ${getData.codeOTP}`
      });

      res.status(200).json({pesan:`kode otp berhasil di kirim ke email ${email}`});
    }
    else{
      loketRegistrasi.set(email,{email:email,username:username,codeOTP:generateOTP});
      res.status(500).json({again:'coba lagi'})
    };
});


latihan.post('/verivy' , limitInput , async (req , res)=> {
    const {email,OTP} = req.body;
    const getData = loketRegistrasi.get(email)
     try{
      if(getData.codeOTP == OTP){
        res.status(200).json({pesan:'verivikais berhasil'})
      }
      else{
        res.status(500).json({error:`kode OTP salah , periksa kembali kode yang di kirimkkan lewat email ${email}`})
      }
     }
     catch(err){
        res.status(500).json({error:err})
     }
});







export default latihan;
import express, { json } from 'express';
import midtransClient from 'midtrans-client'
import dotenv from 'dotenv'
import db from '../../db.js';
import rateLimit from 'express-rate-limit';



const payment = express.Router();
dotenv.config();




payment.post('/topup' , async (req , res)=> {
  const {userId,nominalUser,metodPayment} = req.body;

  const snap = new midtransClient.Snap({
    isProduction:false,
    serverKey:process.env.SERVER_KEY_MIDTRANS
  });

  try{
    const BuatTransaksi = await snap.createTransaction({
      transaction_details:{
        order_id:`TOPUP-${userId}-${Date.now()}`,
        gross_amount:nominalUser
      },
      customer_details:{
        first_name: userId
      },
      enabled_payments: metodPayment
    });
   
    if(!BuatTransaksi){
      console.log('gagal membuat transaksi')
      res.status(500).json({error:'gagal membuat transaksi silahkan coba lagi'})
    }
    else{
      console.log(`berhasil membuat transaksi ${userId} : ${JSON.stringify(BuatTransaksi.token)}`);
      res.status(200).json({token:BuatTransaksi.token})
    }

  }
  catch(err){
    return res.status(500).json({error: err})
  };
});



export default payment


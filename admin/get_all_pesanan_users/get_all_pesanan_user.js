import express from "express";
import db from "../../db.js";
import midtransClient from 'midtrans-client'


const admin_transaksi_pembayaran = express.Router();







admin_transaksi_pembayaran.get('/getPesananAdmin', async (req, res)=> {
  try{
    const [rows] = await db.query(`SELECT * FROM transaksi_admin`);
    res.status(200).json({data:rows});
  }
  catch(err){
    res.status(500).json({error:err});
  }
});



export default admin_transaksi_pembayaran;

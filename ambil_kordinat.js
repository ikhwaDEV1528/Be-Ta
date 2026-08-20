import express from "express";
import db from "./db.js";

const kordinat = express.Router()


kordinat.get('/endgetkordinat', async (req , res)=> {
   const {id,username} = req.query;

   try{
    const [rows_latlng] = await db.query(`SELECT latitude,longitude FROM transaksi_admin WHERE username = ? AND id_transaksi = ?`,[username,id]);
    const [rows_foto_profile] = await db.query(`SELECT gambar FROM users WHERE username = ?` , [username])
     res.status(200).json({rows:rows_latlng , profile:rows_foto_profile})
   }catch(err){
    res.status(500).json({error:err.message})
    console.log(err)
   }
});


export default kordinat 
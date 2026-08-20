import express from "express";
import db from "../../db.js";
import { io } from "../../server.js"; 



const admin_transaksi_pembayaran = express.Router();




admin_transaksi_pembayaran.put('/updatestok', async (req , res)=> {
  const {id, newStok} = req.body;

  try{
    await db.query(`UPDATE product SET stok = ? WHERE id = ?`, [newStok, id]);

    io.emit("stokupdate", { id, stok: newStok });

    res.status(200).json({pesan:'sukses update stok'})
  }
  catch(err){
    res.status(500).json({error:err});
  }
});

export default admin_transaksi_pembayaran;

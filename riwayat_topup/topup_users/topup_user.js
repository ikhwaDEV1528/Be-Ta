import express from "express";
import db from "../../db.js";


const riwayatTopup = express.Router();


riwayatTopup.get('/riwayatTopup' , async (req , res)=> {
    const {id_user} = req.query;

    try{
      const [rows] = await db.query(`SELECT * FROM status_transaksi WHERE id_user = ?`,[id_user]);
      res.status(200).json({data:rows})
    }
    catch(err){
     res.status(500).json({error:err})
    }
})


export default riwayatTopup;
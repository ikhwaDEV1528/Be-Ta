import express from "express";
import db from "./db.js";
import { io } from "./server.js";


const bahasa = express();

bahasa.put('/endbahasa', async (req , res)=> {
    const {newBahasa}= req.body;

    try{
        const [update] = await db.query(`UPDATE bahasa SET bahasa = ?`,[newBahasa])
        const [rows] = await db.query('SELECT * FROM bahasa')
        io.emit('saluranBahasa' ,{bahasabaru:rows[0].bahasa})
        res.status(200).json({pesan:'sukses ganti bahasa'})
    }
    catch(err){
       return res.status(500).json({error:err})
    }
});

bahasa.get('/getbahasa' , async (req , res)=> {
    
    try{
       const [rows] = await db.query(`SELECT * FROM bahasa`);
       res.status(200).json({rows:rows})
    }
    catch(err){
       res.status(500).json({error:err})
    }
})



export default bahasa 
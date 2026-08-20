
import express from "express";
import db from "../../db.js";


const chatRouter = express.Router();


// ambil nama username saat user cari data chat 
chatRouter.get('/end_cari_teman_chat' , async (req , res)=> {


    try{
      const [rows] = await db.query(`SELECT username,gambar FROM users`);
      res.status(200).json({data:rows})
    }
    catch(err){
      res.status(500).json({error:err})
    }
});


   

chatRouter.get('/ambilChat' , async (req,res)=> {
   
    try{
        const [rows] = await db.query('SELECT nama_teman,username,gambar FROM daftar_teman_chat');
        res.status(200).json({chat:rows})
    }
    catch(err){
        res.status(409).json({error:'gagal ambil chat'})
    }
});



// chatRouter.get('/ambilChatAdmin' , async (req,res)=> {
   
//     try{
//         const [rows] = await db.query('SELECT nama_teman,username,gambar FROM daftar_teman_chat');
//         res.status(200).json({chat:rows})
//     }
//     catch(err){
//         res.status(409).json({error:'gagal ambil chat'})
//     }
// });


export default chatRouter;

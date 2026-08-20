import express from "express";
import db from "../../db.js";


const chatRouter = express.Router();




chatRouter.put('/end_edit_profile_teman_chat_user' , async (req , res)=> {
     const {new_profile,username} = req.body;

     try{
       const [update_profile] = await db.query('UPDATE daftar_teman_chat SET gambar = ? WHERE nama_teman = ? ',[new_profile,username]);
       res.status(200).json({pesan:'profile berhasil di ubah'})
     }
     catch(err){
        res.status(500).json({error:err})
     }
 })

 export default chatRouter;

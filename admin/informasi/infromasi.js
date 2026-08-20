
import express from "express";
import db from "../../db.js";


const infromasi = express.Router()

infromasi.post('/post_informasi' , async (req , res) => {
    const {isi,judul,id_user} = req.body;

    try{
       const [rows] =  await db.query(`INSERT INTO infromasi_admin (isi,judul,id_user) VALUES(?,?,?)`,[isi,judul,id_user])
       res.status(200).json({pesan:'berhasil'})
    }
    catch(err){
         res.status(500).json({error:err})
    }
});



infromasi.get('/get_informasi' , async (req , res)=> {

    try{
      const [rows] = await db.query(`SELECT * FROM infromasi_admin`);
      res.status(200).json({rows:rows})
    }
    catch(err){
      res.status(500).json({error:err})
    } 
});



infromasi.delete('/delete_informasi' , async (req , res)=> {
     const {id} = req.query;

     try{
       const [delete_rows] = await db.query(`DELETE FROM infromasi_admin WHERE id = ? `,[id])
       res.status(200).json({pesan:'berhasil hapus data'})
     }
     catch(err){
        res.status(500).json({error:err})
     }
});


export default infromasi;
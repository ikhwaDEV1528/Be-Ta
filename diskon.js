import express from 'express';
import db from './db.js';


const diskon = express.Router();

diskon.post('/end_post_diskon', async (req , res)=> {
    const {nama_diskon , nominal_diskon , minimal_belanja } = req.body;

    try{
        const [post] = await db.query('INSERT INTO diskon(nama_diskon,diskon,minimal_belanja) VALUES(?,?,?)',[nama_diskon,nominal_diskon,minimal_belanja])
         res.status(200).json({pesan:'berhasil tambah diskon'})
    }
    catch(err){
       return  res.status(500).json({error:err})
    }
})



diskon.get('/end_get_diskon', async (req , res)=> {

    try{
        const [rows] = await db.query(`SELECT * FROM diskon`)
        res.status(200).json({pesan:rows})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
})




export default diskon;
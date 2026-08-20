import express from "express";
import db from "../db.js";

const alamat = express.Router()

alamat.post('/alamatUser' , async (req , res)=> {
    const {inputAlamat,username} = req.body;

   

    try{
        const [rows] = await db.query(`SELECT username FROM alamat_user WHERE username = ?`,[username]);

        if(rows.length == 0){
            const [updateAlamatUser] = await db.query(`INSERT INTO alamat_user (username,alamat) VALUES (?,?)`,[username,inputAlamat])
            res.status(200).json({pesan:'alamat di tambahkan'})
        }
        else{
            const [update] = await db.query(`UPDATE alamat_user SET alamat = ? WHERE username = ?`,[inputAlamat,username])
            res.status(200).json({pesan:'alamat di perbarui'})
        }
    }
    catch(err){
        res.status(500).json({error:'gagal simpan alamat'})
    }
})

alamat.get('/getAlamat' , async (req , res)=> {
    const {username} = req.query;

    try{
        const [rows] = await db.query('SELECT alamat FROM alamat_user WHERE username = ?' ,[username]);
        res.status(200).json({alamat:rows})
    }
    catch(err){
        res.status(500).json({error:err})
    }
})


export default alamat;
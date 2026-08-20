import db from '../../db.js';
import express from 'express';



const produk = express();


produk.get('/produk' , async (req, res) => {
    
    try{
        const [rows] = await db.query(`SELECT * FROM product`)
        res.status(200).json(rows)
    }
    catch(err){
        res.status(500).json(err)
    }
})

export default produk;
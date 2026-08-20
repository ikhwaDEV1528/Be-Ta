import db from "../../db.js";
import express from "express";
import { Route } from "express";
import { query } from "express-validator";

 const RouterTransaksi = express.Router()



RouterTransaksi.get('/get_order_user' , async(req,res)=> {
    
    const {username} = req.query;

    try{
        const [getRows] = await db.query(`SELECT * FROM order_user WHERE username = ?` ,[username]);
        res.status(200).json({dataProduk:getRows})
    }
    catch(err){
        res.status(500).json({eror:'gagal'})
    }
})


export default RouterTransaksi;


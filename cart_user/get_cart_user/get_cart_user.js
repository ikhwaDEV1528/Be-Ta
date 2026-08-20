import express from "express";
import db from "../../db.js";


const cart = express.Router();


cart.get('/getcart' , async (req , res) => {
    const {username} = req.query;

    try{
        const [getCart] = await db.query(`SELECT * FROM cart_user WHERE username = ?`,[username]);
        res.status(200).json({dataCart:getCart})
    }
    catch(er){
        res.status(500).json({error:er})
    }
});


export default cart;
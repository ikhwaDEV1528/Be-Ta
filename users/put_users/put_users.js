
import express from "express";
import db from "../../db.js";
import { body, query, validationResult } from "express-validator";


const router = express.Router();



// edit poto user //
 router.put('/edit_profile' , async (req , res)=> {
     const {username, new_profile} = req.body;

     try{
       const [update_profile] = await db.query('UPDATE users SET gambar = ? WHERE username = ? ',[new_profile,username]);
       res.status(200).json({pesan:'profile berhasil di ubah'})
     }
     catch(err){
        res.status(500).json({error:err})
     }
 })

const validasi = [
    body('username').isString().trim().isLength({ min: 3, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 200 })
  ]


  export default router;

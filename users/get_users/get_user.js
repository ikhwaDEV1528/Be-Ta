
import express from "express";
import db from "../../db.js";
import { body, query, validationResult } from "express-validator";



const router = express.Router();



function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  
    return res.status(400).json({ error: "Input tidak valid" });
  }
  return null;
}


// router.get('/users',

//   [ query('username').optional().isString().trim().isLength({ min: 1, max: 50 }) ],
//   async (req, res) => {
//     // validasi

//     const validationError = handleValidationErrors(req, res);
//     if (validationError) return;

//     const { username } = req.query;

//     try {
//       let rows;
//       if (username) {
   
//         const [result] = await db.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
//         rows = result;
//       } else {
//         return res.status(404).json({error:'gagal ambil data user'})
//       }

//       return res.status(200).json({ dataDb: rows });
//     } catch (err) {
//       console.error('Gagal ambil data:', err);
//       // jangan kirim err.message ke client
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   }
// );




router.get('/users', async (req, res) => {
    
   

    const { username } = req.query;

    try {
      let rows;
      if (username) {
   
        const [result] = await db.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
        rows = result;
      } else {
        return res.status(405).json({error:'gagal ambil data user'})
      }

      return res.status(200).json({ dataDb: rows });
    } catch (err) {
      console.error('Gagal ambil data:', err);
      // jangan kirim err.message ke client
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);





router.get('/getPesanan', async (req, res)=> {
  const {username} = req.query;

  try{
    const [rows] = await db.query(
      `SELECT * FROM transaksi_admin WHERE username = ?`,
      [username]
    );
    res.status(200).json({data:rows});
  }
  catch(err){
    res.status(500).json({error:err});
  }
});


export default router;

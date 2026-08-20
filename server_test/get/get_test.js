// import express from "express";
// import db from "../../db.js";


// const ROUTE_TEST_GET = express();


// ROUTE_TEST_GET.get('/SUBTOTAL' , async (req , res) => {
//     const {username} = req.query;

//     try {
//       const [select_orders] = await db.query(`SELECT SUM(total_harga) FROM order_user WHERE username = ?`);
//       console.log(select_orders[0])
//       res.status(200).json({message:select_orders[0]})
//     } catch (err) {
//       res.status(500).json({error:err})
//     }
// });




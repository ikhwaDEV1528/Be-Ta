import db from '../../db.js';
import express from 'express';
import { CheckToken } from '../../middleware/cek_token/cek_token.js';

const order_user = express()




order_user.put('/upateDataProdukPlus' ,  async (req , res) => {
  const {qty,total,id,username,nama_produk} = req.body;


  try{
    const [updateQtyAndTotalHarga] = await db.query(`UPDATE order_user SET jumlah = ? , total_harga = ?  WHERE username = ? AND product_id = ? AND nama_produk = ? `,[qty,total,username,id,nama_produk]);
    res.status(200).json({pesan:'berhasil update'});

  }
  catch(err){
    res.status(500).json({error:err})
  }

});



order_user.put('/upateDataProdukMin' ,  async (req , res) => {
  const {qty,total,nama_produk,id,username} = req.body;


  try{
    const [updateQtyAndTotalHarga] = await db.query(`UPDATE order_user SET jumlah = ? , total_harga = ?  WHERE username = ? AND product_id = ? AND nama_produk = ?`,[qty,total,username,id,nama_produk]);
    res.status(200).json({pesan:'berhasil update'})
  }
  catch(err){
    res.status(500).json({error:err})
  }

})





order_user.put('/TambahDrigen' , async (req , res) => {
   const {username , nama_produk , newQty} = req.body;

   try{
     const rows = await db.query(`UPDATE order_user SET qty_drigen = ? , total_harga = total_harga + ? WHERE username = ? AND nama_produk = ?`,[newQty , 15000 , username ,nama_produk])
     res.status(200).json({pesan:'sukses nambah qty drigen'})
   }
   catch(err){
     res.status(500).json({error:err})
   }
})



order_user.put('/KurangDrigen' , async (req , res) => {
   const {username , nama_produk , newQty} = req.body;

   try{
     const rows = await db.query(`UPDATE order_user SET qty_drigen = ? , total_harga = total_harga - ? WHERE username = ? AND nama_produk = ?`,[newQty , 15000 , username ,nama_produk])
     res.status(200).json({pesan:'sukses nambah qty drigen'})
   }
   catch(err){
     res.status(500).json({error:err})
   }
})




order_user.put('/updateQtyDrigenToZero' , async (req , res) => {
   const {username , nama_produk } = req.body;

   try{
     const rows = await db.query(`UPDATE order_user SET qty_drigen = ? , total_harga = ? WHERE username = ? AND nama_produk = ?`,[0 , 0 , username ,nama_produk])
     res.status(200).json({pesan:'sukses update qty drigen to zero'})
   }
   catch(err){
     res.status(500).json({error:err})
   }
})






order_user.put('/u', async (req, res) => {
  const { username } = req.body;
  console.log(`NEMBAK API U DAN USERNAME = ${username}`)
  
  try {
    const [delete_order] = await db.query(`DELETE FROM order_user WHERE username = ?` , [username])

    res.status(200).json({ pesan: 'sukses zero' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});









export default order_user;

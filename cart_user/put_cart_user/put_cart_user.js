
import express from "express";
import db from "../../db.js";


const cart = express.Router();




// ADD PRODUK KE CART (PERTAMA KALI) //
cart.put('/updatecart' , async (req , res)=> {
    const {username,product_id,harga} = req.body;

    try{
        const [updatecar] = await db.query(`UPDATE cart_user SET jumlah = ? , total_harga = ? WHERE username = ? AND product_id = ?`,[1,harga,username,product_id])
        console.log('berhasl update jumlah')
        res.status(200).json({pesan:'berhasil'})
    }
    catch(err){
      res.status(400).json({error:err})
    }
});



// TAMBAH JUMLAH CARTT //
cart.put('/updateCartPlus' , async (req , res)=> {
  const {newQtyCart , username , id, newHarga } = req.body;
 
  const newHargaPars = parseFloat(newHarga)
  try{
     const [updateQtyCart] = await db.query(`UPDATE cart_user SET jumlah = ? WHERE username = ? AND product_id = ?`,[newQtyCart,username,id]);
     const [updateHargaCart] = await db.query(`UPDATE cart_user SET total_harga = ? WHERE username = ? AND product_id = ?`,[newHargaPars,username,id])
     res.status(200).json({pesan:'berhasil update qty cart'})
     console.log('berhasil update qty cart')
  }
  catch(err){
    res.status(500).json({error:'jaja'})
  }
});



// KURANGIN JUMLAH CART //
cart.put('/updateCartMin' , async (req , res)=> {
  const {newQtyCart , username , id, newHarga , new_qty_drigen_cart } = req.body;
 
  const newHargaPars = parseFloat(newHarga)
  try{
     const [updateQtyCart] = await db.query(`UPDATE cart_user SET jumlah = ? , qty_drigen = ? WHERE username = ? AND product_id = ?`,[newQtyCart,new_qty_drigen_cart,username,id]);
     const [updateHargaCart] = await db.query(`UPDATE cart_user SET total_harga = ? WHERE username = ? AND product_id = ?`,[newHargaPars,username,id])
     res.status(200).json({pesan:'berhasil update qty cart'})
     console.log('berhasil update qty cart')
  }
  catch(err){
    res.status(500).json({error:'jaja'})
  }
});






cart.put('/TambahDrigen_cart' , async (req , res) => {
   const {username , nama_produk , newQty} = req.body;

   try{
     const rows = await db.query(`UPDATE cart_user SET qty_drigen = ? , total_harga = total_harga + ? WHERE username = ? AND nama_produk = ?`,[newQty , 15000 , username ,nama_produk])
     res.status(200).json({pesan:'sukses nambah qty drigen cart'})
   }
   catch(err){
     res.status(500).json({error:err})
   }
})



cart.put('/KurangDrigen_cart' , async (req , res) => {
   const {username , nama_produk , newQty , total_harga} = req.body;

   try{
     const rows = await db.query(`UPDATE cart_user SET qty_drigen = ? , total_harga = total_harga - ? WHERE username = ? AND nama_produk = ?`,[newQty , 15000 , username ,nama_produk])
     res.status(200).json({pesan:'sukses nambah qty drigen cart'})
   }
   catch(err){
     res.status(500).json({error:err})
   }
})





cart.put('/ucart', async (req, res) => {
  const { username } = req.body;
  
  try {
    const [delete_order] = await db.query(`DELETE FROM cart_user WHERE username = ?` , [username])

    res.status(200).json({ pesan: 'sukses zero' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default cart;

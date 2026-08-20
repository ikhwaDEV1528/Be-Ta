import express from "express";
import db from "../../db.js";


const ROUTE_TEST = express();


// tambah pesanan orders //

ROUTE_TEST.put('/TAMBAH_PESANAN', async (req , res)=> {
    const {username , product_id, total_harga, jumlah, nama_produk,id_user} = req.body;

    try {
      const [select_product] = await db.query('SELECT stok FROM product WHERE id = ?', [product_id])
      if(select_product[0].stok == 0 || select_product[0].stok < 0) {
        return res.status(405).json({error:'Stok habis'})
      }

      const [select_orders] = await db.query(`SELECT id FROM order_user WHERE username = ? AND  product_id = ? `, [username , product_id]);
      
      if(select_orders.length == 0) {
        const [insert_orders] = await db.query('INSERT INTO order_user(username,jumlah,total_harga,product_id,nama_produk, id_user) VALUES(?,?,?,?,?,?)',[username,jumlah,total_harga,product_id,nama_produk,id_user]);
        const [select_orders] = await db.query(`SELECT SUM(total_harga) AS total_harga FROM order_user WHERE username = ?`, [username])
        return res.status(200).json({message:'Berhasil menambahkan produk', subTotal:select_orders})
      }
      else{
        const [update_orders] = await db.query(`UPDATE order_user SET jumlah = ? , total_harga = ? WHERE username = ? AND product_id = ?`, [jumlah , total_harga , username , product_id]);
        const [select_orders] = await db.query(`SELECT SUM(total_harga) AS total_harga FROM order_user WHERE username = ?`, [username])

        return res.status(200).json({message:'Pesanan berhasil di perbarui!', subTotal:select_orders})
      }
    } catch (err) {
      res.status(500).json({error:err})
      console.log(err)
      return;
    }
})



// kurang orders //

ROUTE_TEST.delete('/KURANG_PESANAN' , async (req , res)=> {
    const {username , product_id , jumlah , total_harga} = req.query;
    console.log(jumlah  + total_harga)
    try {
      const [select_orders] = await db.query(`SELECT id FROM order_user WHERE username = ? AND product_id = ?` , [username,product_id]);

      if(select_orders.length > 0){
        if(jumlah == 0){
            const [delete_orders] = await db.query(`DELETE FROM order_user WHERE username = ? AND product_id = ?` , [username , product_id]);
            const [select_orders] = await db.query(`SELECT SUM(total_harga) AS total_harga FROM order_user WHERE username = ?`, [username])
            return res.status(200).json({message:'Produk berhasil di hapus dari orders!', subTotal:select_orders})
        }
        else{
            const [update_orders] = await db.query(`UPDATE order_user SET jumlah = ? , total_harga = ? WHERE username = ? AND product_id = ?` , [jumlah , total_harga , username , product_id]);
            const [select_orders] = await db.query(`SELECT SUM(total_harga) AS total_harga FROM order_user WHERE username = ?`, [username])
            return res.status(200).json({message:'Pesanan berhasil di update!' , subTotal:select_orders})
        }
      }
      else{
        return res.status(404).json({message:'Ga ketemu data nya nih!'})
      }
    } catch (err) {
      res.status(500).json({error:err})
    }
})




// ROUTE_TEST.post('/TAMBAH_ORDER' , async (req , res) => {
//     const { username,nama_produk,product_id,total_harga} = req.body;

//     try {
//       const [insert_orders] = await db.query('INSERT INTO order_user(username,jumlah,total_harga,product_id,nama_produk)',[username,jumlah,total_harga,product_id,nama_produk]);
//     } catch (err) {

//     }

// })




// hasil total harga //
ROUTE_TEST.get('/SUBTOTAL' , async (req , res) => {
    const {username} = req.query;

    try {
      const [select_orders] = await db.query(`SELECT SUM(total_harga) AS total_harga FROM order_user WHERE username = ?`,[username]);
      console.log(select_orders)
      res.status(200).json(select_orders)
    } catch (err) {
      res.status(500).json({error:err})
    }
});


// tambah pesanan ke dalam keranjang //

ROUTE_TEST.post('/TAMBAH_PESANAN_KEDALAM_KERANJANG' ,async (req , res) => {
  const {username , nama_produk , harga , jumlah , total_harga , product_id,id_user, gambar_produk} = req.body;
  
  try {
    const [select_cart_user] = await db.query(`SELECT id FROM cart_user WHERE username = ? AND product_id = ?` , [username , product_id]);
    if(select_cart_user.length == 0){
      const [insert_cart_user] = await db.query(`INSERT INTO cart_user (username,nama_produk,jumlah,total_harga,harga_produk ,product_id,id_user, gambar) VALUES(?,?,?,?,?,?,?,?)`,[username,nama_produk,jumlah,total_harga,harga,product_id,id_user,gambar_produk])
      res.status(200).json({message:'Pesanan di tambahkan ke dalam keranjang!'})
      return;
    }
    else{
      res.status(409).json({error:'Pesanan ini sudah dalam keranjang!'})
    }
  } catch(err) {
    res.status(500).json({error:err.message})
  }
})



ROUTE_TEST.put('/TAMBAH_KERANJANG' , async (req, res) => {
  const {username , product_id, jumlah , total_harga} = req.body;
  console.log([username,product_id])
  try {
    const [update_cart_user] = await db.query(`UPDATE cart_user SET jumlah = ? , total_harga = ? WHERE username = ? AND product_id = ?` , [jumlah , total_harga , username , product_id]);
     res.status(200).json({message:'Jumlah pesanan berhasil di perbarui!'})
  } catch(err) {
     res.status(500).json({error:err.message})
  }
})



ROUTE_TEST.delete('/KURANG_KERANJANG' , async (req, res) => {
  const {username , product_id, jumlah , total_harga} = req.query;
  console.log([username,product_id])
  try {
    if(jumlah == 0) {
      const [delete_cart_user] = await db.query(`DELETE FROM cart_user WHERE username = ? AND product_id = ?`,[username,product_id]);
      return res.status(200).json({message:'Pesanan berhasil di hapus!'})
    }
    const [update_cart_user] = await db.query(`UPDATE cart_user SET jumlah = ? , total_harga = ? WHERE username = ? AND product_id = ?` , [jumlah , total_harga , username , product_id]);
    res.status(200).json({message:'Jumlah pesanan berhasil di perbarui!'})
  } catch(err) {
     res.status(500).json({error:err.message})
  }
})



ROUTE_TEST.get('/GET_DRIGEN' , async (req, res) => {
  const {username} = req.query;

  try {
   const [select_drigen] = await db.query(`SELECT qty_drigen,product_id FROM order_user WHERE username = ?`,[username])
   res.status(200).json(select_drigen)
  } catch (err) {
    res.status({error:err.message})
  }
})


ROUTE_TEST.put('/TAMBAH_DRIGEN' , async (req , res) => {
  const {username , product_id } = req.body;
  
  try {
    const [select_drigen] = await db.query(`SELECT qty_drigen,total_harga FROM order_user WHERE username = ? AND product_id = ?` , [username , product_id]);
    if(select_drigen.length == 0) return res.status(404).json({error:'Tidak ada produk yang ditemukan'});

    const jumlah_drigen = select_drigen[0].qty_drigen;
    const jumlah_drigen_baru = jumlah_drigen + 1
    const total_harga_baru = select_drigen[0].total_harga + 15000;

    // UPDATE //
    const [update_drigen] = await db.query(`UPDATE order_user SET qty_drigen = ? , total_harga = ? WHERE username = ? AND product_id = ?` ,[jumlah_drigen_baru ,total_harga_baru, username , product_id])
    
    // SUBTOTAL //
    const [subTotal] = await db.query(`SELECT SUM(total_harga) AS total_harga FROM order_user WHERE username = ? ` , [username]);

    res.status(200).json({
      message:'Jumlah drigen diperbarui!',
      subTotal:subTotal
    })
  } catch (err) {
    res.status(500).json({error:err})
    console.log(err.message)
  }
});





ROUTE_TEST.put('/KURANG_DRIGEN' , async (req , res) => {
  const {username , product_id } = req.body;
  
  try {
    const [select_drigen] = await db.query(`SELECT qty_drigen,total_harga FROM order_user WHERE username = ? AND product_id = ?` , [username , product_id]);
    if(select_drigen.length == 0) return res.status(404).json({error:'Tidak ada produk yang ditemukan'});

    const jumlah_drigen = select_drigen[0].qty_drigen;
     if(jumlah_drigen == 0) return res.status(405).json({error:'Sudah kosong!'});

    const jumlah_drigen_baru = Math.max(jumlah_drigen - 1 , 0) 
    const total_harga_baru = Math.max(select_drigen[0].total_harga - 15000 , 0);
    const [update_drigen] = await db.query(`UPDATE order_user SET qty_drigen = ? , total_harga = ? WHERE username = ? AND product_id = ?` ,[jumlah_drigen_baru ,total_harga_baru, username , product_id])
    
    const [subTotal] = await db.query(`SELECT SUM(total_harga) AS total_harga FROM order_user WHERE username = ? ` , [username]);

    res.status(200).json({
      message:'Jumlah drigen diperbarui!',
      subTotal:subTotal
    })
  } catch (err) {
    res.status(500).json({error:err})
    console.log(err.message)
  }
});



export default ROUTE_TEST;
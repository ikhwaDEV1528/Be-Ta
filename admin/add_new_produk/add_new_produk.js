
import express from "express";
import db from "../../db.js";


const routerProduk = express.Router();




routerProduk.post('/add_produk', async (req, res) => {
  const { nama_produk, harga_produk, stok_produk , value_gambar , label} = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1️⃣ Tambah produk
    const [result] = await db.query(
      `INSERT INTO product (nama, harga, stok , gambar, kategori) VALUES (?, ?, ?, ?, ?)`,
      [nama_produk, harga_produk, stok_produk, value_gambar,label]
    );

    res.status(200).json({
      pesan: 'Produk di tambahkan'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'gagal tambah produk & sinkronisasi user' });
  } 
});


export default routerProduk;
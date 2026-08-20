import db from "../../db.js";
import express from "express";

import { Route } from "express";
import { query } from "express-validator";


 const RouterTransaksi = express.Router()

 RouterTransaksi.post('/order_user', async (req, res) => {
  const {
    username,
    productId,
    nama_produk,
    jumlahProduk,
    totalHarga
  } = req.body;

  try {
    // validasi basic
    if (!Array.isArray(productId) || !Array.isArray(nama_produk)) {
      return res.status(400).json({ error: 'productId & nama_produk harus array' });
    }

    if (productId.length !== nama_produk.length) {
      return res.status(400).json({ error: 'jumlah productId dan nama_produk tidak sama' });
    }

    // bikin values secara dinamis
    const values = productId.map((id, index) => [
      username,
      id,
      nama_produk[index],
      jumlahProduk,
      totalHarga
    ]);

    const sql = `
      INSERT INTO order_user 
      (username, product_id, nama_produk, jumlah, total_harga)
      VALUES ?
    `;

    await db.query(sql, [values]);

    res.status(200).json({ pesan: 'berhasil' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'gagal tambah data transaksi' });
  }
 });


 export default RouterTransaksi;
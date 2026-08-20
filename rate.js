import express from "express";
import db from "./db.js";

const rate = express.Router();

rate.put('/endRate', async (req, res) => {
  console.log('Masuk rat');
  const { username, nama_produk } = req.body;
  const satu = 1;

  try {
    // Cek status rate di tabel order_user (atau cart_user sesuai kebutuhan utama)
    const [rows_nonCart_user] = await db.query(
      'SELECT status_rate FROM order_user WHERE username = ? AND nama_produk = ?', 
      [username, nama_produk]
    );

    // Jika produk tidak ditemukan di riwayat pesanan
    if (rows_nonCart_user.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan pada riwayat order user' });
    }

    // Cek apakah sudah pernah di-rate (asumsi jika status_rate > 0 berarti sudah)
    if (rows_nonCart_user[0].status_rate > 0) {
      console.log('produk sudah di rate');
      return res.status(409).json({ error: 'Produk ini sudah anda Rate' });
    }

    console.log('sukses tambah rate');
    
    // Update tabel product (menambah jumlah rating produk)
    await db.query(
      'UPDATE product SET rate_produk = rate_produk + ? WHERE nama = ?', 
      [satu, nama_produk]
    );
    
    // Update status rate di order_user
    await db.query(
      'UPDATE order_user SET status_rate = status_rate + ? WHERE username = ? AND nama_produk = ?', 
      [satu, username, nama_produk]
    );

    // Update status rate di cart_user jika ada (menggunakan LEFT JOIN / opsional, atau query terpisah jika pasti ada)
    await db.query(
      'UPDATE cart_user SET status_rate = status_rate + ? WHERE username = ? AND nama_produk = ?', 
      [satu, username, nama_produk]
    );

    return res.status(200).json({ pesan: 'sukses tambah rate' });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message || err });
  }
});

rate.get('/end_get_rate', async (req, res) => {
  const { username } = req.query;

  try {
    const [rows1] = await db.query('SELECT status_rate FROM order_user WHERE username = ?', [username]);
    const [rows2] = await db.query('SELECT status_rate FROM cart_user WHERE username = ?', [username]);
    return res.status(200).json({ pesan: [rows1, rows2] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message || err });
  }
});

export default rate;
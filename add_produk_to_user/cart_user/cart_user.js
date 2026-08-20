import express from "express";
import db from "../../db.js";


const cart = express.Router();


cart.post('/cart', async (req, res) => {
  const {
    username,
    productId,
    nama_produk,
    harga,
    jumlahProduk,
    totalHarga
  } = req.body;

  try {
    // validasi array
    if (
      !Array.isArray(productId) ||
      !Array.isArray(nama_produk) ||
      !Array.isArray(harga)
    ) {
      return res.status(400).json({ error: 'productId, nama_produk, harga harus array' });
    }

    if (
      productId.length !== nama_produk.length ||
      productId.length !== harga.length
    ) {
      return res.status(400).json({ error: 'jumlah array tidak sama' });
    }

    // cek cart user
    const [getCart] = await db.query(
      'SELECT * FROM cart_user WHERE username = ?',
      [username]
    );

    if (getCart.length > 0) {
      return res.status(409).json({ error: 'data cart sudah ada' });
    }

    // bikin data insert DINAMIS
    const values = productId.map((id, index) => [
      username,
      id,
      nama_produk[index],
      jumlahProduk,
      totalHarga,
      harga[index]
    ]);

    const sql = `
      INSERT INTO cart_user
      (username, product_id, nama_produk, jumlah, total_harga, harga_produk)
      VALUES ?
    `;

    await db.query(sql, [values]);

    res.status(200).json({ pesan: 'berhasil tambah data cart user' });
    console.log('berhasil');

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'gagal tambah cart user' });
  }
});


export default cart;
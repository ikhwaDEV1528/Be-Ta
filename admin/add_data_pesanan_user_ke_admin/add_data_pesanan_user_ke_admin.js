

import express from "express";
import db from "../../db.js";



const admin_transaksi_pembayaran = express.Router();

function toMysqlDatetimeUTCtoWIB(date) {
  const d = new Date(date);
  const wib = new Date(d.getTime() + (7 * 60 * 60 * 1000)); // Tambah 7 jam
  return wib.toISOString().slice(0, 19).replace("T", " ");
}


admin_transaksi_pembayaran.post('/tabelTransaksi', async (req, res) => {
  const {
    tanggal_dibuat,
    username,
    id_produk,
    nama_produk,
    jumlah,
    total_harga,
    total_dibayar,
    status_transaksi,
    latitude,
    longitude,
    metode_pembayaran,
    alamat,
    qty_drigen,
    id_user
  } = req.body;

  try {
    // Validasi
    if (!Array.isArray(id_produk)) {
      throw new Error('Data produk harus berupa array');
    }

    // KONVERSI TANGGAL UTC → WIB
    const tanggalWIB = toMysqlDatetimeUTCtoWIB(tanggal_dibuat);

    // Loop insert setiap produk
    for (let i = 0; i < id_produk.length; i++) {
      await db.query(
        `INSERT INTO transaksi_admin (
          tanggal_dibuat,
          username,
          produk_id,
          nama_produk,
          qty,
          total_harga,
          total_dibayarkan,
          status_transaksi,
          latitude,
          longitude,
          metode_pembayaran,
          alamat,
          qty_drigen,
          id_user
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
        [
          tanggalWIB,       // <-- TANGGAL WIB YANG SUDAH FIX
          username,
          id_produk[i],
          nama_produk[i],
          jumlah[i],
          total_harga[i],
          total_dibayar[i],
          status_transaksi,
          latitude,
          longitude,
          metode_pembayaran,
          alamat,
          qty_drigen[i],
          id_user
        ]
      );
    }

    res.status(200).json({ pesan: 'Berhasil ditambahkan ke tabel admin' });

  } catch (err) {
    res.status(500).json({status_error:'g', status_code:'500'});
  }
});



export default admin_transaksi_pembayaran;

import express from "express";
import db from "../../db.js";



const admin_transaksi_pembayaran = express.Router();





admin_transaksi_pembayaran.put('/update_status_tabel_group', async (req, res) => {
  const { newUpdate, username, id_transaksi } = req.body;

  try {

    const ids = Array.isArray(id_transaksi)
      ? id_transaksi
      : id_transaksi.split(",").map(i => i.trim());

 
    const placeholders = ids.map(() => "?").join(",");

    const sql = `UPDATE transaksi_admin SET status_transaksi = ?  WHERE username = ? AND id_transaksi IN (${placeholders})`;

    await db.query(sql, [newUpdate, username, ...ids]);

    res.status(200).json({ pesan: "berhasil" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});






admin_transaksi_pembayaran.put('/update_status_tabel_group_tunai', async (req, res) => {
  const { newUpdate, username, id_transaksi, total_dibayarkan_user } = req.body;

  try {
    const ids = Array.isArray(id_transaksi)
      ? id_transaksi
      : id_transaksi.split(",").map(i => i.trim());

    const totals = Array.isArray(total_dibayarkan_user)
      ? total_dibayarkan_user
      : total_dibayarkan_user.split(",").map(i => Number(i.trim()));

    if (ids.length !== totals.length) {
      return res.status(400).json({ 
        error: "Jumlah id_transaksi dan total_dibayarkan_user tidak sama" 
      });
    }

    // Build bagian CASE WHEN
    const cases = ids.map((id, index) => {
      return `WHEN id_transaksi = ${db.escape(id)} THEN ${db.escape(totals[index])}`;
    }).join(" ");

    const placeholders = ids.map(() => "?").join(",");

    const sql = `
      UPDATE transaksi_admin 
      SET 
        status_transaksi = ?,
        total_dibayarkan = CASE 
          ${cases}
        END
      WHERE username = ?
      AND id_transaksi IN (${placeholders})
    `;

    await db.query(sql, [newUpdate, username, ...ids]);

    res.status(200).json({ pesan: "berhasil update total dan status" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default admin_transaksi_pembayaran;



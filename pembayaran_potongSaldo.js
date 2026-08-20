import express from "express";
import db from "./db.js";

const pembayaran = express.Router()

pembayaran.put('/potongSaldo', async (req, res) => {
  const { totalDibayarkan, username} = req.body;

  try {
  
    await db.query(`UPDATE users SET saldo = saldo - ? WHERE username = ?`,[totalDibayarkan, username]);
    res.status(200).json({ pesan: 'saldo berhasil di potong' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses pembayaran' });
  }
});



pembayaran.put('/potongStok', async (req, res) => {
  const { qty, idProduk } = req.body;

  // Validasi input sederhana
  if (!idProduk || !qty || idProduk.length !== qty.length) {
    return res.status(400).json({ error: 'Data produk dan qty tidak valid' });
  }

  try {
    // 1️⃣ Bikin CASE statement & klausa WHERE untuk cek stok secara atomic
    let caseStatements = [];
    let stockConditions = [];
    let queryParams = [];

    idProduk.forEach((id, i) => {
      // Bikin CASE WHEN id = ? THEN stok - ?
      caseStatements.push(`WHEN id = ? THEN stok - ?`);
      queryParams.push(id, qty[i]);

      // ⚠️ KUNCINYA DI SINI:
      // Setiap produk yang mau dipotong WAJIB memenuhi syarat: (id = ? AND stok >= ?)
      stockConditions.push(`(id = ? AND stok >= ?)`);
      queryParams.push(id, qty[i]);
    });

    // Masukkan lagi ID ke queryParams untuk klausa WHERE id IN (...)
    queryParams.push(...idProduk);

    const updateQuery = `
      UPDATE product
      SET stok = CASE 
        ${caseStatements.join(' ')}
      END
      WHERE (${stockConditions.join(' OR ')})
        AND id IN (${idProduk.map(() => '?').join(',')})
    `;

    // 2️⃣ Eksekusi Query
    const [result] = await db.query(updateQuery, queryParams);

    // 3️⃣ CEK JUMLAH BARIS YANG BERHASIL DIUPDATE!
    // Syarat Lolos: Jumlah baris yang berubah HARUS SAMA DENGAN jumlah item yang dibeli
    if (result.affectedRows < idProduk.length) {
      // Jika affectedRows kurang dari jumlah barang, berarti ADA SALAH SATU BARANG YANG STOKNYA KURANG!
      // Karena MySQL otomatis membatalkan update untuk item yang stoknya kurang dari qty.
      return res.status(400).json({ 
        error: 'Gagal! Ada salah satu produk yang stoknya tidak cukup/habis.' 
      });
    }

    // Kalau affectedRows === idProduk.length, BERARTI SEMUA BARANG BERHASIL DIPOTONG!
    res.status(200).json({ pesan: 'Pembayaran berhasil dan stok diperbarui' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses pembayaran' });
  }
});



// pembayaran.put('/potongStok', async (req, res) => {
//   const {qty, idProduk } = req.body;

//   try {
//    // 2️⃣ Bangun query dinamis untuk update stok
//     let caseQuery = '';
//     idProduk.forEach((id, i) => {
//       caseQuery += `WHEN id = ${id} THEN stok - ${qty[i]} `;
//     });

//     const ids = idProduk.join(',');

//     const updateQuery = `
//       UPDATE product
//       SET stok = CASE 
//         ${caseQuery}
//       END
//       WHERE id IN (${ids})
//     `;

//     await db.query(updateQuery);

//     res.status(200).json({ pesan: 'pembayaran berhasil dan stok diperbarui' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Terjadi kesalahan saat memproses pembayaran' });
//   }
// });



pembayaran.put('/return_saldo' , async (req, res)=> {
  const {saldo} = req.body;
  try{
    const [retrun_saldo_user] = await db.query(`UPDATE users SET saldo = saldo + ?` ,[saldo]);
    res.status(200).json({pesan:'saldo berhasil di kembalikan'})
  }
  catch(err){
    res.status(500).json({error:err})
  }
})





export default pembayaran;

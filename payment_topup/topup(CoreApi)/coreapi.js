
import express, { json } from 'express';
import midtransClient from 'midtrans-client'
import dotenv from 'dotenv'
import db from '../../db.js';
import rateLimit from 'express-rate-limit';
import { CheckToken } from '../../middleware/cek_token/cek_token.js';


const payment = express.Router();
dotenv.config();




const map = new Map();

payment.post('/ressMidtrans',  async (req, res) => {

  const dataFromMidtrans = req.body;
 

  const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.SERVER_KEY_MIDTRANS,
    clientKey: 'SB-Mid-client-e93dYP-SAFILe8A5'
  })

  try {
    const ressMidtrans = await core.transaction.notification(dataFromMidtrans)
    const { order_id, transaction_status, payment_type, transaction_time, gross_amount } = ressMidtrans
    const id_user = order_id.split('-')[1]
    console.log('ID_USER: ' + id_user)


    if (!map.has(order_id)) {
      map.set(order_id, {  order_id })
    }


    const [existing] = await db.query(
      'SELECT * FROM status_transaksi WHERE order_id = ?',
      [order_id]
    )

    if (existing.length === 0) {
      // Kalau belum ada, tambahkan data baru
      await db.query(
        `INSERT INTO status_transaksi(order_id,  gross_amount, transaction_status, payment_type, transaction_time , id_user)
         VALUES(?,?,?,?,?,?)`,
        [order_id,  gross_amount, transaction_status, payment_type, transaction_time, id_user]
      )
      console.log('Transaksi baru ditambahkan:', order_id)
    } else {
      // Kalau sudah ada, cukup update statusnya kalau berubah
      const currentStatus = existing[0].transaction_status
      if (currentStatus !== transaction_status) {
        await db.query(
          'UPDATE status_transaksi SET transaction_status = ? WHERE order_id = ?',
          [transaction_status, order_id]
        )
        console.log(`Status transaksi ${order_id} diupdate dari ${currentStatus} → ${transaction_status}`)
      }
    }

    // Kalau transaksi berhasil (settlement), update saldo user
    if (transaction_status === 'settlement') {
      await db.query(
        'UPDATE users SET saldo = saldo + ? WHERE id = ?',
        [gross_amount, id_user]
      )
      console.log(` Saldo user ${id_user} bertambah sebesar ${gross_amount}`)

      // Hapus dari map biar bersih
      map.delete(order_id)
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Error Midtrans notif:', err)
    res.status(500).json({ error: true })
  }
})

export default payment;

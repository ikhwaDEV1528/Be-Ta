import express from "express";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import latihanRouter from './latihan.js';
import ResetEmail from "./resetEmail.js";
import pembayaran from "./pembayaran_potongSaldo.js";
import bahasa from "./bahasa.js";
import kordinat from "./ambil_kordinat.js";
import coba_coba from "./coba_coba.js";
import rate from "./rate.js";
import diskon from "./diskon.js";

// Logout
import Logout from "./auth/Logout/Logout.js";

// AUTH
import login from './auth/Login/login.js';
import registrasi from './auth/registrasi/regis&verivyRegis.js';

// Middleware
import hak_akses from "./middleware/cek_akses/cek_akses.js";

// GET PRODUK
import get_produk from './produk/get_produk/get_produk.js';

// GET DATA USERS
import alamat from "./alamat_users/alamat.js";
import get_users from './users/get_users/get_user.js';
import put_users from './users/put_users/put_users.js';

// Reset Password
import resetPassword from "./password/reset_password/reset_password.js";

// ADD USERS
import add_produk_to_users_order from './add_produk_to_user/order_user/order_user.js';
import add_produk_to_users_cart from './add_produk_to_user/cart_user/cart_user.js';

// RIWAYAT TOPUP USERS
import riwayatTopup from "./riwayat_topup/topup_users/topup_user.js";

// TEST
import ROUTE_TEST from "./server_test/put/put_server_test.js";

// ADMIN
import infromasi from "./admin/informasi/infromasi.js";
import add_new_produk from './admin/add_new_produk/add_new_produk.js';
import update_stok_produk from './admin/update_stok_produk/update_stok_produk.js';

// TOPUP MIDTRANS
import snap from './payment_topup/topup(Snap)/snap.js';
import coreapi from './payment_topup/topup(CoreApi)/coreapi.js';

// CART_USER
import get_cart_user from './cart_user/get_cart_user/get_cart_user.js';
import put_cart_user from './cart_user/put_cart_user/put_cart_user.js';

// ORDER USER
import get_order_user from './order_user/get_order_user/get_order_user.js';
import put_order_user from './order_user/put_order_user/put_order_user.js';

// ADMIN
import add_data_pesanan_user_ke_admin from './admin/add_data_pesanan_user_ke_admin/add_data_pesanan_user_ke_admin.js';
import get_all_pesanan_user from './admin/get_all_pesanan_users/get_all_pesanan_user.js';
import update_status_pesanan from './admin/update_status_pesanan/update_status_pesanan.js';

// CHAT
import post_chat from './chat/post_chat/post_chat.js';
import put_chat from './chat/put_chat/put_chat.js';
import get_chat from './chat/get_chat/get_chat.js';

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

// 💡 1. Wajib untuk Vercel Serverless
app.set('trust proxy', 1);

// 💡 2. List domain Frontend yang diizinkan (Tanpa trailing slash '/')
const allowedOrigins = [
  'https://fe-ta-xi.vercel.app', 
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, cookie, Cookie, path, x-path, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 💡 3. Logger untuk cek request masuk di Vercel Logs
app.use((req, res, next) => {
  console.log(`[BE HIT] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Backend API Skripsi Running Successfully! 🚀");
});

app.get("/open", (req, res) => {
  res.send("Hello from Backend Skripsi 🚀");
});

app.use('/latihan', latihanRouter);
app.use('/resetemail', ResetEmail);
app.use('/pembayaran', pembayaran);
app.use('/serverbahasa', bahasa);
app.use('/serverkordinat', kordinat);
app.use('/server_coba', coba_coba);
app.use('/serverRate', rate);
app.use('/server_diskon', diskon);

// NEW ARSITEKTUR
app.use('/SERVER_LOGOUT', Logout);
app.use('/auth_login', login);
app.use('/registrasi', registrasi);
app.use('/server_get_produk', get_produk);
app.use('/dbAlamat', alamat);
app.use('/add_produk_to_users_order', add_produk_to_users_order);
app.use('/add_produk_to_users_cart', add_produk_to_users_cart);
app.use('/resetpass', resetPassword);
app.use('/server_topup', riwayatTopup);
app.use('/server_informasi', infromasi);
app.use('/server_topup_snap', snap);
app.use('/paymentCoreApi', coreapi);
app.use('/server_add_new_produk', add_new_produk);
app.use('/server_update_stok_produk', update_stok_produk);
app.use('/server_get_cart_user', get_cart_user);
app.use('/server_put_cart_user', put_cart_user);
app.use('/server_get_order_user', get_order_user);
app.use('/server_put_order_user', put_order_user);
app.use('/server_put_users', put_users);
app.use('/server_get_users', get_users);
app.use('/server_post_chat', post_chat);
app.use('/server_put_chat', put_chat);
app.use('/server_get_chat', get_chat);

// Middleware
app.use('/server_hak_akses', hak_akses);

// ADMIN
app.use('/server_add_data_pesanan_user_ke_admin', add_data_pesanan_user_ke_admin);
app.use('/server_get_all_pesanan_user', get_all_pesanan_user);
app.use('/server_put_update_status_pesanan', update_status_pesanan);

// TEST
app.use('/SERVER_TEST', ROUTE_TEST);

// 💡 4. Vercel Fix: Jalankan app.listen HANYA jika bukan di Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

export default app;



// import express from "express";
// import cors from "cors";
// // import authRoutes from "./auth.js";

// // import chatRouter from './daftarChat.js'
// // import RouterTransaksi from "./dataProdukUser.js";
// import latihanRouter from './latihan.js'
// import ResetEmail from "./resetEmail.js";
// import pembayaran from "./pembayaran_potongSaldo.js";
// // import admin_transaksi_pembayaran from "./tabel_admin_transaksi_pembayaran.js";
// import { Server } from "socket.io";
// import http from "http";
// import bahasa from "./bahasa.js";
// import kordinat from "./ambil_kordinat.js";
// import coba_coba from "./coba_coba.js";
// import rate from "./rate.js";
// import diskon from "./diskon.js";

// // Logoutttttttt ///
// import Logout from "./auth/Logout/Logout.js";

// // AUTH //
// import login from './auth/Login/login.js'
// import registrasi from './auth/registrasi/regis&verivyRegis.js'
// import cookieParser from "cookie-parser";

// // Pasang sebelum router-router kamu!
// //Midlleware//
// import hak_akses from "./middleware/cek_akses/cek_akses.js";

// // GET PRODUK //
// import get_produk from './produk/get_produk/get_produk.js'

// // GET DATA USERS //
// import alamat from "./alamat_users/alamat.js";
// import get_users from './users/get_users/get_user.js'
// import put_users from './users/put_users/put_users.js'

// // Reset Password //
// import resetPassword from "./password/reset_password/reset_password.js";

// // ADD USERS //
// import add_produk_to_users_order from './add_produk_to_user/order_user/order_user.js';
// import add_produk_to_users_cart from './add_produk_to_user/cart_user/cart_user.js';

// // RIWAYAT TOPUP USERS //
// import riwayatTopup from "./riwayat_topup/topup_users/topup_user.js";

// // TEST //
// import ROUTE_TEST from "./server_test/put/put_server_test.js";

// // ADMIN //
// import infromasi from "./admin/informasi/infromasi.js";
// import add_new_produk from './admin/add_new_produk/add_new_produk.js'
// import update_stok_produk from './admin/update_stok_produk/update_stok_produk.js'

// // TOPUP MIDTRANS //
// import snap from './payment_topup/topup(Snap)/snap.js'
// import coreapi from './payment_topup/topup(CoreApi)/coreapi.js'

// // CART_USER //
// import get_cart_user from './cart_user/get_cart_user/get_cart_user.js'
// import put_cart_user from './cart_user/put_cart_user/put_cart_user.js'

// // ORDER USER //
// import get_order_user from './order_user/get_order_user/get_order_user.js'
// import put_order_user from './order_user/put_order_user/put_order_user.js'

// // ADMIN //
// import add_data_pesanan_user_ke_admin from './admin/add_data_pesanan_user_ke_admin/add_data_pesanan_user_ke_admin.js';
// import get_all_pesanan_user  from  './admin/get_all_pesanan_users/get_all_pesanan_user.js'
// import update_status_pesanan from './admin/update_status_pesanan/update_status_pesanan.js'

// // CHAT //
// import post_chat from './chat/post_chat/post_chat.js'
// import put_chat from  './chat/put_chat/put_chat.js'
// import get_chat from './chat/get_chat/get_chat.js'

// const app = express();

// // buat server HTTP
// const server = http.createServer(app);

// // socket.io
// export const io = new Server(server, {
//   cors: { origin: ["https://fe-ta-xi.vercel.app", "http://localhost:3000"] },
// });

// // middleware (Izinkan CORS lokal dan Vercel)
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // routes
// app.get("/", (req, res) => {
//   res.send("Backend API Skripsi Running Successfully! 🚀");
// });

// app.get("/open", (req, res) => {
//   res.send("Hello from Backend Skripsi 🚀");
// });

// app.use('/latihan' , latihanRouter)
// app.use('/resetemail' , ResetEmail)
// app.use('/pembayaran', pembayaran)
// app.use('/serverbahasa', bahasa)
// app.use('/serverkordinat' , kordinat)
// app.use('/server_coba' , coba_coba)
// app.use('/serverRate', rate)
// app.use('/server_diskon' , diskon)

// // NEW ARSITEKTUR //
// app.use('/SERVER_LOGOUT' , Logout)
// app.use('/auth_login' , login) 
// app.use('/registrasi' , registrasi) 
// app.use('/server_get_produk' , get_produk)  
// app.use('/dbAlamat' , alamat)  
// app.use('/add_produk_to_users_order',add_produk_to_users_order) 
// app.use('/add_produk_to_users_cart',add_produk_to_users_cart)
// app.use('/resetpass' , resetPassword) 
// app.use('/server_topup' , riwayatTopup) 
// app.use('/server_informasi' , infromasi)
// app.use('/server_topup_snap' , snap)
// app.use('/paymentCoreApi', coreapi) 
// app.use('/server_add_new_produk' , add_new_produk) 
// app.use('/server_update_stok_produk' , update_stok_produk)
// app.use('/server_get_cart_user' , get_cart_user) 
// app.use('/server_put_cart_user' , put_cart_user)
// app.use('/server_get_order_user' , get_order_user)
// app.use('/server_put_order_user' , put_order_user)
// app.use('/server_put_users', put_users)
// app.use('/server_get_users', get_users) 
// app.use('/server_post_chat' , post_chat )
// app.use('/server_put_chat' , put_chat)
// app.use('/server_get_chat' , get_chat)

// // Middleware //
// app.use('/server_hak_akses' , hak_akses)

// //ADMIN //
// app.use('/server_add_data_pesanan_user_ke_admin', add_data_pesanan_user_ke_admin);
// app.use('/server_get_all_pesanan_user' , get_all_pesanan_user)
// app.use('/server_put_update_status_pesanan' , update_status_pesanan)

// // TEST //
// app.use('/SERVER_TEST' , ROUTE_TEST)

// // EXPORT APP UNTUK VERCEL SERVERLESS //
// export default app;

// // LISTEN SERVER HANYA DI LOKAL //
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server berjalan di http://localhost:${PORT}`);
//   });
// }


// // import express from "express";
// // import cors from "cors";
// // // import authRoutes from "./auth.js";

// // // import chatRouter from './daftarChat.js'
// // // import RouterTransaksi from "./dataProdukUser.js";
// // import latihanRouter from './latihan.js'
// // import ResetEmail from "./resetEmail.js";
// // import pembayaran from "./pembayaran_potongSaldo.js";
// // // import admin_transaksi_pembayaran from "./tabel_admin_transaksi_pembayaran.js";
// // import { Server } from "socket.io";
// // import http from "http";
// // import bahasa from "./bahasa.js";
// // import kordinat from "./ambil_kordinat.js";
// // import coba_coba from "./coba_coba.js";
// // import rate from "./rate.js";
// // import diskon from "./diskon.js";

// // // Logoutttttttt ///
// // import Logout from "./auth/Logout/Logout.js";




// // // AUTH //
// // import login from './auth/Login/login.js'
// // import registrasi from './auth/registrasi/regis&verivyRegis.js'
// // import cookieParser from "cookie-parser";

// // // Pasang sebelum router-router kamu!
// // //Midlleware//
// // import hak_akses from "./middleware/cek_akses/cek_akses.js";


// // // GET PRODUK //
// // import get_produk from './produk/get_produk/get_produk.js'


// // // GET DATA USERS //
// // import alamat from "./alamat_users/alamat.js";
// // import get_users from './users/get_users/get_user.js'
// // import put_users from './users/put_users/put_users.js'

// // // Reset Password //
// // import resetPassword from "./password/reset_password/reset_password.js";


// // // ADD USERS //
// // import add_produk_to_users_order from './add_produk_to_user/order_user/order_user.js';
// // import add_produk_to_users_cart from './add_produk_to_user/cart_user/cart_user.js';


// // // RIWAYAT TOPUP USERS //
// // import riwayatTopup from "./riwayat_topup/topup_users/topup_user.js";

// // // TEST //
// // import ROUTE_TEST from "./server_test/put/put_server_test.js";

// // // ADMIN //
// // import infromasi from "./admin/informasi/infromasi.js";
// // import add_new_produk from './admin/add_new_produk/add_new_produk.js'
// // import update_stok_produk from './admin/update_stok_produk/update_stok_produk.js'


// // // TOPUP MIDTRANS //
// // import snap from './payment_topup/topup(Snap)/snap.js'
// // import coreapi from './payment_topup/topup(CoreApi)/coreapi.js'


// // // CART_USER //
// // import get_cart_user from './cart_user/get_cart_user/get_cart_user.js'
// // import put_cart_user from './cart_user/put_cart_user/put_cart_user.js'


// // // ORDER USER //
// // import get_order_user from './order_user/get_order_user/get_order_user.js'
// // import put_order_user from './order_user/put_order_user/put_order_user.js'



// // // ADMIN //
// // import add_data_pesanan_user_ke_admin from './admin/add_data_pesanan_user_ke_admin/add_data_pesanan_user_ke_admin.js';
// // import get_all_pesanan_user  from  './admin/get_all_pesanan_users/get_all_pesanan_user.js'
// // import update_status_pesanan from './admin/update_status_pesanan/update_status_pesanan.js'



// // // CHAT //
// // import post_chat from './chat/post_chat/post_chat.js'
// // import put_chat from  './chat/put_chat/put_chat.js'
// // import get_chat from './chat/get_chat/get_chat.js'





// // const app = express();

// // // buat server HTTP
// // const server = http.createServer(app);

// // // socket.io
// // export const io = new Server(server, {
// //   cors: { origin: "http://localhost:3000" },
  
// // });


// // // middleware
// // app.use(cors({
// //   origin:'http://localhost:3000',
// //   credentials:true
// // }));

// // app.use(cookieParser());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // routes
// // app.get("/open", (req, res) => {
// //   res.send("Hello from Backend Skripsi 🚀");
// // });

// // // app.use("/auth", authRoutes);

// // // app.use('/daftarChat' , chatRouter)
// // // app.use('/routerTransaksi' , RouterTransaksi)
// // app.use('/latihan' , latihanRouter)
// // app.use('/resetemail' , ResetEmail)
// // app.use('/pembayaran', pembayaran)
// // // app.use('/servercart' , cart)
// // // app.use('/serveradmin' , admin_transaksi_pembayaran)
// // app.use('/serverbahasa', bahasa)
// // app.use('/serverkordinat' , kordinat)
// // app.use('/server_coba' , coba_coba)
// // app.use('/serverRate', rate)
// // app.use('/server_diskon' , diskon)


// // // NEW ARSITEKTUR //
// // app.use('/SERVER_LOGOUT' , Logout)
// // app.use('/auth_login' , login) // ENDPOINT LOGIN
// // app.use('/registrasi' , registrasi) // ENDPOINT REGISTRASI
// // app.use('/server_get_produk' , get_produk)  // ENDPOINT AMBIL PRODUK
// // app.use('/dbAlamat' , alamat)  // ENDPOINT POST,GET,PUT ALAMAT
// // app.use('/add_produk_to_users_order',add_produk_to_users_order) 
// // app.use('/add_produk_to_users_cart',add_produk_to_users_cart)
// // app.use('/resetpass' , resetPassword) // endpoint reset password akun user
// // app.use('/server_topup' , riwayatTopup) // endpoint data riwayat toup user
// // app.use('/server_informasi' , infromasi)
// // app.use('/server_topup_snap' , snap)
// // app.use('/paymentCoreApi', coreapi) // (endpoint untuk dashboard midtrans)
// // app.use('/server_add_new_produk' , add_new_produk) //endpoint untuk admin tambah produk baru
// // app.use('/server_update_stok_produk' , update_stok_produk)// endpoint update stok produk
// // app.use('/server_get_cart_user' , get_cart_user) // ednpoint ambil data cart user
// // app.use('/server_put_cart_user' , put_cart_user)
// // app.use('/server_get_order_user' , get_order_user)
// // app.use('/server_put_order_user' , put_order_user)
// // app.use('/server_put_users', put_users)
// // app.use('/server_get_users', get_users) // ENDPOINT AMBIL DATA USERS 
// // app.use('/server_post_chat' , post_chat )
// // app.use('/server_put_chat' , put_chat)
// // app.use('/server_get_chat' , get_chat)

// // // Middleware //
// // app.use('/server_hak_akses' , hak_akses)


// // //ADMIN //
// // app.use('/server_add_data_pesanan_user_ke_admin', add_data_pesanan_user_ke_admin);
// // app.use('/server_get_all_pesanan_user' , get_all_pesanan_user)
// // app.use('/server_put_update_status_pesanan' , update_status_pesanan)


// // // TEST //
// // app.use('/SERVER_TEST' , ROUTE_TEST)


// // // ************ RUN SERVER DENGAN SOCKET.IO ************
// // // 1. Tambahkan route utama agar URL Vercel tidak 404 saat dibuka
// // app.get("/", (req, res) => {
// //   res.send("Backend API Skripsi Running Successfully! 🚀");
// // });


// // const PORT = 5000;
// // server.listen(PORT, '0.0.0.0', () => {
// //   console.log(`Server berjalan di http://localhost:${PORT}`);
// // });



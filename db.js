// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "mysql-3034ae25-iwanbiru607-aeff.l.aivencloud.com",
  port: parseInt(process.env.DB_PORT || "22584", 10),
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASS || "AVNS_9VrEgAkFJmHTRd08w9V",
  database: process.env.DB_NAME || "defaultdb",

  // Wajib untuk koneksi MySQL Cloud (Aiven)
  ssl: {
    rejectUnauthorized: false
  },

  // SECURITY & STABILITY
  multipleStatements: false,
  namedPlaceholders: true,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
  queueLimit: 0,
});

export default db;


// // db.js
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "skripsi",

//   // SECURITY & STABILITY
//   multipleStatements: false,   // penting: cegah stacked queries (SQL injection vector)
//   namedPlaceholders: true,     // opsional: biar bisa pakai :name di query jika mau
//   waitForConnections: true,
//   connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
//   queueLimit: 0,               // 0 = unlimited queue (sesuaikan kebutuhan)

  
// });



// export default db;

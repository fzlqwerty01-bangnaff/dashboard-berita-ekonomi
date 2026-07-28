const { Pool } = require('pg');

// Konfigurasi koneksi ke PostgreSQL (PGAdmin)
// Ganti nilai-nilai di bawah ini dengan kredensial database Anda
const pool = new Pool({
    user: 'postgres',           // Ganti dengan username database Anda
    host: 'localhost',          // Biasanya localhost jika dijalankan di PC yang sama
    database: 'nama_database',  // Ganti dengan nama database Anda
    password: 'password_anda',  // Ganti dengan password database Anda
    port: 5432,                 // Port default PostgreSQL
});

// Tes koneksi
pool.connect((err, client, release) => {
    if (err) {
        console.error('Kesalahan saat menyambung ke database PostgreSQL:', err.stack);
    } else {
        console.log('Berhasil terhubung ke database PostgreSQL');
        release();
    }
});

module.exports = pool;

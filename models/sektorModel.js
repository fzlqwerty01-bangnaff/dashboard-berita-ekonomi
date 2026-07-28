const pool = require('../config/db');

// Peta kunci URL ke Kode Kategori (berdasarkan standar BPS/Spreadsheet)
const categoryMap = {
    'pertanian': { kode: 'A', title: 'A. Pertanian, Kehutanan, dan Perikanan' },
    'pertambangan': { kode: 'B', title: 'B. Pertambangan dan Penggalian' },
    'industri': { kode: 'C', title: 'C. Industri Pengolahan' },
    'listrik': { kode: 'D', title: 'D. Pengadaan Listrik dan Gas' },
    'air': { kode: 'E', title: 'E. Pengadaan Air, Pengelolaan Sampah, Limbah & Daur Ulang' },
    'konstruksi': { kode: 'F', title: 'F. Konstruksi' },
    'perdagangan': { kode: 'G', title: 'G. Perdagangan Besar & Eceran; Reparasi Mobil & Sepeda Motor' },
    'transportasi': { kode: 'H', title: 'H. Transportasi dan Pergudangan' },
    'akomodasi': { kode: 'I', title: 'I. Penyediaan Akomodasi dan Makan Minum' },
    'informasi': { kode: 'J', title: 'J. Informasi dan Komunikasi' },
    'keuangan': { kode: 'K', title: 'K. Jasa Keuangan dan Asuransi' },
    'realestate': { kode: 'L', title: 'L. Real Estate' },
    'perusahaan': { kode: 'M, N', title: 'M, N. Jasa Perusahaan' }, // Atur sesuai kode di DB Anda
    'pendidikan': { kode: 'O', title: 'O. Jasa Pendidikan' },
    'pemerintahan': { kode: 'P', title: 'P. Administrasi Pemerintahan, Pertahanan & Jaminan Sosial Wajib' },
    'kesehatan': { kode: 'Q', title: 'Q. Jasa Kesehatan dan Kegiatan Sosial' },
    'lainnya': { kode: 'R,S,T,U', title: 'R, S, T, U. Jasa Lainnya' }, // Atur sesuai kode di DB Anda
    'pengeluaran': { kode: 'PENGELUARAN', title: 'Indikator Pengeluaran PDRB' }
};

module.exports = {
    getAllSektor: () => {
        return Object.keys(categoryMap).map(key => ({
            id: key,
            title: categoryMap[key].title
        }));
    },
    
    // Mendapatkan data sektor beserta hierarki Uraian -> Suburaian dari Database
    getSektorByKey: async (key) => {
        const catInfo = categoryMap[key];
        if (!catInfo) return null;

        try {
            // Ambil semua kombinasi unik Uraian dan Suburaian untuk kode_kategori ini
            // Gunakan LIKE atau IN jika kodenya mengandung koma (misal 'M, N')
            // Untuk amannya, kita asumsikan kueri sederhana menggunakan '=' jika 1 huruf,
            // atau Anda dapat menyesuaikannya nanti.
            let query = 'SELECT DISTINCT uraian, suburaian FROM berita WHERE kode_kategori = $1 ORDER BY uraian, suburaian';
            const result = await pool.query(query, [catInfo.kode]);

            // Bangun struktur items dari hasil query
            const uraianMap = {};

            result.rows.forEach(row => {
                const ur = row.uraian;
                const sub = row.suburaian;

                if (!ur) return; // Skip if empty

                if (!uraianMap[ur]) {
                    uraianMap[ur] = { name: ur, hasSub: false, details: [] };
                }

                if (sub && sub.trim() !== '') {
                    uraianMap[ur].hasSub = true;
                    if (!uraianMap[ur].details.includes(sub)) {
                        uraianMap[ur].details.push(sub);
                    }
                }
            });

            return {
                title: catInfo.title,
                items: Object.values(uraianMap)
            };
        } catch (error) {
            console.error('Error in getSektorByKey:', error);
            // Kembalikan fallback kosong jika database error / belum siap
            return {
                title: catInfo.title,
                items: []
            };
        }
    }
};

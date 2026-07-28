const pool = require('../config/db');

module.exports = {
    // Fungsi untuk mendapatkan semua berita (dengan filter, paginasi)
    getAllNews: async (filters, page = 1, limit = 20) => {
        try {
            let query = 'SELECT * FROM berita WHERE 1=1';
            let params = [];
            let paramIndex = 1;

            if (filters.category && filters.category !== 'all') {
                // Assuming filters.category might map to some specific value, or just filter it.
                // You can customize this depending on how you pass category to backend.
                // query += ` AND kode_kategori = $${paramIndex}`;
                // params.push(filters.category);
                // paramIndex++;
            }

            if (filters.start) {
                query += ` AND tanggal >= $${paramIndex}`;
                params.push(filters.start);
                paramIndex++;
            }

            if (filters.end) {
                query += ` AND tanggal <= $${paramIndex}`;
                params.push(filters.end);
                paramIndex++;
            }

            // Hitung total untuk paginasi
            const countQuery = `SELECT COUNT(*) FROM (${query}) AS total`;
            const countResult = await pool.query(countQuery, params);
            const totalItems = parseInt(countResult.rows[0].count);
            const totalPages = Math.ceil(totalItems / limit);

            // Tambahkan order, limit dan offset
            query += ` ORDER BY tanggal DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(limit, (page - 1) * limit);

            const result = await pool.query(query, params);

            return {
                data: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalItems,
                    totalPages
                }
            };
        } catch (error) {
            console.error('Error in getAllNews:', error);
            throw error;
        }
    },
    
    getNewsBySubCategory: async (categoryKey, subCategoryName, filters = {}) => {
        try {
            let query = 'SELECT * FROM berita WHERE suburaian = $1';
            let params = [subCategoryName];
            let paramIndex = 2;

            if (filters.start) {
                query += ` AND tanggal >= $${paramIndex}`;
                params.push(filters.start);
                paramIndex++;
            }
            if (filters.end) {
                query += ` AND tanggal <= $${paramIndex}`;
                params.push(filters.end);
                paramIndex++;
            }

            query += ` ORDER BY tanggal DESC`;
            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error in getNewsBySubCategory:', error);
            throw error;
        }
    }
};

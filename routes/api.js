const express = require('express');
const router = express.Router();
const sektorModel = require('../models/sektorModel');

// Get all chart data (mock implementation based on original HTML)
router.get('/chart-data', (req, res) => {
    res.json({
        labels: ['Pertanian', 'Industri', 'Perdagangan', 'Transportasi', 'Akomodasi', 'Konstruksi', 'Pengeluaran'],
        datasets: [{
            label: 'Jumlah Berita',
            data: [24, 42, 30, 18, 15, 21, 27]
        }]
    });
});

// Get subcategory data by sector key
router.get('/sektor/:key', async (req, res) => {
    try {
        const sektor = await sektorModel.getSektorByKey(req.params.key);
        if (sektor) {
            res.json(sektor);
        } else {
            res.status(404).json({ error: 'Sektor not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

const newsModel = require('../models/newsModel');

// Get paginated news for Arsip page
router.get('/news', async (req, res) => {
    try {
        const filters = {
            start: req.query.start,
            end: req.query.end,
            category: req.query.category
        };
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        
        const result = await newsModel.getAllNews(filters, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get news for specific sub-category
router.get('/news/subkategori', async (req, res) => {
    try {
        const { category, subCategory, start, end } = req.query;
        
        if (!category || !subCategory) {
            return res.status(400).json({ error: 'Category and subCategory are required' });
        }
        
        const filters = { start, end };
        const news = await newsModel.getNewsBySubCategory(category, subCategory, filters);
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

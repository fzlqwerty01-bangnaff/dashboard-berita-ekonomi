const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('layouts/main', { page: 'home' });
});

router.get('/kategori', (req, res) => {
    const { start, end } = req.query;
    res.render('layouts/main', { page: 'kategori', start, end });
});

router.get('/subkategori/:sektorKey', (req, res) => {
    const sektorKey = req.params.sektorKey;
    const { start, end } = req.query;
    res.render('layouts/main', { page: 'subkategori', sektorKey: sektorKey, start, end });
});

router.get('/arsip', (req, res) => {
    const { start, end } = req.query;
    res.render('layouts/main', { page: 'arsip', start, end });
});

module.exports = router;

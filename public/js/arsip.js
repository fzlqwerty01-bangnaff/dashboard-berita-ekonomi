let currentPage = 1;
let totalPages = 1;

window.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentPage);

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchNews(currentPage);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchNews(currentPage);
        }
    });
});

function fetchNews(page) {
    const start = window.START_DATE;
    const end = window.END_DATE;
    let url = `/api/news?page=${page}&limit=20`;
    
    if (start && end) {
        url += `&start=${start}&end=${end}`;
    }

    const tbody = document.getElementById('arsipTableBody');
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">Memuat data...</td></tr>`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            totalPages = data.pagination.totalPages;
            renderTable(data.data);
            updatePaginationInfo(data.pagination);
        })
        .catch(err => {
            console.error('Failed to fetch news:', err);
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">Gagal memuat data berita.</td></tr>`;
        });
}

function renderTable(newsList) {
    const tbody = document.getElementById('arsipTableBody');
    tbody.innerHTML = '';

    if (newsList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">Belum ada berita untuk filter waktu ini.</td></tr>`;
        return;
    }

    newsList.forEach(news => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-soft)';
        tr.innerHTML = `
            <td style="padding: 12px 16px; font-weight: 600; color: var(--text-primary); font-size: 14px;">${news.ringkasan || news.isi_berita || 'Tanpa Judul'}</td>
            <td style="padding: 12px 16px; color: var(--text-secondary); font-size: 13px;">${news.kategori} - ${news.suburaian}</td>
            <td style="padding: 12px 16px; color: var(--text-secondary); font-size: 13px;"><a href="${news.sumber}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Sumber ↗</a></td>
            <td style="padding: 12px 16px; color: var(--text-secondary); font-size: 13px;">${new Date(news.tanggal).toLocaleDateString('id-ID')}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updatePaginationInfo(pagination) {
    document.getElementById('pageInfo').innerText = `Halaman ${pagination.page} dari ${pagination.totalPages || 1} (Total: ${pagination.totalItems})`;
    
    document.getElementById('prevBtn').disabled = pagination.page <= 1;
    document.getElementById('nextBtn').disabled = pagination.page >= pagination.totalPages;
}

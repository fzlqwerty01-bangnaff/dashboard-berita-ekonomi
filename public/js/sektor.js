let navigationState = 'numbers';
let currentSectorData = null;

// Initialize sub-category view
window.addEventListener('DOMContentLoaded', () => {
    const subContainer = document.getElementById('subContainer');
    if (!subContainer) return; // Only run on subkategori page

    const pathParts = window.location.pathname.split('/');
    const sectorKey = pathParts[pathParts.length - 1];

    if (sectorKey && sectorKey !== 'subkategori') {
        fetch(`/api/sektor/${sectorKey}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Sektor tidak ditemukan!');
                    return;
                }
                currentSectorData = data;
                renderSubLevel1(data);
            })
            .catch(err => console.error('Error fetching sektor data:', err));
    }
});

function renderSubLevel1(sector) {
    navigationState = 'numbers';
    document.getElementById('subTitle').innerText = sector.title;
    
    const listContent = document.getElementById('subListContent');
    listContent.innerHTML = '';

    sector.items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'sub-item';
        li.innerHTML = `<span>${item.name}</span> <span>${item.hasSub ? '➔ (Lihat Sub-huruf)' : '📄 (Data/Berita)'}</span>`;
        li.onclick = () => {
            if (item.hasSub) {
                renderSubLevel2(item);
            } else {
                fetchAndRenderNews(currentSectorData.key, item.name, () => renderSubLevel1(currentSectorData));
            }
        };
        listContent.appendChild(li);
    });

    const backBtn = document.getElementById('backBtn');
    backBtn.href = '/kategori' + window.location.search;
    backBtn.innerText = '← Kembali ke Daftar Sektor';
    // Remove default click behavior for level 1 to use href
    backBtn.onclick = null;
}

function renderSubLevel2(numberItem) {
    navigationState = 'details';
    document.getElementById('subTitle').innerText = numberItem.name;
    
    const listContent = document.getElementById('subListContent');
    listContent.innerHTML = '';

    numberItem.details.forEach(detail => {
        const li = document.createElement('li');
        li.className = 'sub-item';
        li.innerHTML = `<span>${detail}</span> <span>📄 (Lihat Berita)</span>`;
        li.onclick = () => fetchAndRenderNews(currentSectorData.key, detail, () => renderSubLevel2(numberItem));
        listContent.appendChild(li);
    });

    const backBtn = document.getElementById('backBtn');
    backBtn.removeAttribute('href'); // Prevent navigation
    backBtn.innerText = '← Kembali ke Nomor Sektor';
    backBtn.onclick = (e) => {
        e.preventDefault();
        if (currentSectorData) {
            renderSubLevel1(currentSectorData);
        }
    };
}

function fetchAndRenderNews(sectorKey, subCategoryName, goBackCallback) {
    navigationState = 'news';
    document.getElementById('subTitle').innerText = `Berita: ${subCategoryName}`;
    
    const listContent = document.getElementById('subListContent');
    listContent.innerHTML = '<li style="padding: 20px; text-align: center;">Memuat berita...</li>';

    const params = new URLSearchParams(window.location.search);
    let url = `/api/news/subkategori?category=${sectorKey}&subCategory=${encodeURIComponent(subCategoryName)}`;
    if (params.get('start') && params.get('end')) {
        url += `&start=${params.get('start')}&end=${params.get('end')}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(newsList => {
            listContent.innerHTML = '';
            if (newsList.length === 0) {
                listContent.innerHTML = '<li style="padding: 20px; text-align: center; color: var(--text-secondary);">Belum ada berita untuk sub-kategori ini.</li>';
            } else {
                newsList.forEach(news => {
                    const li = document.createElement('li');
                    li.className = 'sub-item';
                    li.style.flexDirection = 'column';
                    li.style.alignItems = 'flex-start';
                    li.style.gap = '8px';
                    li.style.cursor = 'default';
                    // Remove hover transform by unsetting class or applying overrides
                    li.classList.remove('sub-item');
                    li.style.background = 'var(--card-bg)';
                    li.style.border = '1px solid var(--border-soft)';
                    li.style.padding = '16px 20px';
                    li.style.borderRadius = 'var(--radius-md)';
                    li.style.boxShadow = 'var(--shadow-sm)';
                    
                    li.innerHTML = `
                        <div style="font-weight: 700; font-size: 15px; color: var(--text-primary); line-height: 1.4;">${news.ringkasan || news.isi_berita || 'Tanpa Judul'}</div>
                        <div style="font-size: 13px; color: var(--text-secondary); display: flex; gap: 12px; margin-top: 4px;">
                            <span>📰 <a href="${news.sumber}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Sumber ↗</a></span>
                            <span>📅 ${new Date(news.tanggal).toLocaleDateString('id-ID')}</span>
                        </div>
                    `;
                    listContent.appendChild(li);
                });
            }
        })
        .catch(err => {
            console.error('Failed to load news:', err);
            listContent.innerHTML = '<li style="padding: 20px; text-align: center; color: red;">Gagal memuat berita.</li>';
        });

    const backBtn = document.getElementById('backBtn');
    backBtn.removeAttribute('href');
    backBtn.innerText = '← Kembali ke Sub-Kategori';
    backBtn.onclick = (e) => {
        e.preventDefault();
        goBackCallback();
    };
}

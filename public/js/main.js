// Fungsi umum seperti toggleMenu dan filter
function toggleMenu() {
    document.getElementById('sidebarMenu').classList.toggle('active');
}

function terapkanFilter() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    window.location.href = `/kategori?start=${start}&end=${end}`;
}

// In EJS we use normal links to navigate pages, but we can manage header opacity based on URL path.
window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path !== '/') {
        const headerTitle = document.getElementById('mainHeaderWrapper');
        if (headerTitle) {
            headerTitle.style.opacity = '0';
        }
    }
});

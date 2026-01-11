let profitChartInstance = null;
let historyData = [];

// Load history from LocalStorage on startup
window.onload = function () {
    loadHistory();
    initChart();
    initTheme();
};

function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    if (value !== '') {
        value = parseInt(value, 10).toLocaleString('id-ID');
    }
    input.value = value;
}

function parseCurrency(value) {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '')) || 0;
}

function hitungHarga() {
    let namaProduk = document.getElementById('namaProduk').value || "Tanpa Nama"; // Capture Product Name
    let hpp = parseCurrency(document.getElementById('hpp').value);
    let operasional = parseCurrency(document.getElementById('operasional').value);

    let marginPersen = parseFloat(document.getElementById('margin').value) || 0;
    let adminPersen = parseFloat(document.getElementById('adminFee').value) || 0;

    if (hpp === 0) {
        alert("Mohon isi Harga Beli barang!");
        return;
    }

    let totalModal = hpp + operasional;
    let profitNominal = totalModal * (marginPersen / 100);
    let hargaTargetNet = totalModal + profitNominal;

    let hargaJualFinal = 0;
    let biayaAdmin = 0;

    if (adminPersen < 100) {
        hargaJualFinal = hargaTargetNet / (1 - (adminPersen / 100));
        biayaAdmin = hargaJualFinal - hargaTargetNet;
    } else {
        alert("Biaya Admin tidak boleh 100% atau lebih!");
        return;
    }

    // Update UI Indicators
    document.getElementById('hargaJual').innerText = formatRupiah(hargaJualFinal);
    document.getElementById('totalModal').innerText = formatRupiah(totalModal);
    document.getElementById('profitBersih').innerText = formatRupiah(profitNominal);
    document.getElementById('potonganAdmin').innerText = formatRupiah(biayaAdmin);

    // Update Chart
    updateChart(totalModal, biayaAdmin, profitNominal);

    // Save to History (pass namaProduk)
    addToHistory(namaProduk, totalModal, marginPersen, adminPersen, hargaJualFinal, profitNominal);
}

function formatRupiah(angka) {
    return "Rp " + Math.ceil(angka).toLocaleString('id-ID');
}

function resetForm() {
    document.getElementById('namaProduk').value = '';
    document.getElementById('hpp').value = '';
    document.getElementById('operasional').value = '';
    document.getElementById('margin').value = '';
    document.getElementById('adminFee').value = '';

    document.getElementById('hargaJual').innerText = "Rp 0";
    document.getElementById('totalModal').innerText = "Rp 0";
    document.getElementById('profitBersih').innerText = "Rp 0";
    document.getElementById('potonganAdmin').innerText = "Rp 0";

    // Reset Chart
    updateChart(0, 0, 0);
}

/* --- QUICK SELECT HELPER --- */
function setAdmin(value) {
    const input = document.getElementById('adminFee');
    input.value = value;
    // Simple visual feedback
    const originalBorder = input.style.borderColor;
    input.style.borderColor = '#4f46e5'; // Indigo
    setTimeout(() => { input.style.borderColor = originalBorder; }, 300);
}

/* --- CHART JS LOGIC --- */
function initChart() {
    const ctx = document.getElementById('profitChart').getContext('2d');

    // Initial Light Theme Colors
    Chart.defaults.color = '#64748b';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    profitChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Modal', 'Biaya Admin', 'Profit Bersih'],
            datasets: [{
                data: [0, 0, 0], // Initial Empty
                backgroundColor: [
                    '#94a3b8', // Modal (Gray-400)
                    '#ef4444', // Admin (Red-500)
                    '#10b981'  // Profit (Emerald-500)
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        pointStyle: 'circle'
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

function updateChart(modal, admin, profit) {
    if (profitChartInstance) {
        // If all zero, show empty light gray circle
        if (modal === 0 && admin === 0 && profit === 0) {
            profitChartInstance.data.datasets[0].data = [1, 0, 0];
            // Check theme for placeholder color
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            profitChartInstance.data.datasets[0].backgroundColor = [
                isDark ? '#334155' : '#e2e8f0',
                '#ef4444',
                '#10b981'
            ];
        } else {
            profitChartInstance.data.datasets[0].data = [modal, admin, profit];
            profitChartInstance.data.datasets[0].backgroundColor = ['#94a3b8', '#ef4444', '#10b981'];
        }
        profitChartInstance.update();
    }
}

/* --- HISTORY LOGIC --- */
function addToHistory(nama, modal, margin, admin, hargaJual, profit) {
    const now = new Date();
    const timeString = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

    const newEntry = {
        time: timeString,
        nama: nama,
        modal: formatRupiah(modal),
        margin: margin + '%',
        admin: admin + '%',
        hargaJual: formatRupiah(hargaJual),
        profit: formatRupiah(profit)
    };

    historyData.unshift(newEntry); // Add to beginning
    if (historyData.length > 10) historyData.pop(); // Keep max 10

    saveHistory();
    renderHistory();
}

function renderHistory() {
    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';

    if (historyData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">Belum ada riwayat perhitungan.</td></tr>';
        return;
    }

    historyData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.time}</td>
            <td style="font-weight:600; color: var(--text-main);">${item.nama || "-"}</td> 
            <td>${item.modal}</td>
            <td>${item.margin}</td>
            <td>${item.admin}</td>
            <td style="color: var(--primary); font-weight: bold;">${item.hargaJual}</td>
            <td style="color: var(--success);">${item.profit}</td>
        `;
        tbody.appendChild(row);
    });
}

function saveHistory() {
    localStorage.setItem('labaPintarHistory', JSON.stringify(historyData));
}

function loadHistory() {
    const stored = localStorage.getItem('labaPintarHistory');
    if (stored) {
        historyData = JSON.parse(stored);
        renderHistory();
    }
}

function clearHistory() {
    if (confirm("Hapus semua riwayat perhitungan?")) {
        historyData = [];
        saveHistory();
        renderHistory();
    }
}

/* --- EXPORT FEATURE --- */
function exportToCSV() {
    if (historyData.length === 0) {
        alert("Belum ada data riwayat untuk diekspor!");
        return;
    }

    // Header CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Waktu,Nama Produk,Total Modal,Margin,Admin Fee,Harga Jual,Profit Bersih\n";

    // Row Data
    historyData.forEach(function (row) {
        let rowString = `${row.time},"${row.nama || '-'}","${row.modal}","${row.margin}","${row.admin}","${row.hargaJual}","${row.profit}"`;
        csvContent += rowString + "\n";
    });

    // Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Laporan_LabaPintar_" + new Date().toISOString().slice(0, 10) + ".csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

/* --- THEME TOGGLE (Drag Mode) --- */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('labaPintarTheme', newTheme);

    // Update Button Icon
    const btn = document.querySelector('.theme-btn');
    if (btn) btn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';

    // Update Chart Colors
    updateChartTheme(newTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('labaPintarTheme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        const btn = document.querySelector('.theme-btn');
        if (btn) btn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        updateChartTheme(savedTheme);
    }
}

function updateChartTheme(theme) {
    if (!profitChartInstance) return;

    if (theme === 'dark') {
        Chart.defaults.color = '#94a3b8'; // Slate 400
        profitChartInstance.data.datasets[0].borderColor = '#1e293b'; // Matches dark card bg
    } else {
        Chart.defaults.color = '#64748b'; // Gray 500
        profitChartInstance.data.datasets[0].borderColor = '#ffffff'; // White
    }
    profitChartInstance.update();
}
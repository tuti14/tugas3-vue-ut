async function loadTemplates() {
  const files = [
    'stock-table',
    'status-badge',
    'do-tracking',
    'order-form',
    'app-modal'
  ];

  const container = document.getElementById('template-container');
  
  if (!container) {
    console.error("Error: Elemen dengan id 'template-container' tidak ditemukan di index.html!");
    return;
  }

  for (const file of files) {
    try {
      // { cache: 'no-store' } untuk memaksa browser mengambil file asli, bukan dari cache
      const response = await fetch('templates/' + file + '.html', { cache: 'no-store' });

      if (!response.ok) {
        console.error('Template gagal dimuat:', file);
        continue;
      }

      const html = await response.text();
      container.insertAdjacentHTML('beforeend', html);
    } catch (error) {
      console.error('Fetch error untuk file ' + file + ':', error);
    }
  }
}

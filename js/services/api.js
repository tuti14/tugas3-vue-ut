const ApiService = {
  /**
   * Mengambil seluruh dummy data dari file JSON
   * @returns {Promise<Object>}
   */
  async fetchData() {
    try {
      // Mengambil dataBahanAjar.json
      const response = await fetch('/data/dataBahanAjar.json');
      if (!response.ok) {
        throw new Error(`Gagal memuat data: Status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("ApiService Error:", error);
      // Fallback data kosong jika fetch gagal agar aplikasi tidak sepenuhnya crash
      return {
        upbjjList: [],
        ekspedisiList: [],
        paketList: [],
        stokBahanAjar: [],
        trackingDO: []
      };
    }
  }
};

// Pasang ke global window agar bisa diakses langsung oleh app.js atau komponen lain
window.ApiService = ApiService;
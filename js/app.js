/**
 * Fungsi Utama Bootstrapper Aplikasi SITTA UT
 */
async function bootstrapperSittaApp() {
  try {
    console.log("1. Mengunduh template komponen dari folder templates/...");
    
    if (typeof loadTemplates === 'function') {
      await loadTemplates(); 
      console.log("2. Injeksi template HTML ke dalam DOM selesai.");
    } else {
      throw new Error("Fungsi loadTemplates tidak ditemukan! Periksa template-loader.js");
    }

    console.log("3. Mendaftarkan komponen Vue secara aman...");

    Vue.component('status-badge', window.StatusBadgeComponent);
    Vue.component('ba-stock-table', window.StockTableComponent);
    Vue.component('do-tracking', window.DoTrackingComponent);
    Vue.component('order-form', window.OrderFormComponent);
    Vue.component('app-modal', window.AppModalComponent);

    console.log("4. Memulai inisialisasi Root Instance Vue...");

    jalankanVue();

  } catch (error) {
    console.error("Gagal memuat aplikasi SITTA UT:", error);
  }
}

// Meregistrasi Filter Global Vue
Vue.filter('formatCurrency', function (value) {
  if (value === undefined || value === null) return 'Rp 0';
  return 'Rp ' + Number(value).toLocaleString('id-ID');
});

Vue.filter('formatQty', function (value) {
  if (value === undefined || value === null) return '0 buah';
  return value + ' buah';
});

Vue.filter('formatLocalDate', function (dateStr) {
  if (!dateStr) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', options);
});

/**
 * Fungsi Penampung Instance Utama Vue
 */
function jalankanVue() {
  new Vue({
    el: '#app',
    data() {
      return {
        tab: 'stok',
        state: {
          upbjjList: [],
          ekspedisiList: [],
          paketList: [],
          stokBahanAjar: [],
          trackingDO: []
        }
      };
    },

    mounted() {
      this.loadInitialData();
    },

    methods: {
      async loadInitialData() {
        if (window.ApiService) {
          const responseData = await window.ApiService.fetchData();
          this.state.upbjjList = responseData.upbjjList || [];
          this.state.ekspedisiList = responseData.ekspedisiList || [];
          this.state.paketList = responseData.paketList || [];
          this.state.stokBahanAjar = responseData.stokBahanAjar || [];
          this.state.trackingDO = responseData.trackingDO || [];
        }
      },
      handleAddItem(newItem) {
        const nextId = this.state.stokBahanAjar.length > 0 
          ? Math.max(...this.state.stokBahanAjar.map(i => i.id)) + 1 
          : 1;
        const itemWithId = {
          id: nextId,
          ...newItem,
          catatanHTML: "<p><strong>Catatan Internal:</strong> Data baru berhasil ditambahkan.</p>"
        };
        this.state.stokBahanAjar.push(itemWithId);
        alert(`Sukses menambahkan kode: ${itemWithId.kode}`);
      },
      handleUpdateItem(updatedItem) {
        const index = this.state.stokBahanAjar.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          Vue.set(this.state.stokBahanAjar, index, { ...this.state.stokBahanAjar[index], ...updatedItem });
          alert(`Sukses memperbarui: ${updatedItem.kode}`);
        }
      },
      handleDeleteItem(id) {
        const targetItem = this.state.stokBahanAjar.find(item => item.id === id);
        if (!targetItem) return;
        this.$refs.modal.open(
          `Apakah Anda yakin ingin menghapus ${targetItem.kode}?`,
          () => { this.state.stokBahanAjar = this.state.stokBahanAjar.filter(item => item.id !== id); }
        );
      },
      handleCreateNewDO(newDoData) {
        this.state.trackingDO.unshift(newDoData);
        this.tab = 'tracking';
        alert(`Pemesanan Berhasil! No DO: ${newDoData.nomorDO}`);
      },
      handleAddStatusProgress({ nomorDO, log }) {
        const doIndex = this.state.trackingDO.findIndex(item => item.nomorDO === nomorDO);
        if (doIndex !== -1) { this.state.trackingDO[doIndex].progress.push(log); }
      }
    }
  });
}

// Menjalankan sistem kendali utama
bootstrapperSittaApp();
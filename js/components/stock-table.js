window.StockTableComponent = {
  template: '#tpl-stock',
  props: {
    items: { type: Array, required: true },
    upbjjList: { type: Array, required: true }
  },
  data() {
    return {
      filters: { upbjj: '', kategori: '', needReorder: false },
      sortBy: 'judul',
      hoveredId: null,
      isEditing: false,
      editingId: null,
      form: { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0 },
      errorMsg: ''
    };
  },
  computed: {
    availableCategories() {
      const categories = this.items
        .filter(item => item.upbjj === this.filters.upbjj)
        .map(item => item.kategori);
      return [...new Set(categories)];
    },
    filteredAndSortedItems() {
      let result = [...this.items];
      if (this.filters.upbjj) {
        result = result.filter(item => item.upbjj === this.filters.upbjj);
      }
      if (this.filters.kategori) {
        result = result.filter(item => item.kategori === this.filters.kategori);
      }
      if (this.filters.needReorder) {
        result = result.filter(item => item.qty <= item.safety || item.qty === 0);
      }
      return result.sort((a, b) => {
        if (this.sortBy === 'qty' || this.sortBy === 'harga') return b[this.sortBy] - a[this.sortBy];
        return a.judul.localeCompare(b.judul);
      });
    }
  },
  methods: {
    handleUpbjjChange() { this.filters.kategori = ''; },
    resetFilters() { this.filters.upbjj = ''; this.filters.kategori = ''; this.filters.needReorder = false; },
    startEdit(item) {
      this.isEditing = true;
      this.editingId = item.id;
      this.form = { ...item };
    },
    cancelEdit() { this.isEditing = false; this.editingId = null; this.clearForm(); },
    clearForm() { this.form = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0 }; this.errorMsg = ''; },
    submitForm() {
      if (!this.form.kode || !this.form.judul || !this.form.upbjj || !this.form.lokasiRak) {
        this.errorMsg = 'Kolom Kode, Judul, UT Daerah, dan Rak wajib diisi!';
        return;
      }
      if (this.isEditing) {
        this.$emit('update-item', { id: this.editingId, ...this.form });
        this.isEditing = false;
        this.editingId = null;
      } else {
        this.$emit('add-item', { ...this.form });
      }
      this.clearForm();
    }
  }
};
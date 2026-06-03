window.DoTrackingComponent = {
  template: '#tpl-tracking',
  props: {
    trackingList: { type: Array, required: true }
  },
  data() {
    return {
      searchQuery: '',
      activeSearch: '',
      newProgressText: {}
    };
  },
  computed: {
    searchedList() {
      const query = this.activeSearch.trim().toLowerCase();
      if (!query) return this.trackingList;
      return this.trackingList.filter(item => {
        const matchDo = item.nomorDO ? item.nomorDO.toLowerCase().includes(query) : false;
        const matchNim = item.nim ? item.nim.toLowerCase().includes(query) : false;
        return matchDo || matchNim;
      });
    }
  },
  methods: {
    executeSearch() { this.activeSearch = this.searchQuery; },
    resetSearch() { this.searchQuery = ''; this.activeSearch = ''; },
    submitProgress(nomorDO) {
      const text = this.newProgressText[nomorDO];
      if (!text || !text.trim()) {
        alert('Keterangan progress logistik tidak boleh kosong!');
        return;
      }
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      this.$emit('add-status-progress', {
        nomorDO: nomorDO,
        log: { waktu: formattedTime, keterangan: text.trim() }
      });
      Vue.set(this.newProgressText, nomorDO, '');
    }
  }
};
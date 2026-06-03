window.OrderFormComponent = {
  template: '#tpl-order',
  props: {
    paketList: { type: Array, required: true },
    ekspedisiList: { type: Array, required: true },
    trackingList: { type: Array, required: true }
  },
  data() {
    return {
      selectedPaketIndex: -1,
      generatedDoNumber: '',
      form: { nim: '', nama: '', ekspedisi: '', tanggalKirim: '' },
      errorMsg: ''
    };
  },
  mounted() { this.generateSequenceDo(); },
  watch: {
    trackingList() { this.generateSequenceDo(); }
  },
  computed: {
    selectedPaket() {
      if (this.selectedPaketIndex >= 0 && this.selectedPaketIndex < this.paketList.length) {
        return this.paketList[this.selectedPaketIndex];
      }
      return null;
    }
  },
  methods: {
    generateSequenceDo() {
      const year = new Date().getFullYear();
      let nextSequence = 1;
      if (this.trackingList && this.trackingList.length > 0) {
        const currentYearPrefix = `DO${year}-`;
        const sequences = this.trackingList
          .map(item => item.nomorDO)
          .filter(noDO => noDO && noDO.startsWith(currentYearPrefix))
          .map(noDO => {
            const parts = noDO.split('-');
            return parts.length > 1 ? parseInt(parts[1], 10) : 0;
          })
          .filter(num => !isNaN(num));
        if (sequences.length > 0) { nextSequence = Math.max(...sequences) + 1; }
      }
      this.generatedDoNumber = `DO${year}-${String(nextSequence).padStart(3, '0')}`;
    },
    validateAndSubmit() {
      if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.selectedPaket) {
        this.errorMsg = 'Mohon lengkapi seluruh kolom bertanda bintang (*) yang wajib diisi!';
        return;
      }
      if (!/^[0-9]{9}$/.test(this.form.nim)) {
        this.errorMsg = 'Format NIM tidak valid! NIM harus terdiri dari tepat 9 digit angka.';
        return;
      }
      this.errorMsg = '';
      let finalTanggalKirim = this.form.tanggalKirim;
      const now = new Date();

      // Membuat format waktu real-time: HH:MM
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (!finalTanggalKirim) {
        // Jika tanggal tidak diisi, gunakan tanggal hari ini
        finalTanggalKirim = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      }

      const newOrder = {
        nomorDO: this.generatedDoNumber,
        nim: this.form.nim,
        nama: this.form.nama,
        ekspedisi: this.form.ekspedisi,
        kodePaket: this.selectedPaket.kode,
        namaPaket: this.selectedPaket.nama,
        detailIsi: this.selectedPaket.isi,
        tanggalKirim: finalTanggalKirim,
        totalHarga: this.selectedPaket.harga,
        
        //Waktu progress log pertama mengikuti real-time jam pembuatan data
        progress: [{ 
          waktu: `${finalTanggalKirim} ${currentTimeStr}`, 
          keterangan: 'Pemesanan berhasil diverifikasi oleh sistem SITTA UT.' 
        }]
      };
      this.$emit('submit-order', newOrder);
      this.resetForm();
    },
    resetForm() {
      this.form.nim = ''; this.form.nama = ''; this.form.ekspedisi = ''; this.form.tanggalKirim = '';
      this.selectedPaketIndex = -1; this.errorMsg = ''; this.generateSequenceDo();
    }
  }
};
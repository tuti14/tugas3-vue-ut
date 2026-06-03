window.StatusBadgeComponent = {
  template: '#tpl-badge',
  props: {
    qty: { type: Number, required: true },
    safety: { type: Number, required: true }
  },
  computed: {
    badgeClass() {
      if (this.qty === 0) return 'status-danger';
      if (this.qty <= this.safety) return 'status-warning';
      return 'status-success';
    },
    badgeText() {
      if (this.qty === 0) return 'Kosong';
      if (this.qty <= this.safety) return 'Kritis';
      return 'Aman';
    },
    badgeIcon() {
      if (this.qty === 0) return '❌';
      if (this.qty <= this.safety) return '⚠️';
      return '✅';
    }
  }
};
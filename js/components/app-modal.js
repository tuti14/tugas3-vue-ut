window.AppModalComponent = {
  template: '#tpl-modal',
  data() {
    return {
      visible: false,
      message: '',
      onConfirmCallback: null
    };
  },
  methods: {
    open(message, onConfirm) {
      this.message = message;
      this.onConfirmCallback = onConfirm;
      this.visible = true;
    },
    decline() {
      this.visible = false;
      this.message = '';
      this.onConfirmCallback = null;
    },
    confirm() {
      if (this.onConfirmCallback && typeof this.onConfirmCallback === 'function') {
        this.onConfirmCallback();
      }
      this.decline();
    }
  }
};
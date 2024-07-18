<template>
  <header class="header" v-if="isLoggedIn">
    <div class="logo">
      <span class="logo-text">INDOBENUA</span>
    </div>
    <div class="date">
      {{ currentDate }}
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Header',
  computed: {
    ...mapState({
      isLoggedIn: state => !!state.user  // Ganti dengan properti isLoggedIn yang sesuai dengan state Anda
    })
  },
  data() {
    return {
      currentDate: ''
    };
  },
  mounted() {
    this.updateCurrentDate();
  },
  methods: {
    updateCurrentDate() {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      this.currentDate = now.toLocaleDateString('id-ID', options);
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  color: #5a69f6;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
}

.date {
  font-size: 14px;
}
</style>

<template>
  <nav class="nav-tabs" v-if="isLoggedIn">
    <router-link to="/" class="nav-link">Home</router-link>
    <router-link to="/task" class="nav-link">Task</router-link>
    <router-link to="/service-call" class="nav-link">Service Call</router-link>
    <!-- Tambahkan link untuk halaman profile jika diperlukan -->
    <router-link to="/profile" class="nav-link">Profile</router-link>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'NavTabs',
  computed: {
    ...mapState({
      isLoggedIn: state => !!state.user  // Ganti dengan properti isLoggedIn yang sesuai dengan state Anda
    })
  }
};
</script>

<style scoped>
.nav-tabs {
  background-color: #007BFF; /* Warna biru untuk tab */
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
}

.nav-link {
  margin-right: 10px;
  color: #fff;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
}
</style>

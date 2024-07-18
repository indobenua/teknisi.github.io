<template>
  <div class="login-container">
    <div class="login-form">
      <h1>INDOBENUA</h1>
      <form @submit.prevent="login" v-if="!loading">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" v-model="username" id="username" required autocomplete="off">
          <span v-if="errors.username" class="error-message">{{ errors.username[0] }}</span>
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" required autocomplete="off"/>
          <span v-if="errors.password" class="error-message">{{ errors.password[0] }}</span>
        </div>
        <button type="submit" class="submit-button">Login</button>
      </form>
      <div v-else>
        <i class="fa fa-spinner fa-spin"></i>
      </div>
      <span v-if="errors.general" class="error-message">{{ errors.general }}</span>
    </div>
  </div>
</template>

<script>
import platform from 'platform';
import axios from '@/utils/axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      deviceName: '',
      errors: {},
      loading: false  // Tambahkan variabel loading
    };
  },
  mounted() {
    this.deviceName = platform.name + ' ' + platform.version;
  },
  methods: {
    async login() {
      this.errors = {}; // Clear previous errors
      this.loading = true; // Set loading to true during login process
      try {
        const response = await axios.post('/login', {
          username: this.username,
          password: this.password,
          device_name: this.deviceName
        });

        if (response.data && response.data.token) {
          localStorage.setItem('api_token', response.data.token);
          this.$router.push('/');
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          // Handle validation errors
          this.errors = error.response.data.errors || {};
        } else {
          // Handle general errors
          this.errors.general = 'Login failed. Please check your credentials and try again.';
        }
      } finally {
        this.loading = false; // Set loading to false after login attempt
      }
    }
  }
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Arial, sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-form {
  margin-top: 10vh;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

.logo {
  width: 100px;
  height: auto;
  margin-bottom: 1rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #5a69f6;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.25);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #007BFF;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>

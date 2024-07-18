<template>
  <div class="home-container">
    <div class="welcome-message" v-if="user">
      Welcome, {{ user.surname }} {{ user.first_name }} {{ user.last_name }}
    </div>
    <div class="button-container">
      <button class="button check-in-button" @click="handleCheckLockIn">Check Lock In</button>
      <button class="button check-out-button" @click="handleCheckLockOut">Check Lock Out</button>
    </div>
    <div class="location-text">{{ locationText }}</div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import { mapState } from 'vuex';
import platform from 'platform';
import { getLocation } from '@/utils/geo';

export default {
  data() {
    return {
      loading: true,
      errorMsg: null,
      position: null,
      locationDetails: null,
      deviceName: ''
    };
  },
  computed: {
    ...mapState(['user']),
    locationText() {
      return this.errorMsg ? this.errorMsg : this.locationDetails ? this.locationDetails.display_name : 'Waiting..';
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await axios.get('/statistic');
        this.setData(response.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch data:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateApp() {
      try {
        // eslint-disable-next-line no-console
        console.log('Updating app...');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching latest update: ${error}`);
      }
    },
    async fetchLocation() {
      try {
        const { position, loc } = await getLocation({ showLoc: true });

        // Simpan data lokasi ke dalam state atau variabel lainnya
        this.position = position;
        this.locationDetails = loc;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch location:', error);
        this.errorMsg = error.message;
      }
    },
    async handleCheckLockIn() {
      try {
        await axios.post('/check-lock', {
          latitude: this.position.coords.latitude,
          longitude: this.position.coords.longitude,
          description: 'Check Lock In',
          name: 'check_clock_in'
        });
        alert('Success', 'Check Lock In successful');
      } catch (error) {
        alert('Error', error.message);
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async handleCheckLockOut() {
      try {
        await axios.post('/check-lock', {
          latitude: this.position.coords.latitude,
          longitude: this.position.coords.longitude,
          description: 'Check Lock Out',
          name: 'check_clock_out'
        });
        alert('Success', 'Check Lock Out successful');
      } catch (error) {
        alert('Error', error.message);
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  },
  mounted() {
    this.deviceName = platform.name + ' ' + platform.version;
    this.updateApp();
    this.fetchLocation();
    setTimeout(() => {
      if (!!localStorage.getItem('api_token') && !document.querySelector('.nav-tabs')) {
        location.reload()
      }
    }, 5e3)

  }
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.welcome-message {
  padding-top: 10px;
  padding-left: 10px;
  font-size: 18px;
}

.button-container {
  display: flex;
  justify-content: space-around;
  margin-top: 100px;
}

.button {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 17px;
  color: #fff;
  cursor: pointer;
}

.check-in-button {
  background-color: lightgreen;
}

.check-out-button {
  background-color: lightcoral;
}

.location-text {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 10px;
}
</style>

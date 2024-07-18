import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/utils/axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null, // Menyimpan data pengguna
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
  },
  actions: {
    async fetchUser({ commit }) {
      try {
        const response = await axios.get('/user');
        commit('setUser', response.data); // Menyimpan data pengguna ke dalam state
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    },
  }
});

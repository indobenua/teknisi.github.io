<template>
    <div id="app">
        <Header />
        <NavTabs />
        <router-view></router-view>
        <div>
            <span class="icon-plus danger" @click="openModal">
                <i class="fas fa-plus-circle"></i>
            </span>
            <Modal v-if="isModalVisible" @close="closeModal" @success="handleSuccess" />
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import NavTabs from '@/components/NavTabs.vue';
import { mapActions } from 'vuex';
import Modal from '@/components/Modal.vue';
import axios from '@/utils/axios';

export default {
    name: 'App',
    components: {
        Header,
        NavTabs,
        Modal
    },
    data() {
        return {
            isModalVisible: false,
        };
    },
    created() {
        this.fetchUser();
        this.$axios = axios;
    },
    methods: {
        openModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
        handleSuccess(data) {
            console.log('Reminder added successfully:', data);
            // Handle success, e.g., refresh list, show toast, etc.
        },
        ...mapActions(['fetchUser'])
    }
};
</script>

<style>
#app {
    font-family: Arial, sans-serif;
}
</style>
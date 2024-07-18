<template>
    <div class="safe-area">
        <!-- CustomHeader -->
        <router-link :to="{ name: 'EditProfile', params: { userData } }">
            <button class="edit-button" >
                <i class="fa fa-edit edit-btn"></i>
            </button>
        </router-link>
        <div class="profile-container">
            <img :src="userData && userData.media ? userData.media.display_url : '/assets/images/default_profile.png'"
                alt="Profile Image" class="profile-image" />
            <h1 class="title">Profile</h1>
            <div v-if="userData" class="data-profile-container">
                <div class="info-container">
                    <span class="label">Name:</span>
                    <span class="value">{{ userData.surname }} {{ userData.first_name }} {{ userData.last_name }}</span>
                </div>
                <div class="info-container">
                    <span class="label">Username:</span>
                    <span class="value">{{ userData.username }}</span>
                </div>
                <div class="info-container">
                    <span class="label">Email:</span>
                    <span class="value">{{ userData.email }}</span>
                </div>
                <div class="info-container">
                    <span class="label">Jabatan:</span>
                    <span class="value">{{ userData.jabatan.name }}</span>
                </div>
                <div class="logout-button-container">
                    <button @click="handleLogout">Logout</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from '@/utils/axios';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const userData = ref(null);
        const loading = ref(true);

        const handleLogout = async () => {
            loading.value = true;
            try {
                await axios.post('/logout')
                localStorage.clear();
                location.replace('/login')

            } catch (error) {
                console.error("Logout failed:", error);
            } finally {
                loading.value = false;
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user');
                userData.value = response.data;
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            fetchUserData();
        });


        return {
            userData,
            loading,
            handleLogout
        };
    }
};
</script>

<style scoped>
.safe-area {
    display: flex;
    flex-direction: column;
    background-color: #f0f4f8;
    padding: 20px;
    position: relative;
    min-height: 100vh;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
}

.profile-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
}

.profile-image {
    width: 50%;
    height: auto;
    border-radius: 50%;
    margin-bottom: 20px;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

.data-profile-container {
    width: 90%;
}

.info-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2em;
}

.label {
    font-size: 18px;
    font-weight: bold;
    color: #666;
}

.value {
    font-size: 18px;
    color: #333;
}

.logout-button-container {
    text-align: center;
}

.logout-button-container button {
    background-color: rgb(170, 12, 12);
    color: #f0f4f8;
    border-radius: 7px;
    padding: 1em;
}

.edit-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

.edit-btn {
    font-size: 24px;
    color: #000;
}
</style>
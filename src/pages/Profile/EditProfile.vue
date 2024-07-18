<template>
    <div class="safe-area">
        <div class="custom-header">
            <!-- CustomHeader -->
        </div>
        <div class="form-container">
            <div class="image-container">
                <img :src="profilePhoto ? profilePhoto.uri : (userData && userData.media ? userData.media.display_url : '/assets/images/default_profile.png')"
                    alt="Profile Image" class="profile-image" />
                <button class="edit-icon" @click="pickImage">
                    <i class="fa fa-edit"></i>
                </button>
                <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange" style="display: none;">
            </div>
            <input v-model="surName" class="input" placeholder="SurName" />
            <input v-model="firstName" class="input" placeholder="First Name" />
            <input v-model="lastName" class="input" placeholder="Last Name" />
            <input v-model="email" class="input" placeholder="Email" />
            <input v-model="currentPassword" type="password" class="input" placeholder="Current Password" />
            <input v-model="password" type="password" class="input" placeholder="Password" />
            <input v-model="confirmPassword" type="password" class="input" placeholder="Confirm Password" />
            <button @click="handleSave" class="save-button">Save</button>
        </div>
        <div v-if="loading" class="loading-overlay">
            <i class="fa fa-spinner fa-spin"></i>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios';
import { ref, onMounted, watch } from 'vue';
import Vue from 'vue';

export default {

    setup() {
        const userData = ref(null);

        const surName = ref(userData.surname || '');
        const firstName = ref(userData.first_name || '');
        const lastName = ref(userData.last_name || '');
        const email = ref(userData.email || '');
        const password = ref('');
        const confirmPassword = ref('');
        const currentPassword = ref('');
        const profilePhoto = ref(userData.profile_photo || null);
        const loading = ref(false);

        const fileInput = ref(null);

        const pickImage = async () => {
            fileInput.value.click();
        };
        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    profilePhoto.value = {
                        uri: URL.createObjectURL(file),
                        file
                    };
                };
                reader.readAsDataURL(file);
            }
        };
        const logout = async () => {
            Vue.$toast.success('Password berhasil diubah');
            localStorage.clear()
            location.replace('/login')
        }

        const handleSave = async () => {
            if (password.value !== confirmPassword.value) {
                Vue.$toast.error('Password tidak sama!');
                return;
            }
            if (!!password.value && !currentPassword.value) {
                Vue.$toast.error('Passwords tidak boleh kosong!');
                return;
            }

            loading.value = true;
            try {
                const formData = new FormData();
                formData.append('surname', surName.value);
                formData.append('first_name', firstName.value);
                formData.append('last_name', lastName.value);
                formData.append('email', email.value);
                if (password.value) {
                    formData.append('password', password.value);
                    formData.append('current_password', currentPassword.value);
                }
                if (profilePhoto.value && profilePhoto.value.file) {
                    formData.append('profile_photo', profilePhoto.value.file);
                }

                const response = await axios.post('/user', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    console.log(response.data);
                    if (response.data.password_changed) {
                        logout();
                        return;
                    }
                    if (response.data.error) {
                        Vue.$toast.error(response.data.msg);
                        return;
                    }
                    Vue.$toast.success("Profile berhasil diupdate")
                } else {
                    Vue.$toast.error('Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                Vue.$toast.error('Failed to update profile');
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
        watch(userData, (newValue) => {
            if (newValue) {
                surName.value = newValue.surname || '';
                firstName.value = newValue.first_name || '';
                lastName.value = newValue.last_name || '';
                email.value = newValue.email || '';
                profilePhoto.value = newValue.profile_photo || null;
            }
        });

        return {
            userData,
            surName,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            currentPassword,
            profilePhoto,
            loading,
            pickImage,
            handleFileChange,
            handleSave,
            fileInput
        };
    },
};
</script>

<style scoped>
.safe-area {
    display: flex;
    flex-direction: column;
    background-color: #f0f4f8;
    padding: 20px;
    justify-content: center;
    min-height: 100vh;
}

.custom-header {
    position: absolute;
    top: 20px;
    left: 20px;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: relative;
}

.edit-icon {
    position: absolute;
    bottom: 0;
    right: 10px;
    background-color: #2332ee;
    border-radius: 10px;
    padding: 5px;
    color: #fff;
}

.input {
    width: 100%;
    height: 40px;
    border: 1px solid gray;
    border-radius: 5px;
    padding-left: 10px;
    margin-bottom: 20px;
}

.save-button {
    background-color: #2332ee;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading-overlay i {
    font-size: 2rem;
    color: #fff;
}
</style>
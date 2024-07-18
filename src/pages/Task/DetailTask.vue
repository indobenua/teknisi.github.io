<template>
    <div>
        <div class="detail-task-container">
            <div class="header">
                <router-link to="/task" class="back-button">Back to Tasks</router-link>
                <h1>Detail Task</h1>
            </div>
            <div v-if="task">
                <div class="task-detail">
                    <h2>{{ task.store.store_name }}</h2>
                    <p><strong>Kode Toko:</strong> {{ task.store.store_code }}</p>
                    <p><strong>Rute:</strong> {{ task.store.route.index_route }}</p>
                    <p><strong>Nomer Transaksi:</strong> {{ task.trx_no }}</p>
                    <p><strong>Periode:</strong> {{ task.periode }}</p>
                    <p><strong>Request Date:</strong> {{ formatDate(task.req_date) }}</p>
                    <p><strong>Status:</strong> {{ task.task.status }}</p>
                </div>

                <!-- Catatan Bulan Lalu -->
                <div class="infoContainer">
                    <div class="infoBox">
                        <div class="infoTitle">Catatan bulan lalu:</div>
                        <div class="danger">{{ task.previous_month_projects && task.previous_month_projects.length ?
                task.previous_month_projects.reduce((a, b) => a + b.note, '').reduce((a, b) => a + b.note,
                    '') : '' }}</div>
                    </div>
                    <div class="infoBox">
                        <div class="infoTitle">Tambahkan Catatan bulan ini:
                            <span class="icon-plus danger" @click="openModal">
                                <i class="fas fa-plus-circle"></i>
                            </span>
                            <Modal v-if="isModalVisible" @close="closeModal" @success="handleSuccess" :taskId="task.id" />

                            <div>
                                {{ task.note }}
                            </div>
                        </div>
                        <div class=""></div>
                    </div>
                </div>

                <!-- Comments -->
                <div>
                    <ul>
                        <li v-for="(comment, index) in task.task.comments" :key="index">{{ comment }}</li>
                    </ul>
                </div>
            </div>

            <div v-else class="loading-indicator">
                <i class="fa fa-spinner fa-spin"></i>
            </div>

        </div>
        <!-- Form Input -->
        <div class="input-form">
            <textarea v-model="additionalText" placeholder="Tambahkan pesan..." class="text-input"></textarea>
            <div class="icons">
                <label for="file-upload" class="file-upload-button">
                    <i class="fas fa-paperclip"></i>
                    <input id="file-upload" type="file" @change="handleFileUpload" style="display:none">
                </label>
                <button @click="submitData" class="send-button">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>


    </div>
</template>

<script>

export default {
    data() {
        return {
            task: null,
            newNote: '',
            additionalText: '',
            previewImage: null,
            previewImageName: '',
        };
    },
    created() {
        this.task = this.$route.params.task;
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID');
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.previewImageName = file.name;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewImage = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        submitData() {
            // eslint-disable-next-line no-console
            console.log('Submitting data:', this.additionalText, this.previewImage)
        },
        openModal(taskId) {console.log(this, taskId)
            this.isModalVisible = true;
            this.currentTaskId = taskId;
        },
        closeModal() {
            this.isModalVisible = false;
            this.currentTaskId = null;
        },
        handleSuccess(data) {
            console.log('Reminder added successfully:', data);
            // Handle success, e.g., refresh list, show toast, etc.
        },
        
    }
};
</script>

<style scoped>
.detail-task-container {
    padding: 10px;
    font-family: Arial, sans-serif;
    position: relative;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.back-button {
    text-decoration: none;
    color: #007BFF;
    font-weight: bold;
}

.back-button:hover {
    text-decoration: underline;
}

.task-detail {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    background-color: #f9f9f9;
    margin-bottom: 16px;
}

.task-detail h2 {
    margin-top: 0;
}

.task-detail p {
    margin: 10px 0;
}

.task-detail ul {
    list-style-type: disc;
    margin: 10px 0;
    padding-left: 20px;
}

.loading-indicator {
    text-align: center;
    margin-top: 20px;
}

.loading-text {
    color: #777;
}

.infoContainer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.infoBox {
    flex: 1;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    margin-right: 1em;
}

.infoBox:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.infoTitle {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.danger {
    background-color: #f8d7da;
    color: #721c24;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
}

.input-form {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background-color: #f9f9f9;
    border-top: 1px solid #ccc;
}

.text-input {
    flex: 1;
    height: 40px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 20px;
    resize: none;
    margin-right: 10px;
}

.icons {
    display: flex;
    align-items: center;
}

.file-upload-button {
    margin-right: 20px;
    cursor: pointer;
}

.send-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #007BFF;
}
</style>

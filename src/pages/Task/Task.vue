<template>
    <div class="task-container">
        <div class="header-container">
            <div class="filter-container">
                <input type="text" class="input" placeholder="Search..." v-model="searchText" />
                <button class="filter" @click="toggleDateFilterModal">
                    {{ dateFilter }}
                </button>
                <button class="filter" :style="{ backgroundColor: getStatusFilterColor() }"
                    @click="toggleStatusFilterModal">
                    {{ statusFilter }}
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading-indicator">
            
            <div class="loading-text">Loading...</div>
        </div>

        <div v-else-if="!filteredTasks.length" class="empty-message">
            <div>No tasks available.</div>
        </div>

        <div v-else class="tasks-list">
            <div v-for="(task, index) in filteredTasks" :key="index" class="task-item">
                <router-link :to="{ name: 'DetailTask', params: { task: task, id: task. id } }" class="task-link">
                    <div class="item" :style="{ backgroundColor: getStatusFilterColor() }">
                        <div class="avatar">
                            <span class="avatar-text">{{ task.store.store_code }}</span>
                        </div>
                        <div class="item-content">
                            <div class="title">{{ task.store.route.index_route }}. {{ task.store.store_name }}</div>
                            <div class="description">{{ task.trx_no }} Periode: {{ task.periode }}</div>
                            <div class="reminder">
                                {{ task.previous_month_projects .reduce((a, b) => (!a ? 'REMINDER: ' : '') + b.note, '') .substr(0, 50) }}
                            </div>
                        </div>
                        <div class="right-column">
                            <div class="req-date">{{ formatDate(task.req_date) }}</div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <!-- Date Filter Modal -->
        <div v-if="isDateFilterModalVisible" class="modal-backdrop">
            <div class="modal-container">
                <button @click="selectDateFilter('Hari Ini')">Hari Ini</button>
                <button @click="selectDateFilter('Minggu Ini')">Minggu Ini</button>
                <button @click="selectDateFilter('Bulan Ini')">Bulan Ini</button>
            </div>
        </div>

        <!-- Status Filter Modal -->
        <div v-if="isStatusFilterModalVisible" class="modal-backdrop">
            <div class="modal-container">
                <button @click="selectStatusFilter('Pending')">Pending</button>
                <button @click="selectStatusFilter('Review')">Review</button>
                <button @click="selectStatusFilter('Lengkap')">Lengkap</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            loading: false,
            tasks: [],
            searchText: '',
            dateFilter: 'Hari Ini',
            statusFilter: 'Pending',
            isDateFilterModalVisible: false,
            isStatusFilterModalVisible: false
        };
    },
    computed: {
        filteredTasks() {
            return this.tasks.filter(task =>
                (task.store.store_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    task.task.subject.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    task.store.store_code.toLowerCase().includes(this.searchText.toLowerCase())) &&
                this.filterTasks(task)
            );
        }
    },
    methods: {
        async fetchTasks() {
            this.loading = true;
            try {
                const res = await axios.get('/task');
                this.tasks = res.data;
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                this.loading = false;
            }
        },
        filterTasks(task) {
            const today = new Date();
            const taskDate = new Date(task.req_date);

            const dateMatch = (() => {
                if (this.dateFilter === 'Hari Ini') {
                    return taskDate.toDateString() === today.toDateString();
                } else if (this.dateFilter === 'Minggu Ini') {
                    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                    return taskDate >= startOfWeek && taskDate <= endOfWeek;
                } else if (this.dateFilter === 'Bulan Ini') {
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    return taskDate >= startOfMonth && taskDate <= endOfMonth;
                }
                return true;
            })();

            const statusMatch = (() => {
                if (this.statusFilter === 'Lengkap') {
                    return task.task.status === 'completed';
                } else if (this.statusFilter === 'Review') {
                    return task.task.status === 'in_progress' && task.task.comments && task.task.comments.length > 0;
                } else if (this.statusFilter === 'Pending') {
                    return task.task.status === 'in_progress' && (!task.task.comments || task.task.comments.length === 0);
                }
                return true;
            })();

            if (this.dateFilter === 'Hari Ini' && this.statusFilter === 'Pending') {
                return taskDate <= today && statusMatch;
            }

            return dateMatch && statusMatch;
        },
        toggleDateFilterModal() {
            this.isDateFilterModalVisible = !this.isDateFilterModalVisible;
        },
        toggleStatusFilterModal() {
            this.isStatusFilterModalVisible = !this.isStatusFilterModalVisible;
        },
        selectDateFilter(filter) {
            this.dateFilter = filter;
            this.isDateFilterModalVisible = false;
        },
        selectStatusFilter(filter) {
            this.statusFilter = filter;
            this.isStatusFilterModalVisible = false;
        },
        getStatusFilterColor() {
            switch (this.statusFilter) {
                case 'Pending':
                    return '#fff3b0'; // light yellow
                case 'Review':
                    return '#b2f0f0'; // light cyan
                case 'Lengkap':
                    return '#d4f8d4'; // light green
                default:
                    return '#fff';
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });//.replace(/\//g, '-');
        }
    },
    mounted() {
        this.fetchTasks();
    }
};
</script>

<style scoped>
.task-container {
    padding: 10px;
    font-family: Arial, sans-serif;
}

.header-container {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
}

.input {
    flex: 1;
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 80%;
}

.filter {
    padding: 8px;
    border: 1px solid #777;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
}

.filter:hover {
    background-color: #f0f0f0;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
}

.modal-container button {
    display: block;
    width: 100%;
    padding: 10px 0;
    margin-bottom: 10px;
    text-align: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.modal-container button:hover {
    background-color: #f0f0f0;
}

.tasks-list {
    margin-top: 10px;
    overflow-y: auto;
    height: calc(100vh - 60px);
}

.task-item {
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
}

.task-link {
    text-decoration: none;
    display: block;
    width: 100%;
}

.task-item .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
}

.task-item .item:hover {
    background-color: #f0f0f0;
}

.avatar {
    width: 40px;
    height: 40px;
    background-color: #007BFF;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
}

.avatar-text {
    color: #fff;
    font-size: 12px;
}

.item-content {
    flex: 1;
}

.title {
    font-weight: bold;
    font-size: 16px !important;
    margin-bottom: 5px;
}

.description {
    color: #555;
    margin-bottom: 5px;
}

.reminder {
    color: #777;
}

.right-column {
    min-width: 40px;
    text-align: center;
}

.req-date {
    font-size: 10px;
    color: #777;
}

.loading-indicator {
    text-align: center;
    margin-top: 20px;
}

.loading-text {
    color: #777;
}

.empty-message {
    text-align: center;
    margin-top: 20px;
    color: #777;
}
</style>

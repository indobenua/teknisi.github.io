<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 class="reminder-title">Add Reminder</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="reminder">Sebagai pengingat bulan depan:</label>
            <textarea placeholder="Tulis disini" v-model="reminderText" id="reminder" required ></textarea>
          </div>
          <button type="submit" class="btn-submit-modal">Submit</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['isVisible'],
    data() {
      return {
        reminderText: '',
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      async submitForm() { console.log(this)
        try {
          const response = await this.$axios.post('/reminder/', {
            reminder: this.reminderText,
          });
          if (response.status === 200) {
            this.$emit('success', response.data);
            this.closeModal();
          }
        } catch (error) {
          console.error('Error submitting reminder:', error);
        }
      },
    },
    created() {
        console.log(this, 'dimodal')
    }
  };
  </script>
  
  <style>
  .modal-overlay {
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
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    max-width: 90%;
    position: relative;
  }
  .reminder-title{
    font-size: 16px;
    color: blue;
    margin-bottom: 1em;;
  }
  #reminder{
    width: 96%;
    height: 5em;
    border: 0.2px solid  gray;
    border-radius: 4px;
    padding: 8px;
  }
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .btn-submit-modal {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .btn-submit-modal:hover {
    background-color: #218838;
  }
  </style>
  
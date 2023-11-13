<template>
  <div>
    <h2>Update Your Data</h2>
    NAME &nbsp;: {{ userDataObject.user_data.name }}<br>
    PAWO &nbsp;&nbsp;: {{ userDataObject.user_data.password }}<br>
    AGE &nbsp;&nbsp;&nbsp;&nbsp;: {{ userDataObject.user_data.age }}<br><br>
    make me:
    <button @click="updateUserAge(-1)">younger</button>&nbsp;
    <button @click="updateUserAge(+1)">older</button><br>
    <label for="username">Enter your new name:&nbsp;</label>
    <input type="text" id="username" v-model="newUserName" />
    <button @click="updateUserName">Save</button><br><br>
    <label for="password">Enter your new Password:&nbsp;</label>
    <input type="text" id="password" v-model="newUserPassword" />
    <button @click="updateUserPassword">Save</button><br><br>
  </div>

  <!--DISPLAY ERROR-->
  <div v-if="errorMessage" :style="{ color: errorColor }">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {

  emits: [
    'update-user-name',
    'update-user-password'
  ],

  data() {
    return {
      newUserName: "",
      newUserPassword: "",
      errorMessage: null, // New variable to track error messages
      errorColor: 'red',
    }
  },
  props: {
    userDataObject: {
      type: Object, // comes from prev file LoginRegister.vue
      required: true,
    },
    fetchUserDataFunc: {
      type: Function,
      required: true,
    },
  },

  methods: {

    async updateUserName() {
      try
      {
        if (!this.newUserName.trim())
        {
          this.errorMessage = 'Please enter a username!';
          return;  // Do not proceed with the API request if the input is empty
        }
        const myInit = {
          method: "POST",
          body: JSON.stringify({
            newName: this.newUserName,
          }),
        };
        console.log('USER ID: ')
        console.log(this.userDataObject.user_data.id)
        const apiUrl = `http://localhost:6969/user/updateUserName/${this.userDataObject.user_data.id}/`;
        const response = await fetch(apiUrl, myInit);
        if (response.ok)
        {
          this.errorMessage = null
          console.log('Username updated successfully');
          this.$emit('update-user-name', this.newUserName);
          this.newUserName = ""
        }
        else {
          console.error('Failed to update Username:', response.statusText);
          this.errorMessage = "Username already exists"
        }
      }
      catch (error) {
        console.error('Error updating Username:', error);
        this.errorMessage = "Failed to update username"
      }
    },

    async updateUserPassword() {
      try
      {
        if (!this.newUserPassword.trim())
        {
          this.errorMessage = 'Please enter a password!';
          return;  // Do not proceed with the API request if the input is empty
        }
        const myInit = {
          method: "POST",
          body: JSON.stringify({
            newPassword: this.newUserPassword,
          }),
        };
        console.log('USER ID: ')
        console.log(this.userDataObject.user_data.id)
        const apiUrl = `http://localhost:6969/user/updateUserPassword/${this.userDataObject.user_data.id}/`;
        const response = await fetch(apiUrl, myInit);
        if (response.ok)
        {
          this.errorMessage = null
          console.log('Password updated successfully');
          this.$emit('update-user-password', this.newUserPassword);

          this.newUserPassword = ""
        }
        else {
          console.error('Failed to update Password:', response.statusText);
          this.errorMessage = "Failed to update Password 1"
        }
      }
      catch (error) {
        console.error('Error updating Password:', error);
        this.errorMessage = "Failed to update Password 2"
      }
    },

    async updateUserAge(operation) {
      try
      {
        if (this.userDataObject.user_data.age <= 0 && operation === -1) {
          this.errorMessage = "Age can't be negative!"
          return
        }
        if (this.userDataObject.user_data.age >= 200 && operation === +1) {
          this.errorMessage = "Nah, you can't be older then 200"
          return
        }
        const myInit = {
          method: "POST",
          body: JSON.stringify({
            newAge: this.userDataObject.user_data.age + operation,
          }),
        };
        const apiUrl = `http://localhost:6969/user/update-age/${this.userDataObject.user_data.id}/`;
        const response = await fetch(apiUrl, myInit);
        if (response.ok)
        {
          this.errorMessage = null
          console.log('Age updated successfully');
          this.isLoggedIn = true
          // Fetch user data again to get the updated information
          this.fetchUserDataFunc();
        }
        else {
          console.error('Failed to update age:', response.statusText);
        }
      }
      catch (error) {
        console.error('Error updating age:', error);
      }
    },
  }
};
</script>
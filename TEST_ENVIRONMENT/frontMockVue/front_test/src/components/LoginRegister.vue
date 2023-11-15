
<template>
  <!--USER IS LOGGED IN-->
  <div v-if="!showChatFlag && !updateUserDataFlag && isLoggedIn && userData && userData.user_data">
    <div class="container-xxl">
      <h2>Welcome, {{ userData.user_data.name }}!</h2><br><br>
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="imageSwitch"
          v-model="showImageFlag"
        />
        <label class="form-check-label" for="imageSwitch">
          {{ showImageFlag ? 'Hide' : 'Show' }} Image
        </label><br><br>
      </div>
      <button @click="flipUpdateUserFlag">Change User Data</button><br><br>
      <button @click="flipChatFlag">Show Chat</button><br><br><br><br><br>
      <button @click="logout" class="btn btn-danger">Logout</button><br><br>
      <img v-if="showImageFlag" :src="imageUrl" alt="Uploaded Image"/>
    </div>
  </div>

  <!--USER CLICKED UPDATE USER DATA-->
  <div v-else-if="updateUserDataFlag">
    <div class="container-xxl">
      <UpdateUserData
          :userDataObject="userData"
          :fetchUserDataFunc="fetchUserData"
          @update-user-name="updateUserNameInParent"
          @update-user-password="updateUserPasswordInParent"/>
      <button @click="flipUpdateUserFlag">Go Back to Profile</button>
    </div>
  </div>

  <!--USER CLICKED SHOW CHAT-->
  <div v-else-if="showChatFlag">
    <div class="container-xxl">
      <ChatComponent
          :userDataObject="userData"
          :fetchUserDataFunc="fetchUserData"/>
      <button @click="flipChatFlag">Go Back to Profile</button>
    </div>
  </div>

  <!--USER IS NOT LOGGED IN-->
  <div v-else>

    <!--LOGIN PAGE-->
    <div v-if="showPage === 'login'">
      <div class="container-xxl">
        <h1>Login Page</h1>
          <!-- Username Input -->
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" v-model="name">
            </div>
          </div>
          <!-- Password Input -->
         <div class="row">
          <div class="col-md-3 mb-4">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password">
          </div>
        </div>
        <button @click="fetchUserData" class="btn btn-success">Login</button><br><br>
        <button @click="changeToRegisterPage" class="btn btn-primary btn-sm">No Account yet?</button><br><br>

        <!--DISPLAY ERROR-->
        <div v-if="errorMessage" :style="{ color: errorColor }">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!--REGISTER PAGE-->
    <div v-else>
      <div class="container-xxl">
        <h1>Register Page</h1>
        <div class="row">
          <!-- Username Input -->
          <div class="col-md-3 mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" v-model="new_name">
          </div>
        </div>
          <!-- Age Input -->
        <div class="row">
          <div class="col-md-3 mb-3">
            <label for="age" class="form-label">Age</label>
            <input type="text" class="form-control" id="age" v-model="new_age">
          </div>
        </div>
          <!-- Password Input -->
        <div class="row">
          <div class="col-md-3 mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="new_password">
          </div>
        </div>
        <button @click="createAccount" class="btn btn-success">Login</button><br><br>
        <button @click="changeToLoginPage" class="btn btn-primary btn-sm">Have an Account?</button><br><br>

        <!--DISPLAY ERROR-->
        <div v-if="errorMessage" :style="{ color: errorColor }">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ChatComponent from "./ChatComponent.vue";
import UpdateUserData from "./UpdateUserData.vue";

export default {
  components: {
    ChatComponent,
    UpdateUserData
  },
  data() {
    return {
      updateUserDataFlag: false,
      showChatFlag: false,
      name: "",  // Make sure to initialize the name property
      password: "",
      new_name: "",
      new_age: "",
      new_password: "",
      userData: null,
      errorMessage: null, // New variable to track error messages
      loginColor: 'green',
      errorColor: 'red',
      isLoggedIn: false,
      showImageFlag: false,
      imageUrl: "images/moon_dog.jpg",
      showPage: 'login'
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {

    updateUserNameInParent(newUserName) {
      try {
        this.userData.user_data.name = newUserName;
        this.name = newUserName
      } catch (error) {
        console.error('Error updating username in parent:', error);
      }
    },

    updateUserPasswordInParent(newUserPassword) {
      try {
        this.userData.user_data.password = newUserPassword;
        this.password = newUserPassword
      } catch (error) {
        console.error('Error updating password in parent:', error);
      }
    },

    flipUpdateUserFlag() {
      this.updateUserDataFlag = !this.updateUserDataFlag
    },

    flipChatFlag() {
      this.showChatFlag = !this.showChatFlag
    },

    async checkAuthentication()
    {
      // You would typically perform an API request or check a stored token here
      // For simplicity, I'll use a timeout to simulate an asynchronous check
      setTimeout(() => {
        const isAuthenticated = true;  // Replace with your actual authentication logic
        this.isLoggedIn = isAuthenticated;

        // Fetch user data if authenticated
        if (isAuthenticated) {
          this.fetchUserData();
        }
      }, 1000);  // Simulating a delay for the authentication check
    },

    async fetchUserData()
    {
      try
      {
        if (!this.name.trim())
        {
          this.errorMessage = 'Please enter ur username!';
          return;  // Do not proceed with the API request if the input is empty
        }
        if (!this.password.trim())
        {
          this.errorMessage = 'Please enter ur password!';
          return;
        }
        const response = await fetch(`http://127.0.0.1:6969/user/data/${this.name}/${this.password}/`);
        const data = await response.json();
        if (response.ok)
        {
          this.errorMessage = null;
          this.isLoggedIn = true;
          this.userData = data;
        }
        else {
          this.errorMessage = data.error;
        }
      }
      catch (error)
      {
        console.error('Error fetching user data:', error);
        this.errorMessage = 'Error fetching user data';
      }
    },

    flipImageFlag() {
      this.showImageFlag = !this.showImageFlag;
    },

    logout() {
      this.isLoggedIn = false;
      this.name = ""
      this.password = ""
    },

    changeToRegisterPage() {
      this.showPage = 'register'
      this.name = ""
      this.password = ""
    },
    changeToLoginPage() {
      this.showPage = 'login'
      this.new_name = ""
      this.new_password = ""
      this.new_age = ""
    },

    async createAccount() {
      try
      {
        if (!this.new_name.trim())
        {
          this.errorMessage = 'Please enter a username!';
          return;  // Do not proceed with the API request if the input is empty
        }
        if (!this.new_age.trim())
        {
          this.errorMessage = 'Please enter a age!';
          return;
        }
        if (!this.new_password.trim())
        {
          this.errorMessage = 'Please enter a password!';
          return;
        }
        const apiUrl = `http://localhost:6969/user/createAccount/${this.new_name}/${this.new_password}/${this.new_age}/`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok)
        {
          console.log('creating new account successfully');
          this.isLoggedIn = true;
          this.name = this.new_name
          this.age = this.new_age
          this.password = this.new_password
          this.new_name = ""
          this.new_password = ""
          this.new_age = ""
          // Fetch user data again to get the updated information
          await this.fetchUserData();
        }
        else
        {
          console.error('Failed to creating new account:', response.statusText);
          this.errorMessage = data.error;
        }
      }
      catch (error) {
        console.error('Error creating new account:', error);
        this.errorMessage = "lol some big error am been";
      }
    }
  },
};
</script>

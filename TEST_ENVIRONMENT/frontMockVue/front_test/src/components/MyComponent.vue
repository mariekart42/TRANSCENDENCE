
<template>
  <div>
    <!-- Content for logged-in state -->
    <div v-if="isLoggedIn && userData && userData.user_data">
      <!--      <div v-if="userData && userData.user_data">-->
      <p :style="{ color: loginColor }">Login successful</p>
      <h2>Welcome, {{ userData.user_data.name }}!</h2>
      NAME &nbsp;: {{ userData.user_data.name }}<br>
      PAWO &nbsp;&nbsp;: {{ userData.user_data.password }}<br>
      AGE &nbsp;&nbsp;&nbsp;&nbsp;: {{ userData.user_data.age }}<br><br><br>

      <button @click="updateUserAge">Update Age</button>

            <!-- Display current user avatar -->
<!--      <img v-if="userData.user_data.avatar" :src="userData.user_data.avatar" alt="User Avatar" />-->

<!--      <label for="avatarInput">Update Avatar:</label>-->
<!--      &lt;!&ndash; Input for selecting a new avatar &ndash;&gt;-->
<!--      <input type="file" id="avatarInput" @change="handleAvatarChange" accept="image/*">-->

      <button @click="logout">Logout</button>

      <div v-if="showImageFlag">
        <button @click="flipImageFlag">hide Image</button><br><br><br>
      </div>
      <div v-else>
        <button @click="flipImageFlag">show Image</button><br><br><br>
      </div>
      <!-- Only shows image if showImageFlag is set to true -->
      <img v-if="showImageFlag" :src="imageUrl" alt="Uploaded Image" />
    </div>

      <!-- Content for logged-out state -->
      <div v-else>
        <div v-if="showPage === 'login'">
          <h1>Login Page</h1>
          <label for="username">Enter your name:</label><br>
          <input type="text" id="username" v-model="name" /><br><br>
          <label for="password">Enter your password:</label><br>
          <input type="text" id="password" v-model="password" /><br><br>
          <button @click="fetchUserData">Submit</button><br><br>
          <button @click="changeToRegisterPage">No Account yet?</button><br><br>
        </div>
        <div v-else>
          <h1>Register Page</h1>
          <label for="username">Enter your name:</label><br>
          <input type="text" id="username" v-model="new_name" /><br><br>
          <label for="age">Enter your Age:</label><br>
          <input type="text" id="age" v-model="new_age" />not using yet<br><br>
          <label for="password">Enter your password:</label><br>
          <input type="text" id="password" v-model="new_password" /><br><br>
          <button @click="createAccount">Submit</button><br><br>
          <button @click="changeToLoginPage">Have an Account?</button><br><br>
        </div>

      <!-- Display error message -->
      <div v-if="errorMessage" :style="{ color: errorColor }">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
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
        // Check if the name input is empty
        if (!this.name.trim())
        {
          this.errorMessage = 'Please enter ur username!';
          return;  // Do not proceed with the API request if the input is empty
        }
        // Check if the password input is empty
        if (!this.password.trim())
        {
          this.errorMessage = 'Please enter ur password!';
          return;  // Do not proceed with the API request if the input is empty
        }
        const response = await fetch(`http://127.0.0.1:6969/user/data/${this.name}/${this.password}/`);
        console.log('RESPONSE: ')
        console.log(response)
        const data = await response.json();

        if (response.ok)
        {
          this.errorMessage = null;
          this.isLoggedIn = true;
          this.userData = data;
        }
        else
        {
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


    async updateUserAge() {
      try
      {
        const myInit = {
          method: "POST",
          body: JSON.stringify({
            newAge: this.userData.user_data.age + 1,
          }),
        };

        // Make an API request to update the age
        const apiUrl = `http://localhost:6969/user/update-age/${this.userData.user_data.id}/`;
        const response = await fetch(apiUrl, myInit);

        if (response.ok)
        {
          console.log('Age updated successfully');
          // Fetch user data again to get the updated information
          this.fetchUserData();
        }
        else
        {
          console.error('Failed to update age:', response.statusText);
        }
      }
      catch (error)
      {
        console.error('Error updating age:', error);
      }
    },

    logout() {
      // Perform logout logic here
      this.isLoggedIn = false;
      // Additional logic like clearing tokens, redirecting, etc.
    },

    changeToRegisterPage() {
      this.showPage = 'register'
    },
    changeToLoginPage() {
      this.showPage = 'login'
    },


    async createAccount() {
      try
      {
        const apiUrl = `http://localhost:6969/user/createAccount/${this.new_name}/${this.new_password}/${this.new_age}/`;
        const response = await fetch(apiUrl);
        if (response.ok)
        {
          console.log('creating new account successfully');
          // Fetch user data again to get the updated information
          this.fetchUserData();
        }
        else
        {
          console.error('Failed to creating new account:', response.statusText);
        }
      }
      catch (error) {
        console.error('Error creating new account:', error);
      }
    }


  },
};
</script>

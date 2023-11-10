<!-- MyComponent.vue -->
<template>
<!--  <div>-->
<!--    <h1>Data from Backend</h1>-->

    <!-- User selection dropdown -->
<!--    <h1>Dropdown</h1>-->
<!--    <label for="userSelect">Select User:</label>-->
<!--    <select id="userSelect" v-model="selectedUser" @change="fetchUserData">-->
<!--      <option v-for="user in users" :key="user.id" :value="user.id">-->
<!--        {{ user.name }}-->
<!--      </option>-->
<!--    </select>-->
<!--    <ul>-->
<!--      <li v-for="item in userData" :key="item.id">-->
<!--        NAME &nbsp;: {{ item.name }}<br>-->
<!--        PAWO &nbsp;&nbsp;: {{ item.password }}<br>-->
<!--        AGE &nbsp;&nbsp;&nbsp;&nbsp;: {{ item.age }}<br>-->
<!--      </li>-->
<!--    </ul>-->
<!--  </div>-->


    <div>
      <h1>Find User</h1>
    <label for="username">Enter your name:</label>
    <input type="text" id="username" v-model="name" />
    <button @click="fetchUserData2">Get Data</button>

    <div v-if="!errorMessage">
      <div v-if="userData && userData.user_data">
        <h2>Welcome, {{ userData.user_data.name }}!</h2>
<!--        <p>User data: {{ userData.user_data.password }} </p>-->
<!--        <p>{{ userData.user_data.age }}</p>-->

        NAME &nbsp;: {{ userData.user_data.name }}<br>
        PAWO &nbsp;&nbsp;: {{ userData.user_data.password }}<br>
        AGE &nbsp;&nbsp;&nbsp;&nbsp;: {{ userData.user_data.age }}<br>
      </div>
      <div v-else>
        <p>No user data available.</p>
      </div>
    </div>

    <!-- Display error message -->
    <div v-else>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",  // Make sure to initialize the name property
      userData: null,
      errorMessage: null, // New variable to track error messages
    };
  },
  mounted() {

    this.fetchUserData2();
  },
  methods: {

    async fetchUserData2()
    {
      try
      {
        // Check if the name input is empty
        if (!this.name.trim())
        {
          console.error('Please enter a name before fetching user data.');
          this.errorMessage = 'Please enter ur username!';
          return;  // Do not proceed with the API request if the input is empty
        }

        // Make an API request to your Django backend
        const response = await fetch(`http://localhost:6969/user/data/${this.name}`);
        console.log('RESPONSE: ')
        console.log(response)
        const data = await response.json();

        // print(data)
        if (response.ok)
        {
          // Update the userData in the component with the received data
          console.log('RESPONSE OK: ', data)
          this.errorMessage = null;
          this.userData = data;
        }
        else
        {
          console.log('RESPONSE NOT OK')
          // console.error('Error fetching user data:', data.error);
          this.errorMessage = 'Username does not exist in DB';
        }
      }
      catch (error)
      {
        console.error('Error fetching user data:', error);
        this.errorMessage = 'Error fetching user data';
      }
    },
  },
};
</script>

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
    <button @click="fetchUserData2(name)">Get Data</button>

    <!-- Display user-specific data here -->
    <div v-if="userData[0]">
      <h2>Welcome, {{ userData[0].name }}!</h2>
      <ul>
        NAME &nbsp;: {{ userData[0].name }}<br>
        PAWO &nbsp;&nbsp;: {{ userData[0].password }}<br>
        AGE &nbsp;&nbsp;&nbsp;&nbsp;: {{ userData[0].age }}<br>
      </ul>
    </div>
  </div>


</template>

<script>
export default {
  data() {
    return {
      users: [],         // List of available users
      selectedUser: null, // Currently selected user ID
      userData: [],       // Data for the selected user
    };
  },
  mounted() {
    // Fetch the list of users
    // this.fetchUsers();
    // this.fetchUsers2();
    this.fetchUserData2();
  },
  methods: {
    // fetchUsers() {
    //   // Fetch the list of users from the backend API
    //   // Replace 'https://your-backend-api/users' with the actual endpoint
    //   fetch('http://localhost:6969/user')
    //     .then(response => response.json())
    //     .then(users => {
    //       this.users = users;
    //       // Set the default selected user (you can choose the first user, for example)
    //       this.selectedUser = users.length > 0 ? users[0].id : null;
    //       // Fetch data for the default selected user
    //       this.fetchUserData();
    //     })
    //     .catch(error => {
    //       console.error('Error fetching users:', error);
    //     });
    // },
    // fetchUserData() {
    //   if (this.selectedUser) {
    //     // Fetch data for the selected user
    //     fetch(`http://localhost:6969/user/data/${this.selectedUser}`)
    //       .then(response => response.json())
    //       .then(userData => {
    //         this.userData = userData;
    //       })
    //       .catch(error => {
    //         console.error('Error fetching user data:', error);
    //       });
    //   } else {
    //     // Clear data if no user is selected
    //     this.userData = [];
    //   }
    // },


    // fetchUsers2() {
    //   // Fetch the list of users from the backend API
    //   // Replace 'https://your-backend-api/users' with the actual endpoint
    //   fetch('http://localhost:6969/user')
    //     .then(response => response.json())
    //     .then(users => {
    //       this.users = users;
    //       // Set the default selected user (you can choose the first user, for example)
    //       this.selectedUser = 'lol';
    //
    //       // Fetch data for the default selected user
    //       this.fetchUserData2();
    //       console.log('SELECTED USER: ')
    //       console.log(this.selectedUser)
    //     })
    //     .catch(error => {
    //       console.error('Error fetching users:', error);
    //     });
    // },
    async fetchUserData2(name) {
      try {
        // Make an API request to your Django backend
        const response = await fetch(`http://localhost:6969/user/data/${name}`);
        console.log('RESPONSE: ')
        console.log(response)
        const data = await response.json();
        console.log('DATA: ')
        console.log(data)
        // print(data)

        if (response.ok) {
          // Update the userData in the component with the received data
          this.userData = data;
        }
        else
        {
          console.error('Error fetching user data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
  },
};
</script>

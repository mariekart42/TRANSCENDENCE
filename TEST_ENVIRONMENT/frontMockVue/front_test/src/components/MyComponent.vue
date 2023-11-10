<!-- MyComponent.vue -->
<template>
  <div>
    <h1>Data from Backend</h1>

    <!-- User selection dropdown -->
    <label for="userSelect">Select User:</label>
    <select id="userSelect" v-model="selectedUser" @change="fetchUserData">
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name }}
      </option>
    </select>

    <ul>
      <li v-for="item in userData" :key="item.id">
        NAME &nbsp;: {{ item.name }}<br>
        PAWO &nbsp;&nbsp;: {{ item.password }}<br>
        AGE &nbsp;&nbsp;&nbsp;&nbsp;: {{ item.age }}<br>
      </li>
    </ul>
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
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      // Fetch the list of users from the backend API
      // Replace 'https://your-backend-api/users' with the actual endpoint
      fetch('http://localhost:6969/user')
        .then(response => response.json())
        .then(users => {
          this.users = users;
          // Set the default selected user (you can choose the first user, for example)
          this.selectedUser = users.length > 0 ? users[0].id : null;
          // Fetch data for the default selected user
          this.fetchUserData();
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },
    fetchUserData() {
      if (this.selectedUser) {
        // Fetch data for the selected user
        // Replace 'https://your-backend-api/data?userId=' with the actual endpoint
        //http://localhost:6969/user/data/${this.selectedUser}
        fetch(`http://localhost:6969/user/data/${this.selectedUser}`)
          .then(response => response.json())
          .then(userData => {
            this.userData = userData;
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      } else {
        // Clear data if no user is selected
        this.userData = [];
      }
    },
  },
};
</script>

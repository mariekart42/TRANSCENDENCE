<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your App</title>
  <style>
    /* Add your styles here */
  </style>
</head>
<body>
  <div id="app"></div>

  <script>
    const app = {
      updateUserDataFlag: false,
      showChatFlag: false,
      showGameFlag: false,
      name: "",
      password: "",
      new_name: "",
      new_age: "",
      new_password: "",
      userData: null,
      errorMessage: null,
      isLoggedIn: false,
      showImageFlag: false,
      imageUrl: "images/moon_dog.jpg",
      showPage: 'login',

      checkAuthentication() {
        setTimeout(() => {
          const isAuthenticated = true;
          this.isLoggedIn = isAuthenticated;

          if (isAuthenticated) {
            this.fetchUserData();
          }
        }, 1000);
      },

      async fetchUserData() {
        try {
          if (!this.name.trim() || !this.password.trim()) {
            this.errorMessage = 'Please enter your username and password!';
            return;
          }

          const response = await fetch(`http://127.0.0.1:6969/user/data/${this.name}/${this.password}/`);
          const data = await response.json();

          if (response.ok) {
            this.errorMessage = null;
            this.isLoggedIn = true;
            this.userData = data;
          } else {
            this.errorMessage = data.error;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          this.errorMessage = 'Error fetching user data';
        }
      },

      flipImageFlag() {
        this.showImageFlag = !this.showImageFlag;
      },

      logout() {
        this.isLoggedIn = false;
        this.name = "";
        this.password = "";
      },

      changeToRegisterPage() {
        this.showPage = 'register';
        this.name = "";
        this.password = "";
      },

      changeToLoginPage() {
        this.showPage = 'login';
        this.new_name = "";
        this.new_password = "";
        this.new_age = "";
      },

      async createAccount() {
        try {
          const apiUrl = `http://localhost:6969/user/createAccount/${this.new_name}/${this.new_password}/${this.new_age}/`;
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (response.ok) {
            this.isLoggedIn = true;
            this.name = this.new_name;
            this.age = this.new_age;
            this.password = this.new_password;
            this.new_name = "";
            this.new_password = "";
            this.new_age = "";
            this.fetchUserData();
          } else {
            console.error('Failed to create a new account:', response.statusText);
            this.errorMessage = data.error;
          }
        } catch (error) {
          console.error('Error creating a new account:', error);
          this.errorMessage = "Error creating a new account";
        }
      },
    };

    function renderApp() {
      const appContainer = document.getElementById('app');
      appContainer.innerHTML = `
        <!-- Your HTML template here -->
      `;
    }

    document.addEventListener('DOMContentLoaded', () => {
      app.checkAuthentication();
      renderApp();
    });
  </script>
</body>
</html>

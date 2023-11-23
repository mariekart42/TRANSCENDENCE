let obj = {
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
}



document.getElementById('loginUserButton').addEventListener('click', function () {
  const username = document.getElementById('loginUsernameID').value;
  const password = document.getElementById('loginPasswordID').value;

  const url = `http://127.0.0.1:6969/user/check_user_credentials/${username}/${password}/`
  fetch(url)
    .then(response => {
        if (!response.ok) {
            console.log('LOGIN NOT OK RESPONSE:', response);
            alert('Credentials are wrong');
        }
        return response.json();
    })
    .then(data =>
    {
      console.log('LOGIN OK RESPONSE:', data);
      const notAuth = document.getElementById('userIsNotAuth');
      const isAuth = document.getElementById('userIsAuth');
      notAuth.classList.add('hidden');
      isAuth.classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error during login:', error);
  });
});








// // document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('loginUserButton').addEventListener('submit', function (event) {
// console.log('IN DOCU')
//         // Get the value from the input field
//         const name = document.getElementById('loginUsernameID').value;
//         const password = document.getElementById('loginPasswordID').value;
//
//         const loginUserButton = document.getElementById('loginUserButton');
//         loginUserButton.addEventListener('click', loginUser);
//
//         // loginUser(name, password)
//     // });
// });

//
//
// // Wait for the DOM to be ready
// document.addEventListener('DOMContentLoaded', function () {
//     // Get references to login and register sections
//     const loginPage = document.getElementById('loginPage');
//     const registerPage = document.getElementById('registerPage');
//
//     // Get references to buttons
//     const loginButton = document.getElementById('loginButton');
//     const registerButton = document.getElementById('registerButton');
//
//
//     const loginUserButton = document.getElementById('loginUserButton');
//     const registerUserButton = document.getElementById('registerUserButton');
//
//     // Get reference of userIsAuth or userIsNotAuth
//     const userIsNotAuthPage = document.getElementById('userIsNotAuth');
//     const userIsAuthPage = document.getElementById('userIsAuth');
//
//     // Function to show login page and hide register page
//     function showLoginPage() {
//         loginPage.classList.remove('hidden');
//         registerPage.classList.add('hidden');
//     }
//     // Function to show register page and hide login page
//     function showRegisterPage() {
//         loginPage.classList.add('hidden');
//         registerPage.classList.remove('hidden');
//     }
//     function authUser(){
//         userIsNotAuthPage.classList.add('hidden');
//         userIsAuthPage.classList.remove('hidden');
//     }
//     // Add click event listeners to buttons
//     loginButton.addEventListener('click', showLoginPage);
//     registerButton.addEventListener('click', showRegisterPage);
//     // loginUserButton.addEventListener('click', loginUser);
//     // registerUserButton.addEventListener('click', registerUser);
//
// });
//
//

async function loginUser(name, password) {
  try
  {
    if (!name.trim())
    {
      this.errorMessage = 'Please enter ur username!';
      return;  // Do not proceed with the API request if the input is empty
    }
    if (!password.trim())
    {
      this.errorMessage = 'Please enter ur password!';
      return;
    }
    const response = await fetch(`http://127.0.0.1:6969/user/data/get/${name}/${password}/`);
    const data = await response.json();
    if (response.ok)
    {
      console.log('RESPONSE OK')
      this.errorMessage = null;
      this.isLoggedIn = true;
      this.userData = data;
    }
    else
    {
      console.log('RESPONSE NOT OK')
      this.errorMessage = data.error;
    }
  }
  catch (error)
  {
    console.log('RESPONSE NOT OK')
    console.error('Error fetching user data:', error);
    this.errorMessage = 'Error fetching user data';
  }
}
// // function loginUser() {
// //
// // }
//

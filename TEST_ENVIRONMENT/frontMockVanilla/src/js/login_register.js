// let obj = {
//     name: "",  // Make sure to initialize the name property
//     password: "",
// }

function addEventListenersNotAuth() {
//   // Your script here
  document.getElementById('loginUserButton').addEventListener('click', function () {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const url = `http://127.0.0.1:6969/user/check_user_credentials/${username}/${password}/`
    fetch(url)
      .then(response => {
        if (!response.ok) {
          alert('Credentials are wrong');
          throw new Error('Credentials are wrong');
        }
        return response.json();
      })
      .then(data => {
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


  // Event listener for changing to the login page
  document.getElementById('changeToLoginPageButton').addEventListener('click', function () {
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');

    // Function to show the login page
    function showLoginPage() {
      loginPage.classList.remove('hidden');
      registerPage.classList.add('hidden');
    }

    // Attach the showLoginPage function to the button click event
    document.getElementById('changeToLoginPageButton').addEventListener('click', showLoginPage);
  });
}

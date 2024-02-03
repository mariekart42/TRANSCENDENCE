
function addEventListenersNotAuth() {

  function initUserData(data, username, password, age) {
    showDiv('userIsAuth')
    hideDiv('userIsNotAuth')
    websocket_obj.username = username
    websocket_obj.password = password
    websocket_obj.age = age
    console.log('INIT USER DATA: USER_ID: ', data.user_id)
    websocket_obj.user_id = data.user_id
  }


  // BUTTON TO LOGIN
  document.getElementById('loginUserButton').addEventListener('click', function () {
    const usernameElement = document.getElementById('loginUsername')
    const passwordElement = document.getElementById('loginPassword')
    usernameElement.style.border = ""
    passwordElement.style.border = ""

    const url = `http://127.0.0.1:6969/user/check_user_credentials/${usernameElement.value}/${passwordElement.value}/`
    fetch(url)
      .then(response => {
        if (!response.ok) {
          switch (response.status) {
            case 404:
              document.getElementById("loginUsername").style.border = "1px solid red";
              throw new Error('This User does not exist!');
            case 401:
              document.getElementById("loginPassword").style.border = "1px solid red";
              throw new Error('Credentials are wrong!');
            default:
              throw new Error('Unexpected Error: Failed to check Credentials')
          }
        }
        return response.json();
      })
      .then(data => {
        initUserData(data, usernameElement.value, passwordElement.value, 69)
        showDiv('showUserProfile')
        establishWebsocketConnection()
      })
      .catch(error => {
        setErrorWithTimout('info_login', error, 9999999)
        console.log('Error during login:', error);
      });
  });


  // BUTTON TO REGISTER
  document.getElementById('RegisterUserButton').addEventListener('click', function () {
    const usernameElement = document.getElementById('registerUsername')
    const passwordElement = document.getElementById('registerPassword')
    usernameElement.style.border = ""
    passwordElement.style.border = ""

    const age = document.getElementById('registerAge').value;

    const url = `http://127.0.0.1:6969/user/account/create/${usernameElement.value}/${passwordElement.value}/${age}/`
    fetch(url)
      .then(response => {
        if (!response.ok) {
          switch (response.status) {
            case 409:
              document.getElementById("registerUsername").style.border = "1px solid red";
              throw new Error('This Username already exist')
            default:
              throw new Error('Unexpected Error: Failed to create new Account')
          }
        }
        return response.json();
      })
      .then(data => {
        initUserData(data, usernameElement.value, passwordElement.value, age)
        showDiv('showUserProfile')
        establishWebsocketConnection()
      })
      .catch(error => {
        setErrorWithTimout('info_register', error, 9999999)
        console.log('Error during login:', error);
      });
  });


  // BUTTON TO CHANGE TO LOGIN PAGE
  document.getElementById('changeToLoginPageButton').addEventListener('click', function () {
    showDiv('loginPage')
    hideDiv('registerPage')
    document.getElementById('registerUsername').value = null;
    document.getElementById('registerAge').value  = null;
    document.getElementById('registerPassword').value  = null;
    document.getElementById("registerUsername").style.border = "";
    document.getElementById("registerPassword").style.border = "";
    const info_register = document.getElementById('info_register')
    info_register.style.display = 'none';
  });

  // BUTTON TO CHANGE TO REGISTER PAGE
  document.getElementById('changeToRegisterPageButton').addEventListener('click', function () {
    hideDiv('loginPage')
    showDiv('registerPage')
    document.getElementById('loginUsername').value = null;
    document.getElementById('loginPassword').value  = null;
    document.getElementById("loginUsername").style.border = "";
    document.getElementById("loginPassword").style.border = "";
    const info_login = document.getElementById('info_login')
    info_login.style.display = 'none';
  });
}

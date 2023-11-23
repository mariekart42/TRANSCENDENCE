// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Get references to login and register sections
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');

    // Get references to buttons
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const authUserButton = document.getElementById('authUserButton');
    const authUserButton2 = document.getElementById('authUserButton2');


    // Get reference of userIsAuth or userIsNotAuth
    const userIsNotAuthPage = document.getElementById('userIsNotAuth');
    const userIsAuthPage = document.getElementById('userIsAuth');


    // Function to show login page and hide register page
    function showLoginPage() {
        loginPage.classList.remove('hidden');
        registerPage.classList.add('hidden');
    }

    // Function to show register page and hide login page
    function showRegisterPage() {
        loginPage.classList.add('hidden');
        registerPage.classList.remove('hidden');
    }


    function authUser(){
        userIsNotAuthPage.classList.add('hidden');
        userIsAuthPage.classList.remove('hidden');
    }






    // Add click event listeners to buttons
    loginButton.addEventListener('click', showLoginPage);
    registerButton.addEventListener('click', showRegisterPage);
    authUserButton.addEventListener('click', authUser);
    authUserButton2.addEventListener('click', authUser);

});



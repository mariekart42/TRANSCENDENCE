let tmp = {
    username: "",  // Make sure to initialize the name property
}

document.addEventListener('DOMContentLoaded', function () {
    
    const username = "kris";
    document.getElementById('createGameButton').addEventListener('click', createGame);

    function createGame() {

        console.log('In createGame:');

        var theButton = document.getElementById('createGameButton');
        theButton.style.display = 'none';
        registrationPage.style.display = 'block';
    
    try {
        const response = await fetch(`http://127.0.0.1:6969/user/create_game/${username}/`);
        const data = await response.json();

        if (response.ok) {
        displayError(null);
        // Perform actions on successful login, e.g., set isLoggedIn and userData
            console.log(data);
        } else {
        displayError(data.error);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        displayError('Error fetching user data');
    }
}

});
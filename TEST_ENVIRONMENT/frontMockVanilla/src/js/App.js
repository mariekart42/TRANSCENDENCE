console.log('LOL JAVASCRIPT')


let pop = {name: 'no', password: '0000'}

function lol() {
    pop.name = 'test'
}
function fetchUserData() {
    lol()
    // Your backend server URL
    const backendURL = `http://localhost:6969/user/data/get/${pop.name}/${pop.password}/`; // Replace with your actual backend URL and port

    // Make a fetch request to your backend
    fetch(backendURL)
        .then(response => {
            if (!response.ok)
            {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            console.log('RESPONSE OK')
            alert('lol')
            return response.json();
        })
        .then(data => {
            // Handle the data from the backend
            console.log('Data from the backend:', data);
        })
        .catch(error => {
            // Handle errors
            console.error('Fetch error:', error);
        });
}
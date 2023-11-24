        // // Function to load HTML content into a div
        //
        // function loadHTMLIntoDiv(url, targetId) {
        //     fetch(url)
        //         .then(response => response.text())
        //         .then(html => {
        //             document.getElementById(targetId).innerHTML = html;
        //         })
        //         .catch(error => console.error('Error loading HTML:', error));
        // }
        //
        // // Call the function with the URL of the HTML file and the ID of the target div
        // loadHTMLIntoDiv('html/userIsNotAuth.html', 'userIsNotAuth');
        //
        //



document.addEventListener('DOMContentLoaded', function () {
    // Function to load HTML content from file and inject it into a target element
    function loadContent(file, targetId) {
        fetch(file)
            .then(response => response.text())
            .then(html => {
                document.getElementById(targetId).innerHTML = html;

                // If you need to add JavaScript functionality, do it here.
                // For example, add event listeners after the content is loaded.
                addEventListeners();
            })
            .catch(error => console.error('Error loading content:', error));
    }

    // Example: Load content into 'userIsNotAuth' div
    loadContent('html/userIsNotAuth.html', 'userIsNotAuth');

    // Example: Load content into 'userIsAuth' div
    // loadContent('html/userIsNotAuth.html', 'userIsAuth');
});

function addEventListeners() {
    // Add your event listeners or other JavaScript functionality here.
}
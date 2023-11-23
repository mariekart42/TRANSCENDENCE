document.addEventListener('DOMContentLoaded', function () {
    // Get references to the checkbox and content divs
    const toggleCheckbox = document.getElementById('toggleCheckbox');
    const content1 = document.getElementById('content1');
    const content2 = document.getElementById('content2');

    // Add an event listener to the checkbox
    toggleCheckbox.addEventListener('change', function ()
    {
        // Check the state of the checkbox
        if (toggleCheckbox.checked)
        {
            // If checked, show content1 and hide content2
            content1.classList.remove('hidden');
            content2.classList.add('hidden');
        }
        else
        {
            // If not checked, show content2 and hide content1
            content1.classList.add('hidden');
            content2.classList.remove('hidden');
        }
    });
});
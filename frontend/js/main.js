// Declare a global variable for the base URL
const baseUrl = "http://localhost/itqan/task2/backend/php/";





// Select all elements with the class "input"
const inputs = document.querySelectorAll(".input");

// Add the "focus" class to the parent element
function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

// Remove the "focus" class from the parent element when the input is not in focus and has no value
function remcl() {
    let parent = this.parentNode.parentNode;
    // Check if the input value is empty
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}

// Loop through each input element
inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

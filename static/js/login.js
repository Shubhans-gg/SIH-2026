const roleButtons = document.querySelectorAll(".role-btn");
const modeButtons = document.querySelectorAll(".mode-btn");

const formContainer = document.querySelector(".form-container");
const instruction = document.querySelector(".instruction");

const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

const userFields = document.querySelectorAll(".user-field");
const adminFields = document.querySelectorAll(".admin-field");


// -------------------------
// CURRENT STATE
// -------------------------

let selectedRole = null;
let selectedMode = "login";


// -------------------------
// USER / ADMIN SELECTION
// -------------------------

roleButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedRole = button.dataset.role;

        // Remove selected from both buttons
        roleButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        // Highlight clicked button
        button.classList.add("selected");

        // Enable form
        formContainer.classList.add("enabled");

        // Remove instruction
        instruction.style.display = "none";

        updateForm();
    });

});


// -------------------------
// LOGIN / SIGN UP SELECTION
// -------------------------

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedMode = button.dataset.mode;

        // Remove active from both
        modeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Highlight clicked button
        button.classList.add("active");

        updateForm();
    });

});


function updateForm() {

    // USER / ADMIN FIELDS

    if (selectedRole === "user") {

        userFields.forEach(field => {
            field.style.display = "block";
        });

        adminFields.forEach(field => {
            field.style.display = "none";
        });

    }

    if (selectedRole === "admin") {

        userFields.forEach(field => {
            field.style.display = "none";
        });

        adminFields.forEach(field => {
            field.style.display = "block";
        });

    }


    // LOGIN / SIGN UP FORM

    if (selectedMode === "login") {

        loginForm.style.display = "flex";
        signupForm.style.display = "none";

    }

    if (selectedMode === "signup") {

        loginForm.style.display = "none";
        signupForm.style.display = "flex";

    }

}

//FORM VALIDATION

signupForm.addEventListener("submit", function (event) {

    const password = document.querySelector("#signup-password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;


    // Check whether passwords match

    if (password !== confirmPassword) {

        event.preventDefault();

        alert("Passwords do not match.");

    }

});
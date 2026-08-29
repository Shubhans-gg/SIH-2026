// ELEMENTS

const roleButtons = document.querySelectorAll(".role-btn");
const modeButtons = document.querySelectorAll(".mode-btn");

const formContainer = document.querySelector(".form-container");
const instruction = document.querySelector(".instruction");

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const userFields = document.querySelectorAll(".user-field");
const adminFields = document.querySelectorAll(".admin-field");

const otpField = document.querySelector(".otp-field");


// STATE

let selectedRole = null;
let selectedMode = "login";


// ROLE SELECTION

roleButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedRole = button.dataset.role;


        // Remove selected class
        roleButtons.forEach(btn => {
            btn.classList.remove("selected");
        });


        // Add selected class
        button.classList.add("selected");


        // Enable form
        formContainer.classList.add("enabled");

        instruction.style.display = "none";


        updateForm();

    });

});


// LOGIN / SIGNUP SELECTION

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedMode = button.dataset.mode;


        // Change active tab
        modeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        updateForm();

    });

});

// UPDATE FORM

function updateForm() {

    // ROLE

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


    // LOGIN / SIGNUP

    if (selectedMode === "login") {

        loginForm.style.display = "flex";
        signupForm.style.display = "none";

    }


    if (selectedMode === "signup") {

        loginForm.style.display = "none";
        signupForm.style.display = "flex";

    }

}


// HELPER FUNCTIONS

function showError(input, message) {

    input.classList.add("input-error");
    input.classList.remove("input-success");

    const error = input.parentElement.querySelector(".error-message");

    if (error) {
        error.textContent = message;
    }

}


function clearError(input) {

    input.classList.remove("input-error");

    const error = input.parentElement.querySelector(".error-message");

    if (error) {
        error.textContent = "";
    }

}


// AADHAAR VALIDATION

function validateAadhar(input) {

    const value = input.value.trim();

    if (!/^\d{12}$/.test(value)) {

        showError(
            input,
            "Aadhaar number must contain exactly 12 digits."
        );

        return false;
    }

    clearError(input);

    return true;
}
 
// MOBILE VALIDATION

function validateMobile(input) {

    const value = input.value.trim();

    if (!/^[6-9]\d{9}$/.test(value)) {

        showError(
            input,
            "Enter a valid 10-digit mobile number."
        );

        return false;
    }

    clearError(input);

    return true;
}

// PASSWORD VALIDATION

function validatePassword(input) {

    const password = input.value;

    /*
        Minimum 8 characters
        At least one uppercase
        At least one lowercase
        At least one number
    */

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


    if (!passwordPattern.test(password)) {

        showError(
            input,
            "Password must be at least 8 characters and contain uppercase, lowercase and a number."
        );

        return false;
    }

    clearError(input);

    return true;
}

// CONFIRM PASSWORD

function validateConfirmPassword(password, confirmPassword) {

    if (password.value !== confirmPassword.value) {

        showError(
            confirmPassword,
            "Passwords do not match."
        );

        return false;
    }

    clearError(confirmPassword);

    return true;
}

// OTP VALIDATION

function validateOTP(input) {

    const value = input.value.trim();

    if (!/^\d{6}$/.test(value)) {

        showError(
            input,
            "OTP must contain exactly 6 digits."
        );

        return false;
    }

    clearError(input);

    return true;
}

// LOGIN FORM

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    if (!selectedRole) {

        alert("Please select User or Administration first.");

        return;
    }


    const password =
        document.querySelector("#login-password");


    let valid = true;


    // User login
    if (selectedRole === "user") {

        const aadhar =
            document.querySelector("#login-aadhar");

        valid = validateAadhar(aadhar) && valid;

    }


    // Admin login
    if (selectedRole === "admin") {

        const username =
            document.querySelector("#login-username");

        if (username.value.trim() === "") {

            showError(username, "Username is required.");

            valid = false;

        } else {

            clearError(username);
        }

    }


    // Password
    if (password.value.trim() === "") {

        showError(password, "Password is required.");

        valid = false;

    } else {

        clearError(password);
    }


    if (!valid) {
        return;
    }

    // SEND LOGIN DATA

    let data;
    let endpoint;


    if (selectedRole === "user") {

        data = {
            aadhar: document.querySelector("#login-aadhar").value.trim(),
            password: password.value
        };

        endpoint = "/api/login/user";

    } else {

        data = {
            username: document.querySelector("#login-username").value.trim(),
            password: password.value
        };

        endpoint = "/api/login/admin";

    }


    try {

        const response = await fetch(endpoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Login failed."
            );

        }


        alert(result.message || "Login successful.");

        // Backend can return a redirect URL
        if (result.redirect) {
            window.location.href = result.redirect;
        }


    } catch (error) {

        const status =
            loginForm.querySelector(".form-status");

        status.textContent = error.message;
        status.className = "form-status error";

    }

});

// MOBILE NUMBER → OTP FIELD

const mobileInput =
    document.querySelector("#signup-mobile");


mobileInput.addEventListener("input", async function () {

    // Only relevant for User signup
    if (
        selectedRole !== "user" ||
        selectedMode !== "signup"
    ) {
        return;
    }


    const mobile = mobileInput.value.trim();


    // Don't do anything until 10 digits
    if (!/^[6-9]\d{9}$/.test(mobile)) {

        otpField.classList.remove("visible");

        return;
    }


    // Show OTP field
    otpField.classList.add("visible");


    try {

        const response = await fetch("/api/send-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mobile: mobile
            })

        });


        const result = await response.json();


        const otpStatus =
            otpField.querySelector(".otp-status");


        if (!response.ok) {

            otpStatus.textContent =
                result.message || "Could not send OTP.";

            otpStatus.style.color = "#d93025";

            return;
        }


        otpStatus.textContent =
            "OTP sent to your mobile number.";

        otpStatus.style.color = "#198754";


    } catch (error) {

        const otpStatus =
            otpField.querySelector(".otp-status");

        otpStatus.textContent =
            "Unable to send OTP.";

        otpStatus.style.color = "#d93025";

    }

});


// SIGNUP FORM

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    if (!selectedRole) {

        alert("Please select User or Administration first.");

        return;
    }


    let valid = true;


    const password =
        document.querySelector("#signup-password");

    const confirmPassword =
        document.querySelector("#confirm-password");

    // USER SIGNUP

    if (selectedRole === "user") {

        const aadhar =
            document.querySelector("#signup-aadhar");

        const name =
            document.querySelector("#signup-name");

        const mobile =
            document.querySelector("#signup-mobile");

        const otp =
            document.querySelector("#signup-otp");


        // Aadhaar
        valid = validateAadhar(aadhar) && valid;


        // Name
        if (name.value.trim().length < 2) {

            showError(
                name,
                "Please enter your full name."
            );

            valid = false;

        } else {

            clearError(name);
        }


        // Mobile
        valid = validateMobile(mobile) && valid;


        // OTP
        valid = validateOTP(otp) && valid;

    }


    // ADMIN SIGNUP

    if (selectedRole === "admin") {

        const username =
            document.querySelector("#signup-username");


        if (username.value.trim().length < 3) {

            showError(
                username,
                "Username must contain at least 3 characters."
            );

            valid = false;

        } else {

            clearError(username);
        }

    }


    // PASSWORD

    valid = validatePassword(password) && valid;

    // CONFIRM PASSWORD

    valid =
        validateConfirmPassword(
            password,
            confirmPassword
        ) && valid;


    if (!valid) {
        return;
    }

    // PREPARE DATA

    let data;
    let endpoint;


    if (selectedRole === "user") {

        data = {

            aadhar:
                document.querySelector("#signup-aadhar").value.trim(),

            name:
                document.querySelector("#signup-name").value.trim(),

            mobile:
                document.querySelector("#signup-mobile").value.trim(),

            otp:
                document.querySelector("#signup-otp").value.trim(),

            password:
                password.value

        };

        endpoint = "/api/signup/user";

    }


    if (selectedRole === "admin") {

        data = {

            username:
                document.querySelector("#signup-username").value.trim(),

            password:
                password.value

        };

        endpoint = "/api/signup/admin";

    }

    // SEND DATA TO BACKEND

    try {

        const submitButton =
            signupForm.querySelector(".submit-btn");

        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";


        const response = await fetch(endpoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Signup failed."
            );

        }


        const status =
            signupForm.querySelector(".form-status");


        status.textContent =
            result.message || "Account created successfully.";

        status.className = "form-status success";


        signupForm.reset();

        otpField.classList.remove("visible");


    } catch (error) {

        const status =
            signupForm.querySelector(".form-status");

        status.textContent = error.message;
        status.className = "form-status error";


    } finally {

        const submitButton =
            signupForm.querySelector(".submit-btn");

        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";

    }

}); 
car_rental.v.authenticateUser = {
    /**
     * set user authentication status
     */
    setupUiByUserStatus: function() {
        const pageLocation = window.location.pathname;

        auth.onAuthStateChanged(function(user) {
            if (user) {
                // if anonymous or registered user
                if (user.isAnonymous) {
                    // if user is anonymous
                    if (pageLocation === "/index.html" || pageLocation === "/") {
                        // show instructions to login
                        document.getElementById("auth-invitation").style.display = "block";
                    } else if (
                        pageLocation === "/manageCars.html" ||
                        pageLocation === "/manageCustomers.html" ||
                        pageLocation === "/manageRentalAgreement.html" ||
                        pageLocation === "/manageInvoices.html"
                    ) {
                        // redirect to login if anonymous
                        window.location.pathname = "/authenticate.html";
                    }
                    console.log("Navigating as anonymous");
                } else {
                    // if user is registered
                    if (pageLocation === "/index.html" || pageLocation === "/") {
                        const menuItems = [
                            "opt-cars",
                            "opt-cust",
                            "opt-rent",
                            "opt-invoice",
                            "navi",
                        ];
                        menuItems.forEach(rebuildMenu);
                        // build link menu options
                        function rebuildMenu(item) {
                            let menuItemEl = document.getElementById(item); // get menu item
                            menuItemEl.style.opacity = "1";
                            //menuItemEl.removeChild(menuItemEl.firstElementChild); // remove 'span' element
                            menuItemEl.style.display = "inline"; // show 'a' element

                            menuItemEl.firstElementChild.disabled = false;
                            menuItemEl.firstElementChild.style.opacity = "1";
                        }
                        // enable button menu options
                        let menuClearEl = document.getElementById("tool-clear"); // get menu item
                        menuClearEl.firstElementChild.style.opacity = "1";

                        menuClearEl.firstElementChild.disabled = false; // enable button
                        let menuGenerateEl = document.getElementById("tool-generate"); // get menu item
                        menuGenerateEl.firstElementChild.style.opacity = "1";
                        menuGenerateEl.firstElementChild.disabled = false; // enable button
                        document.getElementById("toLogInOrSignUp").style.display = "none";
                        document.getElementById("toSignOut").style.display = "inline";
                        document.getElementById("before").style.display = "none";
                        document.getElementById("after").style.display = "inline";
                    } else if (
                        pageLocation === "/manageCars.html" ||
                        pageLocation === "/manageCustomers.html" ||
                        pageLocation === "/manageRentalAgreement.html" ||
                        pageLocation === "/manageInvoices.html"
                    ) {
                        if (!user.emailVerified) {
                            alert(
                                "Check your email " +
                                user.email +
                                " for instructions to verify this account before using this CRUD operation"
                            );
                            window.location.pathname = "/index.html";
                        }
                    }
                    console.log(
                        "Navigating as: " +
                        user.email +
                        " (verified Account? " +
                        user.emailVerified +
                        ")"
                    );
                }
            } else {
                // if null: not registered nor anonymous user
                // authenticate user as anonymous
                auth.signInAnonymously();
            }
        });
    },
    /**
     * initialize login/sign up form
     */
    setupLoginAndSignup: function() {
        const formEl = document.forms["User"],
            btnLogin = formEl.logIn,
            btnSignUp = formEl.signUp;


        // manage sign up event
        btnSignUp.addEventListener(
            "click",
            car_rental.v.authenticateUser.handleSignUpButtonClickEvent
        );
        // manage log in event
        btnLogin.addEventListener(
            "click",
            car_rental.v.authenticateUser.handleLoginButtonClickEvent
        );

        // neutralize the submit event
        formEl.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    },
    /**
     * sign up
     */
    handleSignUpButtonClickEvent: async function() {
        const formEl = document.forms["User"],
            email = formEl.email.value,
            password = formEl.password.value;

        try {
            // upgrade user from anonymous to registered
            //const newUserCredential = firebase.auth.EmailAuthProvider.credential(email, password);
            //await auth.currentUser.linkWithCredential(newUserCredential); // link credentials to anonymous
            //send verification email
            //const upgradedUser = auth.currentUser;
            const upgradedUser = await auth
                .createUserWithEmailAndPassword(email, password)
                .then((userData) => {
                    userData.user.sendEmailVerification();
                    console.log(userData);
                });

            console.log("User " + email + " became registered");
            alert(
                "Created account " +
                email +
                ".\n\nCheck your email for instructions to verify this account."
            );
            window.location.pathname = "/index.html";
        } catch (e) {
            console.error(`${e.message}`);
        }
    },
    /**
     * log in
     */
    handleLoginButtonClickEvent: async function() {
        const formEl = document.forms["User"],
            email = formEl.email.value,
            password = formEl.password.value;
        try {
            const login = await auth.signInWithEmailAndPassword(email, password);
            if (login.user.emailVerified) {
                console.log("Granted access to user " + email);
                window.location.pathname = "/index.html";
            } else {
                alert(
                    "Your email has not been verified\n\nCheck your email " +
                    email +
                    " and follow the instructions."
                );
            }
        } catch (e) {
            console.error(`${e.message}`);
        }
    },

    handleSignOutButtonClickEvent: async function() {
        try {
            console.log("Loging out");
            firebase.auth().signOut();
            alert("You signed out successfully");
            window.location.pathname = "/index.html";
        } catch (e) {
            console.error(`${e.message}`);
        }

    },
    /**
     * verify email
     */
    handleVerifyEmail: async function() {
        alert("HandleVerification");
        // get verification code from URL
        const urlParams = new URLSearchParams(location.search);
        const verificationCode = urlParams.get("oobCode");
        // initialize link element
        let a = document.getElementById("continue-link");
        try {
            // if email can be verified
            // apply the email verification code
            await auth.applyActionCode(verificationCode);
            // if success, handle HTML elements: message, continue instructions and continue link
            document.getElementById("verification-message").innerHTML =
                "Your email has been verified.";
            document.getElementById("continue-instruction").innerHTML =
                "You can now use all operations on the Car-Rental App.";
            let link = document.createTextNode("« Go to Car-Rental App");
            a.appendChild(link);
            a.href = "index.html";
        } catch (e) {
            // if email has been already verified
            // if error, handle HTML elements: message, continue instructions and continue link
            document.getElementById("verification-message").innerHTML =
                "Your validation link has already been used.";
            document.getElementById("continue-instruction").innerHTML =
                "You can now Log In on the Car-Rental App.";
            let link = document.createTextNode("« Go to the Log In page");
            a.appendChild(link);
            a.href = "authenticate.html";
            console.error(`${e.message}`);
        }
    },
};
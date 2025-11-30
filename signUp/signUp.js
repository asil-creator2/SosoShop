let users = JSON.parse(localStorage.getItem('users')) || [];

// Get elements
const nameS = document.getElementById('name');
const emailS = document.getElementById('emailS');
const passwordS = document.getElementById('password');
const btnS = document.getElementById('create-btn');

btnS.addEventListener('click', () => {

    if (!emailS.value || !passwordS.value || !nameS.value) {
        Swal.fire("Please fill all fields!");
        return;
    }

    const userExists = users.some(u => u.email === emailS.value);

    if (userExists) {
        Swal.fire('Email Already Exists')        
        return;
    }

    let user = {
        name: nameS.value,
        email: emailS.value,
        password: passwordS.value
    };

    users.push(user);

    // ⭐ FIXED: store the real user
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("users", JSON.stringify(users));

    window.location.href = "../index.html";
});



function signUpCallBack(response) {

    const decoded = jwt_decode(response.credential);

    const exists = users.find(u => u.email === decoded.email);

    if (!exists) {

        let newUser = {
            name: decoded.name,
            email: decoded.email,
            password: null
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        // ⭐ FIXED: store new user
        localStorage.setItem("currentUser", JSON.stringify(newUser));

    } else {

        // ⭐ FIXED: Login with existing google user
        localStorage.setItem("currentUser", JSON.stringify(exists));

    }

    window.location.href = "../index.html";
}

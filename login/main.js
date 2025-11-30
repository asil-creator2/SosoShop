let users = JSON.parse(localStorage.getItem('users')) || [];

let logIn = document.getElementById('btn');
let email = document.getElementById('email');
let password = document.getElementById('password');

logIn.addEventListener('click', () => {

    if (email.value === '' || password.value === '') {
        Swal.fire('Please fill all fields');
        return;
    }

    let userExists = users.find(u => u.email === email.value);

    // Google account
    if (userExists && userExists.password === null) {
        Swal.fire("This email is registered with Google. Please use Google Sign-In.");
        return;
    }

    // Normal account
    if (userExists && userExists.password === password.value) {
        localStorage.setItem("currentUser", JSON.stringify(userExists))
        window.location.href = '../index.html';
        return;
    }

    Swal.fire("Email or Password incorrect. Please try again.");
});


// GOOGLE LOGIN
function loginCallBack(response){
    const decoded = jwt_decode(response.credential);

    let exists = users.find(u => u.email === decoded.email);

    let user;

    if (!exists) {
        // إنشاء مستخدم جديد
        user = {
            name : decoded.name,
            email : decoded.email,
            password : null
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        user = exists;
    }

    // حفظ المستخدم الحالي
    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = '../index.html';
}

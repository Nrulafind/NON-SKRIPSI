const apiUrl = 'http://localhost:8090/api';

document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');
    // const resultDiv = document.getElementById('result');

    // Event listener untuk registrasi
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const userData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            console.log(data);
            window.alert(`${data.Message}`);
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error:', error);
        }
    });

});

document.addEventListener('DOMContentLoaded', () => {
    // const apiUrl = 'http://localhost:8090/api';
    const loginForm = document.getElementById('loginForm');
    //const resultDiv = document.getElementById('result');

    // Event listener untuk login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const userData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            //console.log(data);
            console.log(data);
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('logged_in', true);
            window.alert(`${data.Message}`);
            window.location.href = 'student.html';
            //resultDiv.innerHTML = `< p > ${ data.Message }</ > `;

        } catch (error) {
            console.error('Error:', error);
        }
    });

});

function logout() {
    localStorage.removeItem('logged_in');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'login.html';
}
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

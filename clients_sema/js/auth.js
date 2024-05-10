
const apiUrl = 'http://localhost:8090/api';


// Function to get the access token from local storage
function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getLoginStatus() {
    return localStorage.getItem('logged_in');
}

function cekLoginStatus() {
    var token = getAccessToken();
    var stat = getLoginStatus();

    if (!token && !stat) {
        console.error('JWT token is missing');
        window.location.href = 'login.html';
    }
}


function logout() {
    localStorage.removeItem('logged_in');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'login.html';
}
// export { getAccessToken, getLoginStatus, apiUrl, cekLoginStatus }

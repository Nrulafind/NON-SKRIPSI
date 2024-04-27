//const apiUrl = 'http://localhost:8090/api';

// Function to get the access token from local storage
function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getLoginStatus() {
    return localStorage.getItem('logged_in');
}

// Function to fetch user data from the API
async function fetchuserData() {
    try {

        const token = getAccessToken();
        const stat = getLoginStatus();

        if (!token && !stat) {
            console.error('JWT token is missing');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${apiUrl}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            throw new Error('Failed to fetch user data');
        }

        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
            responseData.data.forEach(function (user) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>${user.user_name}</td>
                    <td>${user.password}</td>
                    <td>${user.role}</td>
                    <td>${user.status}</td>
                    <td><button class="btn btn-warning" data-toggle="modal" data-target="#edituserModal" onclick="edituser(${user.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteuser(${user.id})">delete</button></td>
                `;
                document.getElementById('userList').appendChild(row);
            });
        } else {
            console.error('Response data is not an array:', responseData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a new user
document.getElementById('adduserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var nisn = document.getElementById('addNisn').value;
    var nama = document.getElementById('addNama').value;
    var alamat = document.getElementById('addAlamat').value;
    var kelas = document.getElementById('addKelas').value;
    var attendance_id = document.getElementById('addAttendance_id').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nisn: nisn,
            nama: nama,
            alamat: alamat,
            kelas: kelas,
            attendance_id: attendance_id
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Close the modal after adding a user
            var addModal = new bootstrap.Modal(document.getElementById('adduserModal'));
            addModal.hide();
            // Clear existing rows
            document.getElementById('userList').innerHTML = '';
            // Fetch and display updated user data
            //fetchuserData();
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});

// Function to edit a user
// Function to edit a user
function edituser(userId) {
    // Fetch access token from local storage
    const token = getAccessToken();

    // Fetch user data by ID
    fetch(`${apiUrl}/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(user => {
            // Populate modal fields with user data
            document.getElementById('editNisn').value = user.nisn;
            document.getElementById('editNama').value = user.nama;
            document.getElementById('editAlamat').value = user.alamat;
            document.getElementById('editKelas').value = user.kelas;
            document.getElementById('editAttendance_id').value = user.attendance_id;

            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('edituserModal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('edituserForm').addEventListener('submit', function (event) {
                event.preventDefault();

                var newNisn = document.getElementById('editNisn').value;
                var newName = document.getElementById('editNama').value;
                var newAlamat = document.getElementById('editAlamat').value;
                var newKelas = document.getElementById('editKelas').value;
                var newAttendance = document.getElementById('editAttendance_id').value;

                // Prepare request data
                var requestData = {
                    nisn: newNisn,
                    nama: newName,
                    alamat: newAlamat,
                    kelas: newKelas,
                    attendance_id: newAttendance
                };

                // Determine HTTP method based on whether userId exists
                var method = 'PUT'; // Since it's an edit operation, we always use PUT

                fetch(`${apiUrl}/user/${userId}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update user data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('user updated successfully:', data);
                        // Close the edit modal after updating user
                        editModal.hide();
                        // Refresh the user data after editing
                        window.location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}



// Function to delete a user
function deleteuser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        var token = getAccessToken();
        if (!token) {
            console.error('JWT token is missing');
            return;
        }

        fetch(`${apiUrl}/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('user deleted successfully');
                    // Refresh the user data after deletion
                    //fetchuserData();
                    window.location.reload();
                } else {
                    throw new Error('Failed to delete user');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// On page load, fetch user data
window.onload = fetchuserData;
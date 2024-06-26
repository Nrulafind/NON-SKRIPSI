//const apiUrl = 'http://localhost:8090/api';

// Function to get the access token from local storage
// function getAccessToken() {
//     return localStorage.getItem('access_token');
// }

// function getLoginStatus() {
//     return localStorage.getItem('logged_in');
// }

//import './auth'

// Function to fetch teacher data from the API
async function fetchteacherData() {
    try {
        cekLoginStatus();

        const response = await fetch(`${apiUrl}/teacher`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            throw new Error('Failed to fetch teacher data');
        }

        const responseData = await response.json();
        console.error(responseData);
        if (Array.isArray(responseData.data)) {
            responseData.data.forEach(function (teacher) {
                var row = document.createElement('tr');
                row.innerHTML = `
                <td>${teacher.id}</td>
                    <td>${teacher.nik}</td>
                    <td>${teacher.nama}</td>
                    <td>${teacher.alamat}</td>
                    <td>${JSON.stringify(teacher.status)}</td>
                    <td><button class="btn btn-warning" data-toggle="modal" data-target="#editteacherModal" onclick="editteacher(${teacher.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteteacher(${teacher.id})">delete</button></td>
                `;
                document.getElementById('teacherList').appendChild(row);
            });
        } else {
            console.error('Response data is not an array:', responseData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a new teacher
document.getElementById('addteacherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var nik = document.getElementById('addNik').value;
    var nama = document.getElementById('addNama').value;
    var alamat = document.getElementById('addAlamat').value;
    var status = document.getElementById('addStatus').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/teacher`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nik: nik,
            nama: nama,
            alamat: alamat,
            status: status,
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Close the modal after adding a teacher
            var addModal = new bootstrap.Modal(document.getElementById('addteacherModal'));
            addModal.hide();
            // Clear existing rows
            document.getElementById('teacherList').innerHTML = '';
            // Fetch and display updated teacher data
            //fetchteacherData();
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});

// Function to edit a teacher
// Function to edit a teacher
function editteacher(teacherId) {
    // Fetch access token from local storage
    const token = getAccessToken();

    // Fetch teacher data by ID
    fetch(`${apiUrl}/teacher/${teacherId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch teacher data');
            }
            return response.json();
        })
        .then(teacher => {
            // Populate modal fields with teacher data
            document.getElementById('editNik').value = teacher.nik;
            document.getElementById('editNama').value = teacher.nama;
            document.getElementById('editAlamat').value = teacher.alamat;
            document.getElementById('editStatus').value = teacher.status;


            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('editteacherModal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('editteacherForm').addEventListener('submit', function (event) {
                event.preventDefault();

                var newNik = document.getElementById('editNik').value;
                var newName = document.getElementById('editNama').value;
                var newAlamat = document.getElementById('editAlamat').value;
                var newStatus = document.getElementById('editStatus').value;


                // Prepare request data
                var requestData = {
                    nik: newNik,
                    nama: newName,
                    alamat: newAlamat,
                    status: newStatus,
                };

                // Determine HTTP method based on whether teacherId exists
                var method = 'PUT'; // Since it's an edit operation, we always use PUT

                fetch(`${apiUrl}/teacher/${teacherId}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update teacher data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('teacher updated successfully:', data);
                        // Close the edit modal after updating teacher
                        editModal.hide();
                        // Refresh the teacher data after editing
                        window.location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}



// Function to delete a teacher
function deleteteacher(teacherId) {
    if (confirm("Are you sure you want to delete this teacher?")) {
        var token = getAccessToken();
        if (!token) {
            console.error('JWT token is missing');
            return;
        }

        fetch(`${apiUrl}/teacher/${teacherId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('teacher deleted successfully');
                    // Refresh the teacher data after deletion
                    //fetchteacherData();
                    window.location.reload();
                } else {
                    throw new Error('Failed to delete teacher');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// On page load, fetch teacher data
window.onload = fetchteacherData;
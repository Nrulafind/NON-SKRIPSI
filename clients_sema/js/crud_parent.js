//const apiUrl = 'http://localhost:8090/api';

// Function to get the access token from local storage
function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getLoginStatus() {
    return localStorage.getItem('logged_in');
}

// Function to fetch parent data from the API
async function fetchparentData() {
    try {
        const token = getAccessToken();
        const stat = getLoginStatus();

        if (!token && !stat) {
            console.error('JWT token is missing');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${apiUrl}/parent`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            throw new Error('Failed to fetch parent data');
        }

        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
            responseData.data.forEach(function (parent) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${parent.id}</td>
                    <td>${parent.nama}</td>
                    <td>${parent.alamat}</td>
                    <td>${parent.kelas}</td>
                    <td>${parent.student_id}</td>
                    <td><button class="btn btn-warning" data-toggle="modal" data-target="#editparentModal" onclick="editparent(${parent.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteparent(${parent.id})">delete</button></td>
                `;
                document.getElementById('parentList').appendChild(row);
            });
        } else {
            console.error('Response data is not an array:', responseData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a new parent
document.getElementById('addparentForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var nisn = document.getElementById('addNisn').value;
    var nama = document.getElementById('addNama').value;
    var alamat = document.getElementById('addAlamat').value;
    var kelas = document.getElementById('addKelas').value;
    var attendance_id = document.getElementById('addAttendance_id').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/parent`, {
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
            // Close the modal after adding a parent
            var addModal = new bootstrap.Modal(document.getElementById('addparentModal'));
            addModal.hide();
            // Clear existing rows
            document.getElementById('parentList').innerHTML = '';
            // Fetch and display updated parent data
            //fetchparentData();
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});

// Function to edit a parent
// Function to edit a parent
function editparent(parentId) {
    // Fetch access token from local storage
    const token = getAccessToken();

    // Fetch parent data by ID
    fetch(`${apiUrl}/parent/${parentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch parent data');
            }
            return response.json();
        })
        .then(parent => {
            // Populate modal fields with parent data
            document.getElementById('editNisn').value = parent.nisn;
            document.getElementById('editNama').value = parent.nama;
            document.getElementById('editAlamat').value = parent.alamat;
            document.getElementById('editKelas').value = parent.kelas;
            document.getElementById('editAttendance_id').value = parent.attendance_id;

            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('editparentModal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('editparentForm').addEventListener('submit', function (event) {
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

                // Determine HTTP method based on whether parentId exists
                var method = 'PUT'; // Since it's an edit operation, we always use PUT

                fetch(`${apiUrl}/parent/${parentId}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update parent data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('parent updated successfully:', data);
                        // Close the edit modal after updating parent
                        editModal.hide();
                        // Refresh the parent data after editing
                        window.location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}



// Function to delete a parent
function deleteparent(parentId) {
    if (confirm("Are you sure you want to delete this parent?")) {
        var token = getAccessToken();
        if (!token) {
            console.error('JWT token is missing');
            return;
        }

        fetch(`${apiUrl}/parent/${parentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('parent deleted successfully');
                    // Refresh the parent data after deletion
                    //fetchparentData();
                    window.location.reload();
                } else {
                    throw new Error('Failed to delete parent');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// On page load, fetch parent data
window.onload = fetchparentData;
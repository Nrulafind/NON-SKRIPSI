//const apiUrl = 'http://localhost:8090/api';

// Function to get the access token from local storage
function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getLoginStatus() {
    return localStorage.getItem('logged_in');
}

// Function to fetch class_ data from the API
async function fetchclass_Data() {
    try {
        const token = getAccessToken();
        const stat = getLoginStatus();

        if (!token && !stat) {
            console.error('JWT token is missing');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${apiUrl}/class`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            throw new Error('Failed to fetch class_ data');
        }

        const responseData = await response.json();
        console.log(responseData);
        if (Array.isArray(responseData.data)) {
            responseData.data.forEach(function (class_) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${class_.id}</td>
                    <td>${class_.nama_kelas}</td>
                    <td>${class_.wali_kelas}</td>
                    <td>${class_.kelas}</td>
                    <td>${class_.attendance_id}</td>
                    <td><button class="btn btn-warning" data-toggle="modal" data-target="#editclass_Modal" onclick="editclass_(${class_.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteclass_(${class_.id})">delete</button></td>
                `;
                document.getElementById('class_List').appendChild(row);
            });
        } else {
            console.error('Response data is not an array:', responseData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a new class_
document.getElementById('addclass_Form').addEventListener('submit', function (event) {
    event.preventDefault();
    var nisn = document.getElementById('addNisn').value;
    var nama = document.getElementById('addNama').value;
    var alamat = document.getElementById('addAlamat').value;
    var kelas = document.getElementById('addKelas').value;
    var attendance_id = document.getElementById('addAttendance_id').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/class`, {
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
            // Close the modal after adding a class_
            var addModal = new bootstrap.Modal(document.getElementById('addclass_Modal'));
            addModal.hide();
            // Clear existing rows
            document.getElementById('class_List').innerHTML = '';
            // Fetch and display updated class_ data
            //fetchclass_Data();
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});

// Function to edit a class_
// Function to edit a class_
function editclass_(class_Id) {
    // Fetch access token from local storage
    const token = getAccessToken();

    // Fetch class_ data by ID
    fetch(`${apiUrl}/class/${class_Id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch class_ data');
            }
            return response.json();
        })
        .then(class_ => {
            // Populate modal fields with class_ data
            document.getElementById('editNisn').value = class_.nisn;
            document.getElementById('editNama').value = class_.nama;
            document.getElementById('editAlamat').value = class_.alamat;
            document.getElementById('editKelas').value = class_.kelas;
            document.getElementById('editAttendance_id').value = class_.attendance_id;

            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('editclass_Modal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('editclass_Form').addEventListener('submit', function (event) {
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

                // Determine HTTP method based on whether class_Id exists
                var method = 'PUT'; // Since it's an edit operation, we always use PUT

                fetch(`${apiUrl}/class_/${class_Id}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update class_ data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('class_ updated successfully:', data);
                        // Close the edit modal after updating class_
                        editModal.hide();
                        // Refresh the class_ data after editing
                        window.location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}



// Function to delete a class_
function deleteclass_(class_Id) {
    if (confirm("Are you sure you want to delete this class_?")) {
        var token = getAccessToken();
        if (!token) {
            console.error('JWT token is missing');
            return;
        }

        fetch(`${apiUrl}/class_/${class_Id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('class_ deleted successfully');
                    // Refresh the class_ data after deletion
                    //fetchclass_Data();
                    window.location.reload();
                } else {
                    throw new Error('Failed to delete class_');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// On page load, fetch class_ data
window.onload = fetchclass_Data;
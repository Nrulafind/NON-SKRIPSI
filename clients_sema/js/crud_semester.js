//const apiUrl = 'http://localhost:8090/api';

// Function to get the access token from local storage
function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getLoginStatus() {
    return localStorage.getItem('logged_in');
}

// Function to fetch semester data from the API
async function fetchsemesterData() {
    try {
        const token = getAccessToken();
        const stat = getLoginStatus();

        if (!token && !stat) {
            console.error('JWT token is missing');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${apiUrl}/semester`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            throw new Error('Failed to fetch semester data');
        }

        const responseData = await response.json();
        console.log(responseData);

        if (Array.isArray(responseData.data)) {
            responseData.data.forEach(function (semester) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${semester.id}</td>
                    <td>${semester.nama_semester}</td>
                    <td>${semester.grade}</td>
                    <td>${semester.prediction}</td>
                    <td>${semester.attendance_id}</td>
                    <td><button class="btn btn-warning" data-toggle="modal" data-target="#editsemesterModal" onclick="editsemester(${semester.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deletesemester(${semester.id})">delete</button></td>
                `;
                document.getElementById('semesterList').appendChild(row);
            });
        } else {
            console.error('Response data is not an array:', responseData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a new semester
document.getElementById('addsemesterForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var nisn = document.getElementById('addNisn').value;
    var nama = document.getElementById('addNama').value;
    var alamat = document.getElementById('addAlamat').value;
    var kelas = document.getElementById('addKelas').value;
    var attendance_id = document.getElementById('addAttendance_id').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/semester`, {
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
            // Close the modal after adding a semester
            var addModal = new bootstrap.Modal(document.getElementById('addsemesterModal'));
            addModal.hide();
            // Clear existing rows
            document.getElementById('semesterList').innerHTML = '';
            // Fetch and display updated semester data
            //fetchsemesterData();
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});

// Function to edit a semester
// Function to edit a semester
function editsemester(semesterId) {
    // Fetch access token from local storage
    const token = getAccessToken();

    // Fetch semester data by ID
    fetch(`${apiUrl}/semester/${semesterId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch semester data');
            }
            return response.json();
        })
        .then(semester => {
            // Populate modal fields with semester data
            document.getElementById('editNisn').value = semester.nisn;
            document.getElementById('editNama').value = semester.nama;
            document.getElementById('editAlamat').value = semester.alamat;
            document.getElementById('editKelas').value = semester.kelas;
            document.getElementById('editAttendance_id').value = semester.attendance_id;

            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('editsemesterModal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('editsemesterForm').addEventListener('submit', function (event) {
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

                // Determine HTTP method based on whether semesterId exists
                var method = 'PUT'; // Since it's an edit operation, we always use PUT

                fetch(`${apiUrl}/semester/${semesterId}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update semester data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('semester updated successfully:', data);
                        // Close the edit modal after updating semester
                        editModal.hide();
                        // Refresh the semester data after editing
                        window.location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}



// Function to delete a semester
function deletesemester(semesterId) {
    if (confirm("Are you sure you want to delete this semester?")) {
        var token = getAccessToken();
        if (!token) {
            console.error('JWT token is missing');
            return;
        }

        fetch(`${apiUrl}/semester/${semesterId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('semester deleted successfully');
                    // Refresh the semester data after deletion
                    //fetchsemesterData();
                    window.location.reload();
                } else {
                    throw new Error('Failed to delete semester');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// On page load, fetch semester data
window.onload = fetchsemesterData;
//const apiUrl = 'http://localhost:8090/api';

// const token = getAccessToken();
// const stat = getLoginStatus();

// Function to fetch student data from the API
async function fetchStudentData() {
    try {
        const token = getAccessToken();
        const stat = getLoginStatus();

        if (!token && !stat) {
            console.error('JWT token is missing');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${apiUrl}/student`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            throw new Error('Failed to fetch student data');
        }

        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
            responseData.data.forEach(function (student) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.nisn}</td>
                    <td>${student.nama}</td>
                    <td>${student.alamat}</td>
                    <td>${student.kelas}</td>
                    <td>${student.attendance_id}</td>
                    <td><button class="btn btn-warning" data-toggle="modal" data-target="#editStudentModal" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.id})">delete</button></td>
                `;
                document.getElementById('studentList').appendChild(row);
            });
        } else {
            console.error('Response data is not an array:', responseData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a new student
document.getElementById('addStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var nisn = document.getElementById('addNisn').value;
    var nama = document.getElementById('addNama').value;
    var alamat = document.getElementById('addAlamat').value;
    var kelas = document.getElementById('addKelas').value;
    var attendance_id = document.getElementById('addAttendance_id').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/student`, {
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
            // Close the modal after adding a student
            var addModal = new bootstrap.Modal(document.getElementById('addStudentModal'));
            addModal.hide();
            // Clear existing rows
            document.getElementById('studentList').innerHTML = '';
            // Fetch and display updated student data
            //fetchStudentData();
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});

// Function to edit a student
// Function to edit a student
function editStudent(studentId) {
    // Fetch access token from local storage
    const token = getAccessToken();

    // Fetch student data by ID
    fetch(`${apiUrl}/student/${studentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch student data');
            }
            return response.json();
        })
        .then(student => {
            // Populate modal fields with student data
            document.getElementById('editNisn').value = student.nisn;
            document.getElementById('editNama').value = student.nama;
            document.getElementById('editAlamat').value = student.alamat;
            document.getElementById('editKelas').value = student.kelas;
            document.getElementById('editAttendance_id').value = student.attendance_id;

            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('editStudentForm').addEventListener('submit', function (event) {
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

                // Determine HTTP method based on whether studentId exists
                var method = 'PUT'; // Since it's an edit operation, we always use PUT

                fetch(`${apiUrl}/student/${studentId}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update student data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Student updated successfully:', data);
                        // Close the edit modal after updating student
                        editModal.hide();
                        // Refresh the student data after editing
                        window.location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}



// Function to delete a student
function deleteStudent(studentId) {
    if (confirm("Are you sure you want to delete this student?")) {
        var token = getAccessToken();
        if (!token) {
            console.error('JWT token is missing');
            return;
        }

        fetch(`${apiUrl}/student/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('Student deleted successfully');
                    // Refresh the student data after deletion
                    //fetchStudentData();
                    window.location.reload();
                } else {
                    throw new Error('Failed to delete student');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// On page load, fetch student data
window.onload = fetchStudentData;
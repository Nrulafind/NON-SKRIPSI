// const apiUrl = 'http://localhost:8090/api';

// // Function to get the access token from local storage
// function getAccessToken() {
//     return localStorage.getItem('access_token');
// }

// function getLoginStatus() {
//     return localStorage.getItem('logged_in');
// }

// import { getAccessToken, getLoginStatus, cekLoginStatus, apiUrl } from './auth'

// cekLoginStatus();

// Function to fetch attendance data from the API
async function fetchattendanceData() {
    try {
        const token = getAccessToken();
        const stat = getLoginStatus();

        if (!token && !stat) {
            console.error('JWT token is missing');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${apiUrl}/attendance`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            throw new Error('Failed to fetch attendance data');
        }

        const responseData = await response.json();
        console.log(responseData);
        if (Array.isArray(responseData.data)) {
            responseData.data.forEach(function (attendance) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${attendance.date_attendance_in}</td>
                    <td>${attendance.date_attendance_out}</td>
                    <td>${attendance.behaviour}</td>
                    <td>${attendance.id}</td>
                    <td><button class="btn btn-warning" data-toggle="modal" data-target="#editAttendanceModal" onclick="editAttendance(${attendance.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteattendance(${attendance.id})">delete</button></td>
                `;
                document.getElementById('attendanceList').appendChild(row);
            });
        } else {
            console.error('Response data is not an array:', responseData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a new attendance
document.getElementById('addattendanceForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var date_attendance_in = document.getElementById('addDate_attendance_in').value;
    var date_attendance_out = document.getElementById('addDate_attendance_out').value;
    var behaviour = document.getElementById('addBehaviour').value;
    var attendance_id = document.getElementById('addAttendance_id').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/attendance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            date_attendance_in: date_attendance_in,
            date_attendance_out: date_attendance_out,
            behaviour: behaviour,
            attendance_id: attendance_id
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Close the modal after adding a attendance
            var addModal = new bootstrap.Modal(document.getElementById('addattendanceModal'));
            addModal.hide();
            // Clear existing rows
            document.getElementById('attendanceList').innerHTML = '';
            // Fetch and display updated attendance data
            //fetchattendanceData();
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});

// Function to edit a attendance
async function editAttendance(attendanceId) {
    // Fetch access token from local storage
    const token = getAccessToken();

    // Fetch attendance data by ID
    fetch(`${apiUrl}/attendance/${attendanceId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }
            return response.json();
        })
        .then(attendance => {
            // Populate modal fields with attendance data
            document.getElementById('editDate_attendance_in').value = attendance.date_attendance_in;
            document.getElementById('editDate_attendance_out').value = attendance.date_attendance_out;
            document.getElementById('editBehaviour').value = attendance.behaviour;
            document.getElementById('editAttendance_id').value = attendance.id;

            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('editattendanceModal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('editattendanceForm').addEventListener('submit', function (event) {
                event.preventDefault();

                var newdate_attendance_in = document.getElementById('editdate_attendance_in').value;
                var newName = document.getElementById('editdate_attendance_out').value;
                var newbehaviour = document.getElementById('editbehaviour').value;
                var newAttendance = document.getElementById('editAttendance_id').value;

                // Prepare request data
                var requestData = {
                    date_attendance_in: newdate_attendance_in,
                    date_attendance_out: newName,
                    behaviour: newbehaviour,
                    id: newAttendance
                };

                // Determine HTTP method based on whether attendanceId exists
                var method = 'PUT'; // Since it's an edit operation, we always use PUT

                fetch(`${apiUrl}/attendance/${attendanceId}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update attendance data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('attendance updated successfully:', data);
                        // Close the edit modal after updating attendance
                        editModal.hide();
                        // Refresh the attendance data after editing
                        window.location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}



// Function to delete a attendance
function deleteattendance(attendanceId) {
    if (confirm("Are you sure you want to delete this attendance?")) {
        var token = getAccessToken();
        if (!token) {
            console.error('JWT token is missing');
            return;
        }

        fetch(`${apiUrl}/attendance/${attendanceId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('attendance deleted successfully');
                    // Refresh the attendance data after deletion
                    //fetchattendanceData();
                    window.location.reload();
                } else {
                    throw new Error('Failed to delete attendance');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// On page load, fetch attendance data
window.onload = fetchattendanceData;
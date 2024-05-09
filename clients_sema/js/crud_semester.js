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
                    <td>${semester.mid_grade}</td>
                    <td>${semester.end_grade}</td>
                    <td>${semester.prediction}</td>
                    <td>${semester.date}</td>
                    <td>${semester.student_id}</td>
                    <td>${semester.teacher_id}</td>
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
    var nama_semester = document.getElementById('addSemester').value;
    var mid_grade = document.getElementById('addMid_grade').value;
    var end_grade = document.getElementById('addEnd_grade').value;
    var prediction = document.getElementById('addPrediction').value;
    var date = document.getElementById('addDate').value;
    var student_id = document.getElementById('addStudent_id').value;
    var teacher_id = document.getElementById('addTeacher_id').value;

    // Fetch access token from local storage
    var token = getAccessToken();

    fetch(`${apiUrl}/semester`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama_semester: nama_semester,
            mid_grade: mid_grade,
            end_grade: end_grade,
            prediction: prediction,
            date: date,
            student_id: student_id,
            teacher_id: teacher_id
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
            document.getElementById('editSemester').value = semester.nama_semester;
            document.getElementById('editMid_grade').value = semester.mid_grade;
            document.getElementById('editEnd_grade').value = semester.end_grade;
            document.getElementById('editPrediction').value = semester.prediction;
            document.getElementById('editDate').value = semester.date;
            document.getElementById('editStudent_id').value = semester.student_id;
            document.getElementById('editTeacher_id').value = semester.teacher_id;

            // Show the edit modal
            var editModal = new bootstrap.Modal(document.getElementById('editsemesterModal'));
            editModal.show();

            // Add event listener for the edit form submission
            document.getElementById('editsemesterForm').addEventListener('submit', function (event) {
                event.preventDefault();

                var newSemester = document.getElementById('editSemester').value;
                var newMid_grade = document.getElementById('editMid_grade').value;
                var newEnd_grade = document.getElementById('editEnd_grade').value;
                var newPrediction = document.getElementById('editPrediction').value;
                var newDate = document.getElementById('editDate').value;
                var newStudent_id = document.getElementById('editStudent_id').value;
                var newTeacher_id = document.getElementById('editTeacher_id').value;

                // Prepare request data
                var requestData = {
                    nama_semester: newSemester,
                    mid_grade: newMid_grade,
                    end_grade: newEnd_grade,
                    prediction: newPrediction,
                    date: newDate,
                    student_id: newStudent_id,
                    teacher_id: newTeacher_id
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
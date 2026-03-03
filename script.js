// ================= REGISTER =================
async function registerUser() {

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    if (!name || !email || !password) {
        alert("All fields required!");
        return;
    }

    const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    if (response.ok) {
        alert("Registered Successfully!");
        window.location.href = "login.html";
    } else {
        alert("Registration failed");
    }
}

// ================= LOGIN =================
async function loginUser() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("http://localhost:8080/api/users");
    const users = await response.json();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "jobs.html";
    } else {
        alert("Invalid credentials");
    }
}

// ================= LOAD JOBS =================
async function loadJobs() {

    const tableBody = document.getElementById("jobsTableBody");
    tableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

    const response = await fetch("http://localhost:8080/api/jobs");

    if (!response.ok) {
        tableBody.innerHTML = "<tr><td colspan='6'>Error loading jobs</td></tr>";
        return;
    }

    const jobs = await response.json();

    if (jobs.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>No jobs available</td></tr>";
        return;
    }

    let rows = "";

    jobs.forEach(job => {
        rows += `
            <tr>
                <td>${job.id}</td>
                <td>${job.title}</td>
                <td>${job.company}</td>
                <td>${job.location}</td>
                <td>${job.salary}</td>
                <td>
                    <button onclick="applyJob(${job.id})">Apply</button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = rows;
}

// ================= APPLY JOB =================
async function applyJob(jobId) {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    const response = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: user.id,
            jobId: jobId
        })
    });

    if (response.ok) {
        alert("Applied Successfully!");
    } else {
        alert("Application failed");
    }
}

// ================= LOGOUT =================
function logoutUser() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}
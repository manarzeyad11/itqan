// Function to toggle the menu
function menuToggle() {
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
}

// Function to handle logout
function logout() {
    let confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        const apiUrlLogout = `${baseUrl}logout.php?token=${token}`;

        // Perform logout API request
        fetch(apiUrlLogout)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location.href = "index.html"; // Redirect to index.html after logout
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });

    } else {
        console.log("Logout canceled.");
    }
}

// Variable to store the token
let token;

// Function to get cookie value by name
function getCookie(name) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

// Function to get size value based on size string
function getSizeValue(size) {
    switch (size.toLowerCase()) {
        case 's':
            return '100px';
        case 'm':
            return '200px';
        case 'l':
            return '280px';
        default:
            return '180px';
    }
}

// Function to set up grid layout based on screen width
function setupGrid(columns, container) {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 900) {
        container.style.gridTemplateColumns = 'repeat(5, 1fr)';
    } else {
        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }
}

// Declare a global variable to store the dashboard data
let dashboardData = [];
let userName;

// Function to fetch dashboard data and update UI
async function fetchDashboardData() {
    try {
        const token = getCookie('token');

        if (!token) {
            console.error('Token not found in the cookie.');
            return;
        }

        const apiUrl = `${baseUrl}dashboard.php?token=${token}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Process the fetched data
        handleDashboardData(data);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

// Function to handle the fetched dashboard data
function handleDashboardData(data) {
    if (data && data.styling_data) {
        console.log("Dashboard API Response:", data);

        if (data.token_status == "PA" || data.token_status == "TA") {
            console.log('Your token:', data.token_status);

            dashboardData = data.styling_data;
            const { user_name } = data;
            console.log("Dashboard Data Array:", dashboardData);
            console.log("User name:", user_name);

            // Display user name in the header
            displayUserName(user_name);

            // Process dashboard data for the initial page
            processDashboardData(0);
        } else if (data.token_status == "NA") {
            console.log('Error: Your token is Not Approved:', data.token_status);
            alert('Your token is Not Approved');
        } else {
            console.log('Error: Your token is Not Defined:', data.token_status);
            alert('Your token is Not Defined');
        }
    } else if (data && data.error) {
        console.error('Error fetching dashboard data:', data.error);
        alert('No dashboard data in the database');
    } else {
        console.error('Unexpected response format:', data);
    }
}

// Function to display user name in the header
function displayUserName(userName) {
    const h3Element = document.querySelector('.username');
    if (h3Element) {
        h3Element.innerHTML = "Hello " + userName + " :)";
    } else {
        console.error('Element with class "username" not found.');
    }
}

// Function to process dashboard data based on the selected page
function processDashboardData(page) {
    // Get dashboard info container
    const dashboardInfo = document.getElementById("dashboard-info");
    // Create a container for buttons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("button-container");


    // Filter styling data based on the selected page
    const filteredData = dashboardData.filter(buttonInfo => buttonInfo.page === page.toString());

    console.log(filteredData);

    // Case 2
    const customComparator = (a, b) => {
        if (a.y !== b.y) {
            return parseInt(a.y) - parseInt(b.y);
        } else {
            return parseInt(a.x) - parseInt(b.x);
        }
    };

    // Sort the array using the custom comparator function
    const sortedArray = filteredData.sort(customComparator);

    console.log(sortedArray);


    // Iterate through filtered styling data and create buttons
    filteredData.forEach(buttonInfo => {
        const button = document.createElement("button");

        button.textContent = buttonInfo.stylestring;
        button.style.backgroundColor = buttonInfo.color;
        button.style.width = getSizeValue(buttonInfo.size);
        button.style.height = "100px";
        button.style.border = "none";
        button.style.margin = "10px";
        button.style.fontSize = "15px";
        button.style.fontWeight = "bold";

        // Case 1
        // button.style.marginTop = "80px";
        // button.style.position = "absolute";
        // button.style.left = (buttonInfo.x)*100 + "px";
        // button.style.top = (buttonInfo.y)*100 + "px";


        // Add mouseleave event to reset button color
        button.addEventListener("mouseleave", function () {
            button.style.backgroundColor = buttonInfo.color;
        });

        // Add button to container
        buttonsContainer.appendChild(button);

        // Add click event to buttons
        button.addEventListener("click", function () {
            if (buttonInfo.stylestring === 'فاتورة بيع') {
                console.log("Redirecting to invoice.html");
                window.location.href = "invoice.html";
            } else {
                // Handle other button clicks
            }
        });
    });

    // Add buttons container to dashboard info
    dashboardInfo.innerHTML = ""; // Clear previous data
    dashboardInfo.appendChild(buttonsContainer);

    // Set up grid based on the number of buttons
    setupGrid(filteredData.length, buttonsContainer);
}

// Event listener when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Fetch and display dashboard data
    fetchDashboardData();

    // Add click event for logout link
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Add click event for user profile link
    const userProfileLink = document.getElementById("profile-link");
    if (userProfileLink) {
        userProfileLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "user-profile.html";
        });
    }

    // Add click events for page buttons
    const pageButtons = document.querySelectorAll(".pageContainer button");
    pageButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            const pageIndex = index + 1;
            console.log("Page index from the button:", pageIndex);

            // Get dashboard info container
            const dashboardInfo = document.getElementById("dashboard-info");
            // Clear the content of the button container
            dashboardInfo.innerHTML = '';
            // Process dashboard data for the selected page
            processDashboardData(pageIndex - 1);
        });
    });
});

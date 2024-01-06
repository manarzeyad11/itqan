document.addEventListener("DOMContentLoaded", async function () {
    try {
        const searchInput = document.getElementById("searchInput");
        const searchResults = document.getElementById("searchResults");
        const tableContainer = document.getElementById("tableContainer");
        const currencySelect = document.getElementById("currencySelect");
        const addRowBtn = document.getElementById("addRowBtn");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Display the table
        displayTable();

        const apiUrlLocal = `${baseUrl}invocelocal.php`;

        // Fetch data from the local API
        const response = await fetch(apiUrlLocal);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Store the accounts in an array for local searching
        const localAccounts = Array.isArray(data) ? data.map(item => item.accountstring) : [];

        console.log(localAccounts);


        // Function to display search results as a dropdown
        function displaySearchResults(results) {
            searchResults.innerHTML = "";

            if (results && results.length > 0) {
                results.forEach(result => {
                    const listItem = document.createElement("li");

                    // Check if the result is an object (server response)
                    if (typeof result === "object" && result.hasOwnProperty("accountstring")) {
                        listItem.textContent = result.accountstring;
                        listItem.addEventListener("click", function () {
                            selectResult(result);
                        });
                    } else if (typeof result === "string") {
                        // Assume it's a local result (string)
                        listItem.textContent = result;
                        listItem.addEventListener("click", function () {
                            selectResult({ accountstring: result });
                        });
                    }

                    searchResults.appendChild(listItem);
                });
            } else {
                searchResults.innerHTML = "<li>No results found</li>";
            }
        }


        // Function to handle search input and fetch results
        async function handleSearchInput() {
            // Check the selected search method
            const searchMethod = document.getElementById("searchMethod").value;

            // Implement logic based on the selected method and
            // Only fetch results if there is at least one character in the search input

            if (searchMethod === "server" && searchInput.value.length > 0) {
                // Show loading spinner
                loadingSpinner.style.display = "block";

                const encodedSearchInput = encodeURIComponent(searchInput.value);
                const apiUrlServer = `${baseUrl}invoce.php?customername=${encodedSearchInput}`;

                try {
                    const response = await fetch(apiUrlServer);

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.text();
                    const jsonStartIndex = data.indexOf('[');
                    const jsonString = data.slice(jsonStartIndex);
                    const jsonData = JSON.parse(jsonString);

                    displaySearchResults(jsonData);
                } catch (error) {
                    console.error("An error occurred during server request:", error);
                    // Display an error message to the user
                    searchResults.innerHTML = "<li>Error fetching data from the server</li>";
                } finally {
                    // Hide loading spinner
                    loadingSpinner.style.display = "none";
                }

            } else if (searchMethod === "local" && searchInput.value.length > 0) {


                const localResults = localAccounts.filter(account => account.includes(searchInput.value));
                console.log(localResults);

                displaySearchResults(localResults);

                // Hide loading spinner
                loadingSpinner.style.display = "none";
            } else {
                // Clear search results if the search input is empty or no method is selected
                searchResults.innerHTML = "";
                // Hide loading spinner
                loadingSpinner.style.display = "none";
            }
        }

        // Event listener for search input changes
        searchInput.addEventListener("input", handleSearchInput);

        // Function to select a result from the search and display the table
        function selectResult(account) {
            // Set the selected result as the search input value
            searchInput.value = account.accountstring;
            // Clear search results
            searchResults.innerHTML = "";
        }

        function displayTable() {
            // Create a table with columns: Item, Price, Quantity, and Total Price
            const table = document.createElement("table");
            table.classList.add("responsive-table");

            // Set an id for the table
            table.id = "invoiceTable";

            // Create header row
            const headerRow = table.insertRow(0);
            const headers = ["Item", "Price", "Quantity", "Total Price"];

            headers.forEach(headerText => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            // Create 5 data rows
            for (let rowNumber = 1; rowNumber <= 5; rowNumber++) {
                const dataRow = table.insertRow(rowNumber);

                // Populate data cells with input fields for editing
                for (let i = 0; i < headers.length; i++) {
                    const cell = dataRow.insertCell(i);
                    const input = document.createElement("input");

                    input.type = "text";
                    input.value = "";

                    // Add unique id or name attributes to each input field
                    input.id = headers[i].toLowerCase();
                    input.name = headers[i].toLowerCase();

                    // Add an event listener for the "Quantity" and "Price" fields
                    if (headers[i] === "Quantity" || headers[i] === "Price") {
                        input.addEventListener("input", function () {
                            updateTotalPrice(table);
                        });
                    }

                    // Disable the "Total Price" field
                    if (headers[i] === "Total Price") {
                        input.disabled = true;
                        input.name = "totalPrice";
                    }

                    cell.appendChild(input);
                }
            }



            // Clear previous tables
            tableContainer.innerHTML = "";
            tableContainer.appendChild(table);

            // Calculate initial total price
            updateTotalPrice(table);

            // Show the "Add Row" button and Total Sum
            addRowBtn.style.display = "block";
            totalSumOutput.style.display = "block";
        }

        // Function to update the "Total Price" based on "Price" and "Quantity"
        function updateTotalPrice(table) {
            // Get all rows in the table
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const priceInput = row.querySelector('input[name="price"]');
                const quantityInput = row.querySelector('input[name="quantity"]');
                const totalPriceInput = row.querySelector('input[name="totalPrice"]');

                if (priceInput && quantityInput && totalPriceInput) {
                    // Parse values as floats
                    const price = parseFloat(priceInput.value) || 0;
                    const quantity = parseFloat(quantityInput.value) || 0;

                    // Calculate total price for each row
                    const totalPrice = price * quantity;

                    // Update the "Total Price" input field for each row
                    totalPriceInput.value = totalPrice.toFixed(2);
                }
            });

            // Calculate and display the total sum
            calculateTotalSum();
        }

        // Event listener for the "Add Row" button
        addRowBtn.addEventListener("click", function () {
            addRow();
        });

        // Function to add a new row to the table
        function addRow() {
            const table = document.getElementById("invoiceTable");

            if (table) {
                const newRow = table.insertRow(table.rows.length);
                const headers = ["Item", "Price", "Quantity", "Total Price"];

                for (let i = 0; i < headers.length; i++) {
                    const cell = newRow.insertCell(i);
                    const input = document.createElement("input");

                    input.type = "text";
                    input.value = "";
                    input.id = headers[i].toLowerCase();
                    input.name = headers[i].toLowerCase();

                    // Add an event listener for the "Quantity" and "Price" fields
                    if (headers[i] === "Quantity" || headers[i] === "Price") {
                        input.addEventListener("input", function () {
                            updateTotalPrice(table);
                        });
                    }

                    // Disable the "Total Price" field
                    if (headers[i] === "Total Price") {
                        input.disabled = true;
                        input.name = "totalPrice";
                    }

                    cell.appendChild(input);
                }

                // Calculate total price for the new row
                updateTotalPrice(table);
            }
        }

        // Function to calculate and display the total sum of "Total Price"
        function calculateTotalSum() {
            const table = document.getElementById("invoiceTable");
            let totalSum = 0;

            if (table) {
                // Get all rows in the table
                const rows = table.querySelectorAll('tbody tr');

                rows.forEach(row => {
                    const totalPriceInput = row.querySelector('input[name="totalPrice"]');

                    if (totalPriceInput) {
                        // Parse value as a float
                        const totalPrice = parseFloat(totalPriceInput.value) || 0;

                        // Accumulate total sum
                        totalSum += totalPrice;
                    }
                });
            }

            // Update the text content of the total sum output div element
            const totalSumOutput = document.getElementById("totalSumOutput");
            if (totalSumOutput) {
                totalSumOutput.textContent = `Total Sum: ${totalSum.toFixed(2)}`;
            }

            console.log(totalSum);
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
});

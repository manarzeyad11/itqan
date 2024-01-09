document.addEventListener("DOMContentLoaded", async function () {
    try {
        const searchInput = document.getElementById("searchInput");
        const searchResults = document.getElementById("searchResults");
        const loadingSpinner = document.getElementById("loadingSpinner");

        const apiUrlLocal = `${baseUrl}invoicelocal.php`;

        // Fetch data from the local API
        const response = await fetch(apiUrlLocal);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Store the accounts in an array for local searching
        const localAccounts = Array.isArray(data) ? data.map(item => item.accountstring) : [];

        // console.log(localAccounts);


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

            console.log("Search method:", searchMethod);

            if (searchMethod === "server" && searchInput.value.length > 0) {
                // Show loading spinner
                loadingSpinner.style.display = "block";

                const encodedSearchInput = encodeURIComponent(searchInput.value);
                const apiUrlServer = `${baseUrl}invoice.php?customername=${encodedSearchInput}`;

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

        // Function to display item search results as a dropdown
        function displayItemSearchResults(resultsContainer, results) {
            resultsContainer.innerHTML = "";

            if (results && results.length > 0) {
                results.forEach(result => {
                    const listItem = document.createElement("li");

                    // Check if the result is an object (server response)
                    if (typeof result === "object" && result.hasOwnProperty("itemname")) {
                        listItem.textContent = result.itemname;
                        listItem.addEventListener("click", function () {
                            selectItemResult(result, resultsContainer);
                        });
                    } else if (typeof result === "string") {
                        // Assume it's a local result (string)
                        listItem.textContent = result;
                        listItem.addEventListener("click", function () {
                            selectItemResult({ itemname: result }, resultsContainer);
                        });
                    }

                    resultsContainer.appendChild(listItem);
                });
            } else {
                resultsContainer.innerHTML = "<li>No results found</li>";
            }
        }

        // Function to handle item search input and fetch results
        async function handleItemSearch(itemInput, resultsContainer) {
            console.log("Item search value:", itemInput.value);

            if (itemInput.value.length > 0) {

                const encodedItemInput = encodeURIComponent(itemInput.value);
                const apiUrlServer = `${baseUrl}item.php?itemname=${encodedItemInput}`;

                try {
                    const response = await fetch(apiUrlServer);

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.text();
                    const jsonStartIndex = data.indexOf('[');
                    const jsonString = data.slice(jsonStartIndex);
                    const jsonData = JSON.parse(jsonString);

                    console.log(jsonData);
                    

                    displayItemSearchResults(resultsContainer, jsonData);
                } catch (error) {
                    console.error("An error occurred during server request:", error);
                    // Display an error message to the user
                    displayItemSearchResults(resultsContainer, ["Error fetching data from the server"]);
                } 
            } else {
                // Clear search results if the search input is empty
                resultsContainer.innerHTML = "";
               
            }
        }

        // Event listener for the "Item" fields
        const itemSearchInputs = document.querySelectorAll(".item-search");
        itemSearchInputs.forEach((itemInput, index) => {
            const resultsContainer = document.getElementById(`itemResults${index + 1}`);
            console.log(resultsContainer);
            itemInput.addEventListener("input", function () {
                handleItemSearch(itemInput, resultsContainer);
            });
        });

        // Function to select an item result from the search and fill in the respective input
        function selectItemResult(item, resultsContainer) {
            const input = resultsContainer.previousElementSibling; // Get the corresponding input field
            input.value = item.itemname;
            // Clear search results
            resultsContainer.innerHTML = "";
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
});
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');

    if (pageId === 'collection') {
        fetch('collection.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('originalData', JSON.stringify(data));
                displayData(data, 'collectionContainer');
            });
    } else if (pageId === 'expense') {
        fetch('expenses.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('originalData', JSON.stringify(data));
                displayData(data, 'expenseContainer');
            });
    }
    else if (pageId === 'introduction') {
        showTotal();
    }
}

function showTotal() {
    fetch('collection.json')
        .then(response => response.json())
        .then(data => {
            var totalAmount = 0;
            data.forEach(row => {
                totalAmount += parseFloat(row['Amount in Rupees']);
            });
            document.getElementById('total-collection').textContent = totalAmount;
        });

    fetch('expenses.json')
        .then(response => response.json())
        .then(data => {
            var totalAmount = 0;
            data.forEach(row => {
                totalAmount += parseFloat(row['Amount in Rupees']);
            });
            document.getElementById('total-expenses').textContent = totalAmount;
        });
}

document.addEventListener('DOMContentLoaded', function () {
    showPage('introduction');
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-students').textContent = data.totalStudents;
            document.getElementById('total-hand').textContent = data.totalInHand;
            //document.getElementById('total-expenses').textContent = data.totalExpenses;
        });
});

function displayData(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Create date range filter inputs
    const dateFilterDiv = document.createElement('div');
    if (containerId == 'expenseContainer') {
        dateFilterDiv.innerHTML = `
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate">
        <button onclick="applyDateFilter('${containerId}')">Apply Filter</button>
    `;
    }
    else {
        dateFilterDiv.innerHTML = `
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate1">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate1">
        <button onclick="applyDateFilter('${containerId}')">Apply Filter</button>
    `;
    }
    container.appendChild(dateFilterDiv);

    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');

    // Display table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Add table headers
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Add table rows
    let totalAmount = 0;
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            if (header === 'Amount in Rupees') {
                td.textContent = "₹ " + row[header];
            }
            else {
                td.textContent = row[header];
            }
            tr.appendChild(td);
            // If the header is 'Amount', calculate the total amount
            if (header === 'Amount in Rupees') {
                totalAmount += parseFloat(row[header]);
            }
        });
        tbody.appendChild(tr);
    });

    // Add total amount row
    const totalRow = document.createElement('tr');
    totalRow.setAttribute('id', 'totalRow'); // Add an id to the total row for easy access
    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total';
    const totalAmountCell = document.createElement('td');
    totalAmountCell.textContent = "₹ " + totalAmount.toFixed(2); // Display total amount with two decimal places
    totalRow.appendChild(totalHeader);
    totalRow.appendChild(totalAmountCell);
    tbody.appendChild(totalRow); // Append the total row to the table body

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    container.appendChild(tableContainer);
}


function applyDateFilter(containerId) {
    const container = document.getElementById(containerId);
    var startDate = '';
    var endDate = '';
    if (containerId == 'expenseContainer') {
        startDate = document.getElementById('startDate').value;
        endDate = document.getElementById('endDate').value;
    }
    else {
        startDate = document.getElementById('startDate1').value;
        endDate = document.getElementById('endDate1').value;
    }

    // Get the original data from local storage
    const originalData = JSON.parse(localStorage.getItem('originalData'));

    // Filter the original data based on the date range
    const filteredData = originalData.filter(row => {
        const date = new Date(row.Date); // Assuming 'Date' is the column containing dates
        return date >= new Date(startDate) && date <= new Date(endDate);
    });

    // Update the displayed data with the filtered data
    displayData(filteredData, containerId);
}

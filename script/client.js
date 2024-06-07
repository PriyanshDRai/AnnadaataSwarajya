//  Dynamic Date input according to current date
document.addEventListener('DOMContentLoaded', (event) => {
  const fromDateInput = document.getElementById('min_max_apmc_from_date');
  const toDateInput = document.getElementById('min_max_apmc_to_date');

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = today.getFullYear();
  const currentDate = `${year}-${month}-${day}`;

  // Calculate the date 7 days before today
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 7);
  const pastDay = String(pastDate.getDate()).padStart(2, '0');
  const pastMonth = String(pastDate.getMonth() + 1).padStart(2, '0'); // January is 0!
  const pastYear = pastDate.getFullYear();
  const pastDateString = `${pastYear}-${pastMonth}-${pastDay}`;

  // Set the min and max attributes
  fromDateInput.min = pastDateString;
  fromDateInput.max = currentDate;
  toDateInput.min = pastDateString;
  toDateInput.max = currentDate;
});

// Add Data Form Display Functions
function add() {
  document.getElementById("addDataForm").style.display = "block";
}

function cancel() {
  document.getElementById("addDataForm").style.display = "none";
}

// Function to fetch data from server and populate table
console.log('hello from client');
function fetchData() {
  fetch('http://localhost:3000/all')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const tableData = document.getElementById('tableData');
      tableData.innerHTML = ''; // Clear existing table rows
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.APMC}</td>
          <td>${new Date(row.Date).toLocaleDateString()}</td>
          <td>${row.Commodity}</td>
          <td>${row.Minimum_Price || 'N/A'}</td>
          <td>${row.Modal_Price || 'N/A'}</td>
          <td>${row.Maximum_Price || 'N/A'}</td>
          <td>${row.Commodity_Arrival || 'N/A'}</td>
          <td>${row.Commodity_Traded || 'N/A'}</td>
          <td>${row.Unit || 'N/A'}</td>
        `;
        console.log(data);
        tableData.appendChild(tr);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}

// fetchData();
document.getElementById('refresh').addEventListener('click', fetchData);
console.log('After fetching data');

// Function to ADD data from Add data input form using FETCH API POST method
function addData() {
  const apmc = document.getElementById('addData_apmc').value;
  const commodity = document.getElementById('addData_commodity').value;
  const date = new Date(document.getElementById('addData_date').value).toISOString().slice(0, 10);
  const minimumPrice = document.getElementById('addData_minimum_price').value;
  const modalPrice = document.getElementById('addData_modal_price').value;
  const maximumPrice = document.getElementById('addData_maximum_price').value;
  const commodityArrival = document.getElementById('addData_commodity_arrival').value || null;
  const commodityTraded = document.getElementById('addData_commodity_traded').value || null;
  const unit = document.getElementById('addData_unit').value || null;

  const data = {
    apmc,
    commodity,
    date,
    minimumPrice,
    modalPrice,
    maximumPrice,
    commodityArrival,
    commodityTraded,
    unit
  };
  
  fetch('http://localhost:3000/addRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message); // Handle response from the server
      console.log('Add route is running');
      // Display success message to the user
      // const successMessage = document.getElementById('success-message');
      // successMessage.textContent = 'Data is added successfully to the Server.';
      // successMessage.style.display = 'block';
      // Clear the success message after some time
      // setTimeout(() => {
      //   successMessage.style.display = 'none';
      // }, 3000);
    })
    .catch(error => {
      console.error('Error:', error.message);
      // Display error message to the user
      // const errorMessage = document.getElementById('error-message');
      // errorMessage.textContent = 'Error adding data to the server.';
      // errorMessage.style.display = 'block';
      // Clear the error message after some time
      // setTimeout(() => {
      //   errorMessage.style.display = 'none';
      // }, 3000);
    });
}

function hideAddForm() {
  document.getElementById("addDataForm").style.display = "none";
}
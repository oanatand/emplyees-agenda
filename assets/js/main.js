var employeesAPI = "http://rest.vedinas.ro/employees";
var employeesList = [];

function deserializeResponse(response) {
    return response.json();
}

function createEmployeeElement(employee) {
    var employeeElement = document.createElement("li");
    employeeElement.classList.add("employee");
    employeeElement.setAttribute("id", employee.id);

    var employeeNameElement = document.createElement("div");
    employeeNameElement.classList.add("name");
    employeeNameElement.innerText = employee.name;

    var pElement = document.createElement("p");
    var pInnerHTML = `<span>Age: ${employee.age}</span> <span>Salary: ${employee.salary}</span>`;
    pElement.innerHTML = pInnerHTML;

    var removeElement = document.createElement("button");
    removeElement.classList.add("remove");
    removeElement.innerText = "X";
    removeElement.addEventListener("click", removeEmployee);

    employeeElement.appendChild(employeeNameElement);
    employeeElement.appendChild(pElement);
    employeeElement.appendChild(removeElement);

    return employeeElement;
}

function createSpinnerElement() {
    var spinnerElement = document.createElement("div");
    spinnerElement.classList.add("loader");
    return spinnerElement;
}

function listEmployees(employees) {
    var agendaElement = document.querySelector(".agenda");
    for (var i = 0; i < employees.length; i++) {
        var employeeElement = createEmployeeElement(employees[i]);
        agendaElement.appendChild(employeeElement);
        addEmployeeToCache(employees[i]);
    }
}

function getEmployees() {
    fetch(employeesAPI)
        .then(deserializeResponse)
        .then(listEmployees)
}

function addEmployee(event) {
    event.preventDefault();

    var name = event.target[1].value;
    var age = event.target[2].value;
    var salary = event.target[3].value;

    var employee = {
        name: name,
        age: age,
        salary: salary
    };

    addSpinnerToDOM();
    addEmployeeToAPI(employee);
}

function addEmployeeToAPI(employee) {
    var requestParameters = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    };
    
    fetch(employeesAPI, requestParameters)
        .then(deserializeResponse)
        .then(() => addEmployeeToDOM(employee))
        .catch(error => console.log(error))
}

function addEmployeeToDOM(employee) {
    var employeeElement = createEmployeeElement(employee);
    var agendaElement = document.querySelector(".agenda");

    addEmployeeToCache(employee);
    removeSpinnerFromDOM();
    agendaElement.appendChild(employeeElement);

    clearFormInputs();
}

function addSpinnerToDOM() {
    var spinnerElement = createSpinnerElement();
    var agendaElement = document.querySelector(".agenda");
    agendaElement.appendChild(spinnerElement);
}

function removeSpinnerFromDOM() {
    var spinnerElement = document.getElementsByClassName("loader");
    spinnerElement[0].remove();
}

function clearFormInputs() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("salary").value = "";
}

function removeEmployee(event) {
    var employeeElement = event.target.parentElement;
    var employeeId = employeeElement.id;
    var deleteEmployeeUrl = employeesAPI + `/${employeeId}`;
    var requestParameters = {
        method: "DELETE",
    };

    fetch(deleteEmployeeUrl, requestParameters)
        .then(deserializeResponse)
        .then(() => {
            employeeElement.remove();
            removeEmployeeFromCache(employeeId - 1);
        })
        .catch(error => console.log(error))
}

function searchEmployees() {
    var searchInputText = document.getElementById("searchField").value;
    removeEmployeesFromDOM();
    searchInputText !== '' ? searchEmployeesByName(searchInputText) : getEmployeesFromCache();
}

function searchEmployeesByName(searchedEmployeeName) {
    var agendaElement = document.querySelector(".agenda");
    
    for (var i = 0; i < employeesList.length; i++) {
        if (employeesList[i].name.includes(searchedEmployeeName)) {
            var employeeElement = createEmployeeElement(employeesList[i]);
            agendaElement.appendChild(employeeElement);
        }
    }
}

function removeEmployeesFromDOM() {
    var agendaElement = document.querySelector(".agenda");
    var employees = agendaElement.children;
    
    for (var i = employees.length - 1; i >= 0; i--) {
        employees[i].remove();
    }
}

function getEmployeesFromCache() {
    var agendaElement = document.querySelector(".agenda");
    for (var i = 0; i < employeesList.length; i++) {
        var employeeElement = createEmployeeElement(employeesList[i]);
        agendaElement.appendChild(employeeElement);
    }
}

function addEmployeeToCache(employee) {
    employeesList.push(employee);
}

function removeEmployeeFromCache(id) {
    employeesList.splice(employeesList.indexOf(id), 1);
}

function onDOMLoaded() {
    getEmployees();

    var addEmployeeElement = document.querySelector(".add-employee");
    addEmployeeElement.addEventListener("submit", addEmployee);
}

document.addEventListener("DOMContentLoaded", onDOMLoaded);

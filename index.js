// import packages/dependencies

const inquirer = require("inquirer");
// const cTable = require("console.Table");

// const colors = require("colors");
const figlet = require("figlet");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Murphy1234.",
    database: "company_db",
  },
  console.log("Success: you are connected")
);

db.connect(function (err) {
  if (err) throw err;
});

// prompt main content
const initialChoices = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What action would you like to do?",
        choices: [
          "View All Departments",
          "Add Department",
          "View All Roles",
          "Add Role",
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "Finish!",
        ],
      },
    ])
    .then((answer) => {
      if (answer.choices === "viewAllDepartments") {
        viewAllDepartments();
      }
      if (answer.choices === "addDepartment") {
        addDepartment();
      }
      if (answer.choices === "viewAllRoles") {
        viewAllRoles();
      }
      if (answer.choices === "addRole") {
        addNewRole();
      }
      if (answer.choices === "viewAllEmployees") {
        viewAllEmployees();
      }
      if (answer.choices === "addEmployee") {
        addNewEmployee();
      }
      if (answer.choices === "updateEmployeeRole") {
        updateEmployeeRole();
      }
      if (answer.choices === "quit") {
        db.end();
      }
    });
};

initialChoices();

viewAllDepartments = () => {
  const sql = `SELECT departments.id AS id, 
  departments.department_name AS department 
  FROM departments;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainContent();
  });
};

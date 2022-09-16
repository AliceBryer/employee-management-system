// import packages/dependencies

const inquirer = require("inquirer");
const cTable = require("console.Table");

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
          "Add New Role",
          "View All Employees",
          "Add New Employee",
          "Update Employee Role",
          "Finish!",
        ],
      },
    ])
    .then((answer) => {
      if (answer.choices === "View All Departments") {
        viewAllDepartments();
      }
      if (answer.choices === "Add Department") {
        addDepartment();
      }
      if (answer.choices === "Vieww All Roles") {
        viewAllRoles();
      }
      if (answer.choices === "Add New Role") {
        addNewRole();
      }
      if (answer.choices === "View All Employees") {
        viewAllEmployees();
      }
      if (answer.choices === "Add New Employee") {
        addNewEmployee();
      }
      if (answer.choices === "Update Employee Role") {
        updateEmployeeRole();
      }
      if (answer.choices === "Finish") {
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
    initialChoices();
  });
};

addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message:
          "Please type in the name of the deparment you would like to add",
        validate: async (answer) => {
          if (!answer) {
            return "You must enter the name of the department to continue";
          }
          return true;
        },
      },
    ])
    .then(function (answer) {
      db.query(
        `INSERT INTO departments (department_name) 
         VALUES ("${answer.department}")`,
        (err, results) => {
          if (err) throw err;
          console.log(`${answer.department} has been added to the database.`);
          initialChoices();
        }
      );
    });
};

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
      if (answer.choices === "View All Roles") {
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

// function

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

// function

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

// function

viewAllRoles = () => {
  const sql = `
  SELECT roles.id, 
  roles.title, 
  roles.salary, 
  departments.department_name AS department 
  FROM roles 
  INNER JOIN departments ON roles.department_id = departments.id;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    initialChoices();
  });
};

// add new role

addNewRole = () => {
  db.query(`SELECT * FROM departments;`, (err, results) => {
    if (err) throw err;
    let departments = results.map((departments) => ({
      name: departments.department_name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "role",
          message: "What new role would you like to add?",
          validate: async (answer) => {
            if (!answer) {
              return "You must enter a role name to continue";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
          validate: async (answer) => {
            if (!answer || isNaN(answer)) {
              return "You must enter a salary in numeric form to continue";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "department",
          message: "Which department would you like to add this job role to?",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO roles SET ?;`,
          {
            title: answer.role,
            salary: answer.salary,
            department_id: answer.department,
          },
          (err, results) => {
            if (err) throw err;
            console.log(`${answer.role} has been added to the database`);
            initialChoices();
          }
        );
      });
  });
};

viewAllEmployees = () => {
  const sql = `
SELECT employees.id, 
employees.first_name, 
employees.last_name, 
roles.title, 
departments.department_name AS department,
roles.salary, 
CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees manager ON employees.manager_id = manager.id;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    initialChoices;
  });
};

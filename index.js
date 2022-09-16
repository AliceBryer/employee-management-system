// import packages/dependencies

const inquirer = require("inquirer");
const cTable = require("console.Table");
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

//view all departments function

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

// add department function

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

// view all roles function

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

// add new role function

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

// view all employees function

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
    initialChoices();
  });
};

// add new employee function

addNewEmployee = () => {
  db.query(`SELECT * FROM employees;`, (err, results) => {
    if (err) throw err;
    let managers = results.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    db.query(`SELECT * FROM roles;`, (err, results) => {
      if (err) throw err;
      let roles = results.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is their first name?",
            validate: async (answer) => {
              if (!answer) {
                return "You must add a name to continue.";
              }
              return true;
            },
          },
          {
            type: "input",
            name: "lastName",
            message: "What is their last name?",
            validate: async (answer) => {
              if (!answer) {
                return "You must add a last name to continue.";
              }
              return true;
            },
          },
          {
            type: "list",
            name: "role",
            message:
              "What is their role? Please pick from the choices, otherwise you will need to create a new role ",
            choices: roles,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is their manager?",
            choices: managers,
          },
        ])
        .then((answer) => {
          db.query(
            `INSERT INTO employees SET ?;`,
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.role,
              manager_id: answer.manager,
            },
            (err, results) => {
              if (err) throw err;
              console.log(
                `${answer.firstName} ${answer.lastName} has been added to the database.`
              );
              initialChoices();
            }
          );
        });
    });
  });
};

// update employee role function

updateEmployeeRole = () => {
  db.query(`SELECT * FROM employees;`, (err, results) => {
    if (err) throw err;
    let employees = results.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    db.query(`SELECT * FROM roles;`, (err, results) => {
      if (err) throw err;
      let roles = results.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Select an employee from the list to update",
            choices: employees,
          },
          {
            type: "list",
            name: "newRole",
            message: "From the choices select their new role?",
            choices: roles,
          },
        ])
        .then((answer) => {
          db.query(
            `UPDATE employees SET ? WHERE ?`,
            [
              {
                role_id: answer.newRole,
              },
              {
                id: answer.employeeList,
              },
            ],
            (err, results) => {
              if (err) throw err;
              console.log(`The employees role has been updated.`);
              initialChoices();
            }
          );
        });
    });
  });
};

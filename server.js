import express from "express";
import mysql from "mysql2";
import inquirer from "inquirer";
// import cTable = from "console.table"

// const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Murphy1234.",
    database: "company_db",
  },
  console.log(`Succsess: Connected to the database`)
);

inquirer
  .prompt([
    {
      type: "list",
      name: "initialchoices",
      message: "Please select from the following",
      choices: [
        "View Departments",
        "View Roles",
        "view Employees",
        "add a department",
        "add a new role",
        "update an employee",
        "quit system",
      ],
    },
  ])
  .then(() => console.log("Success!"));

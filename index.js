// import packages/dependencies

// const inquirer = require("inquirer");
// const cTable = require("console.Table");
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

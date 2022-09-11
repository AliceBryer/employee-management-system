const express = require("express");
const mysql = require("mysql2");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",

    user: "root",

    password: "",
    database: "company_db",
  },
  console.log(`Succsess: Connected to the database`)
);

app.get("/api/");

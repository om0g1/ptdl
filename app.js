const path = require("path");
const express = require("express");
const fs = require("fs");
const mySql = require("mysql");
const con = mySql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "app"
});

con.connect((err) => {
    if (err) throw err;
    console.log("connected");
    con.query("CREATE DATABASE IF NOT EXISTS app", (error, result) => {
        if (error) {throw error};
        console.log("Database created", result);
    });
});

// con.query("DROP TABLE tasks");
con.query("CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), description VARCHAR(255), completion VARCHAR(8))", (error, result) => {
    if (error) throw error;
    console.log("Table created");
});

const app = express();

const error500 = "Error 500: internal server error";

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (request, response) => {
    con.query("SELECT * FROM tasks", (error, result) => {
        if (error) throw error;
        const tasks = result.map((row) => {
            return {
                id: row.id,
                name: row.name,
                description: row.description,
                completion: row.completion
            }
        });
        response.render("index", {tasks});
    });
});

function getRow(row) {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM tasks WHERE id = ${row}`, (error, result) => {
            if (error) reject(error);
            else if (result.length === 0) resolve(null);
            else {
            const task = {
                "id": result[0].id,
                "name": result[0].name,
                "description": result[0].description,
                "completion": result[0].completion
                };
            resolve(task);
            }
        });
    });
}

app.post("/add", (request, response) => {
    const form = request.body;
    con.query("INSERT INTO tasks (name, description, completion) VALUES (?, ?, ?)", [form.name, form.description, ""], (error, result) => {
        if (error) throw error;
        const task = getRow(result.insertId)
        .then((task) => {response.json(task)})
        .catch(error => {console.log(error)}
        );
    });
});

app.post("/delete", (request, response) => {
    const form = request.body;
    con.query("DELETE FROM tasks WHERE id = ?", [form.id], (error, result) => {
        if (error) throw error;
        response.json(true);
    });
});

app.post("/update", (request, response) => {
    const form = request.body;
    let status = "";
    if (form.status == true) {status = "checked"};
    con.query(`UPDATE tasks SET completion = ? WHERE id = ?`, [status, form.id], (error, result) => {
        if (error) throw error;
        response.json(true);
    });
});

app.post("/delete", (request, response) => {
    const form = request.body;
    con.query("DELETE FROM tasks WHERE id = ?", [form.id], (error, result) => {
        if (error) throw error;
        response.json(true);
    })
})

app.listen(process.env.PORT || 8080, () => {console.log(`app running on http://localhost:8080`)});
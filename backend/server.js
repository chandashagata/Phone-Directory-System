const express =require("express");
const cors= require("cors");
const mysql= require("mysql");

const app= express();
app.use(express.json());

app.use(cors());

const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "JuhiShagata",
    database: "phonedirectory"
})

app.get("/", (req, res) => {
    const sql= "SELECT * FROM users";
    db. query(sql, (err, data) => {
        if(err) return res.json("ERROR");
        return res.json(data);
    })
});

app.post('/create', (req, res) => {
    const sql = "INSERT INTO users (FULL_NAME, EMAIL, PHONE, DOB) VALUES (?)";
    const values = [
        req.body.FULL_NAME,
        req.body.EMAIL,
        req.body.PHONE,
        req.body.DOB
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json("ERROR");
        return res.json(data);
    });
});

app.put('/update/:UID', (req, res) => {
    const UID = req.params.UID;

    // Fetch current values from database
    const fetchSql = "SELECT FULL_NAME, EMAIL, DOB FROM users WHERE UID = ?";
    db.query(fetchSql, [UID], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get current values
        const currentValues = result[0];

        // Use new values if provided, otherwise use current values
        const FULL_NAME = req.body.FULL_NAME || currentValues.FULL_NAME;
        const EMAIL = req.body.EMAIL || currentValues.EMAIL;
        const DOB = req.body.DOB || currentValues.DOB;

        const updateSql = "UPDATE users SET FULL_NAME = ?, EMAIL = ?, DOB = ? WHERE UID = ?";
        db.query(updateSql, [FULL_NAME, EMAIL, DOB, UID], (err, data) => {
            if (err) return res.status(500).json({ error: "Internal Server Error" });
            return res.status(200).json({ message: "User updated successfully" });
        });
    });
});


app.delete('/users/:UID', (req, res) => {
    const sql = "DELETE FROM users WHERE UID= ?";
    const values = [
        req.body.FULL_NAME,
        req.body.EMAIL,
        req.body.DOB
    ];
    const UID= req.params.UID;

    db.query(sql, [UID], (err, data) => {
        if (err) return res.json("ERROR");
        return res.json(data);
    });
});


app.get('/search', (req, res) => {
    const searchQuery = req.query.query;
    let sql = "SELECT * FROM users WHERE FULL_NAME LIKE ? OR PHONE LIKE ?";
    const values = [`%${searchQuery}%`, `%${searchQuery}%`];

    db.query(sql, values, (err, data) => {
        if (err) return res.json("ERROR");
        return res.json(data);
    });
});




app.listen(8081, () => {
    console.log("listening");
})
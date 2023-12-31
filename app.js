const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 4000;

// Database configuration
const pool = new Pool({
  // developement
  user: "postgres",
  host: "localhost",
  database: "landing_db",
  password: "postgres",
  port: 5432,

  // production
  // type: "postgres",
  // host: process.env.HOSTNAME,
  // port: 5432,
  // username: process.env.USERNAME,
  // password: process.env.PASSWORD,
  // database: process.env.DATABASE_NAME,
  // synchronize: true,
});

app.use(express.json());

// Endpoint to store user details
app.post("/users", async (req, res) => {
  const { name, email, mobile } = req.body;
  console.log("body", req.body);
  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO users (name, email, mobile) VALUES ($1, $2, $3) RETURNING *",
      [name, email, mobile]
    );

    res.json({ ...result.rows[0], test: "1" });
  } finally {
    client.release();
  }
});

// Endpoint to fetch user details
app.get("/users", async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
  } finally {
    client.release();
  }
});

// End point  to get  user details by id
app.get("/users-by-id/:id", async (req, res) => {
  console.log(req.params);
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT * FROM users WHERE ID = ${req.params.id}`
    );
    res.json(result.rows);
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

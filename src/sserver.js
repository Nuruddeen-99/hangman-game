const express = require('express');
const app = express();
const cors = require('cors'); // Cross-Origin Resource Sharing (CORS)
const bodyParser = require('body-parser'); // Import body-parser to parse JSON data

app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my database',
});

app.post('/api/signup', (req, res) => {

  const { username, password } = req.body;
  const sql = 'INSERT INTO login (username, password) VALUES (?, ?)';
  connection.query(sql, [username, password], (error, results) => {
    if (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ message: 'Error registering user' });
    }
    return res.json({ message: 'User registered successfully' });
  });
});


app.post('/api/home', (req, res) => {
	const { username, password } = req.body;
 connection.query('SELECT * FROM login', (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return;
      }

      let matchFound = false;

      for (const row of results) {
        const euser = row.Username
        const epass = row.Password;

        if (username === euser && password === epass) {
          matchFound = true;
		  return res.json({ message: 'User confirmed' });
          break;
        }
      }

      if (matchFound) {
        console.log('User logged in successfully');
		connection.end();
      } else {
	   return res.status(203).json({ message: 'Username/Password Error' });
       console.log('Username and Password do not match');
      }
         
    });
  });

// Start the Express.js server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

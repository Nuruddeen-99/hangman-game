const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const loginSchema = new mongoose.Schema({ username: String, password: String });
const Login = mongoose.model('Login', loginSchema);

mongoose.connect('mongodb+srv://nurudeen3099:nuruddeen@hngmn.t3ygn2z.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connected successfully to server'))
  .catch(err => console.error('An error occurred connecting to MongoDB: ', err));

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  const user = new Login({ username, password });

  user.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/api/home', (req, res) => {
  const { username, password } = req.body;

  Login.findOne({ username, password })
    .then(user => {
      if (!user) {
        return res.status(203).json('Error: User not found');
      }
      res.json('User found!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Don't forget to start your server!
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
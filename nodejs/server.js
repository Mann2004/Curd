const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Add this line

const server = express();
server.use(bodyParser.json());
server.use(cors()); // Add this line

// Establish the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbsmschool',
});

db.connect((error) => {
  if (error) {
    console.log('Error connecting to DB:', error);
  } else {
    console.log('Successfully connected to DB');
  }
});

// Establish the Port
server.listen(8085, (error) => {
  if (error) {
    console.log('Error....!!!!');
  } else {
    console.log('Server started on port 8085');
  }
});

// Create the Records
server.post('/api/student/add', (req, res) => {
  const { stname, course, fee } = req.body;
  if (!stname || !course || !fee) {
    return res.status(400).send({ status: false, message: 'All fields are required' });
  }

  const details = { stname, course, fee };
  const sql = 'INSERT INTO student SET ?';

  db.query(sql, details, (error) => {
    if (error) {
      console.log('Error adding student:', error);
      res.status(500).send({ status: false, message: 'Student creation failed' });
    } else {
      res.status(201).send({ status: true, message: 'Student created successfully' });
    }
  });
});

// View the Records
server.get('/api/student', (req, res) => {
  const sql = 'SELECT * FROM student';
  db.query(sql, (error, result) => {
    if (error) {
      console.log('Error fetching students:', error);
      res.status(500).send({ status: false, message: 'Error fetching students' });
    } else {
      res.status(200).send({ status: true, data: result });
    }
  });
});

// Search the Records
server.get('/api/student/:id', (req, res) => {
  const studentid = req.params.id;
  const sql = 'SELECT * FROM student WHERE id = ?';
  db.query(sql, [studentid], (error, result) => {
    if (error) {
      console.log('Error fetching student:', error);
      res.status(500).send({ status: false, message: 'Error fetching student' });
    } else {
      res.status(200).send({ status: true, data: result });
    }
  });
});

// Update the Records
server.put('/api/student/update/:id', (req, res) => {
  const { stname, course, fee } = req.body;
  const studentid = req.params.id;
  const sql = 'UPDATE student SET stname = ?, course = ?, fee = ? WHERE id = ?';

  db.query(sql, [stname, course, fee, studentid], (error, result) => {
    if (error) {
      console.log('Error updating student:', error);
      res.status(500).send({ status: false, message: 'Student update failed' });
    } else {
      res.status(200).send({ status: true, message: 'Student updated successfully' });
    }
  });
});

// Delete the Records
server.delete('/api/student/delete/:id', (req, res) => {
  const studentid = req.params.id;
  const sql = 'DELETE FROM student WHERE id = ?';
  db.query(sql, [studentid], (error) => {
    if (error) {
      console.log('Error deleting student:', error);
      res.status(500).send({ status: false, message: 'Student deletion failed' });
    } else {
      res.status(200).send({ status: true, message: 'Student deleted successfully' });
    }
  });
});

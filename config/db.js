const mysql = require('mysql2');
require('dotenv').config();

// Database connection with error handling
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Handle connection
connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Database Config:', {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'school_management',
    });
    // Retry connection after 3 seconds
    setTimeout(() => {
      console.log('Retrying database connection...');
      connection.connect();
    }, 3000);
  } else {
    console.log('✅ MySQL Connected successfully');
  }
});

// Handle connection errors during runtime
connection.on('error', (err) => {
  console.error('❌ Database error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Connection lost. Reconnecting...');
    connection.connect();
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.log('Too many connections. Retrying...');
    setTimeout(() => {
      connection.connect();
    }, 3000);
  }
});

module.exports = connection;
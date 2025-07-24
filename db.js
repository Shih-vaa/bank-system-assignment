// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bank.db');

db.serialize(() => {
  const fs = require('fs');
  const schema = fs.readFileSync('schema.sql', 'utf-8');
  db.exec(schema);
});

module.exports = db;

const Database = require('better-sqlite3');
const db = new Database('invoices.db');

module.exports = db;
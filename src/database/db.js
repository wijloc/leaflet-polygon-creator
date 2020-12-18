const Database = require('sqlite-async');
const path = require('path');

function execute(db){    
    return db.exec(`
        CREATE TABLE IF NOT EXISTS polygons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,            
            name TEXT,
            area TEXT
        );
    `).then(() => {
        return db.exec(`
        CREATE TABLE IF NOT EXISTS points (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          polygon_id INTEGER,
          lat TEXT,
          lng TEXT
      );
        `)
    })
}

module.exports = Database.open(path.join(__dirname, 'database.sqlite')).then(execute) 
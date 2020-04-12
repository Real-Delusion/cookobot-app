const sqlite3 = require('sqlite3').verbose()
let db

// Connect to db file
function connect() {
    if (!db || !db.open) {
        db = new sqlite3.Database('database.db')
    }
    return db
}

// Get user by id
export const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        let db = connect()
        let query = `select * from users where user_id = ?`;

        db.get(query, [id], (err, rows) => {
            if (err) reject(err)
            resolve(rows || [])
        })
    })
}
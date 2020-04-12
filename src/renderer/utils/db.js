const sqlite3 = require('sqlite3').verbose()
let db

function connect() {
    if (!db || !db.open) {
        db = new sqlite3.Database('base.db')
    }
    console.log(db)
    return db
}

export const getUserById = () => {
    return new Promise((resolve, reject) => {
        let db = connect()
        db.all('select * from users', (err, rows) => {
            if (err) reject(err)
            resolve(rows || [])
        })
    })
}
import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
const sqlite3 = require('sqlite3').verbose()

let db
const dbPath = path.join(remote.app.getPath('appData'), '/cookobot/database.db');
//console.log("Database path: ",dbPath)

// Check for db file
try {
    if (!fs.existsSync(dbPath)) {
        // Create if does not exist
        fs.mkdirSync(path.join(remote.app.getPath('appData'),'/cookobot'));
        initDataBase()
    }
} catch (err) {
    console.error(err)
}

// Init database
function initDataBase() {
    let db = connect()
    db.serialize(() => {
        db.run(`CREATE TABLE "users" (
            "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
            "user_id"	TEXT NOT NULL,
            "name"	TEXT NOT NULL,
            "user_type"	INTEGER NOT NULL
        )`)
        db.run(`INSERT INTO "main"."users" ("id", "user_id", "name", "user_type") VALUES ('1', '0000', 'Admin', '1')`)
        db.run(`INSERT INTO "main"."users" ("id", "user_id", "name", "user_type") VALUES ('2', '1234', 'User', '0')`)
    })
}

// Connect to db file
function connect() {
    if (!db || !db.open) {
        db = new sqlite3.Database(dbPath)
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
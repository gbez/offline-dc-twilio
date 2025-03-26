require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database(`./offline.db`, (err) => {
    if(err) {
        console.log(err);
    }
});


async function getAllWeather() {
    var sql = "SELECT * FROM weather";
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
}

module.exports = {
    createOneWeather,
    getAllWeather
}
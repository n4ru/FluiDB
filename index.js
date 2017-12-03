/*

jData by n4ru

*/

const fs = require('fs');
const databaseObj = {};

databaseObj._name = null;

databaseObj._use = (database) => {
    if (!database)
        database = 'db';
    databaseObj._name = database;
    if (fs.existsSync(database + '.json')) {
        fs.readFile(database + '.json', 'utf-8', (err, data) => {
            Object.assign(databaseObj, JSON.parse(data))
            if (err) throw err;
        });
    } else {
        fs.writeFile(database + '.json', JSON.stringify(databaseObj), (err) => {
            if (err) throw err;
        });
    }
}

const handler = {
    set(target, key, value) {
        target[key] = value;
        if (!databaseObj._name && !database)
            if (databaseObj._name && !database)
                database = 'db';
        fs.writeFile(database + '.json', JSON.stringify(databaseObj), (err) => {
            if (err) throw err;
        });
    },
};

var db = new Proxy(databaseObj, handler);

module.exports = db;
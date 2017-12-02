/*

jData by n4ru

*/

var fs = require('fs');
var databaseObj = {};


databaseObj._save = (database) => {
    return new Promise((res, rej) => {
        if (!databaseObj._name && !database)
            rej("No database specified.");
        if (databaseObj._name && !database)
            database = databaseObj._name;
        fs.writeFile(database + '.json', JSON.stringify(databaseObj), (err) => {
            if (err)
                rej(err);
            else
                res();
        });
    });
};

databaseObj._use = (database, callback) => {
    return new Promise((res, rej) => {
        if (!database)
            rej("No database specified.")
        databaseObj._name = database;
        if (fs.existsSync(database + '.json')) {
            fs.readFile(database + '.json', 'utf-8', (err, data) => {
                console.log('reading file')
                Object.assign(databaseObj, JSON.parse(data))
                if (err) throw err;
                res();
            });
        } else {
            fs.writeFile(database + '.json', JSON.stringify(databaseObj), (err) => {
                if (err)
                    rej(err);
                else
                    res();
            });
        }
    });
}

const handler = {
    set(target, key, value) {
        target[key] = value;
        databaseObj.save();
    },
};

var db = new Proxy(databaseObj, handler);

module.exports = db;
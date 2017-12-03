/*

jData by n4ru

*/

var fs = require('fs');
var databaseObj = {};
var _name = null;


databaseObj._save = (database) => {
    return new Promise((res, rej) => {
        if (!_name && !database)
            rej("No database specified.");
        if (_name && !database)
            database = _name;
        fs.writeFile(database + '.json', JSON.stringify(databaseObj), (err) => {
            if (err)
                rej(err);
            else
                res();
        });
    });
};

databaseObj._use = (database) => {
    return new Promise((res, rej) => {
        if (!database)
            rej("No database specified.")
        _name = database;
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
        databaseObj._save();
    },
};

var db = new Proxy(databaseObj, handler);

module.exports = db;
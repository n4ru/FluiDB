/*

jData by n4ru

*/

var fs = require('fs');
var db = {};

db.name = null;

db.save = (database) => {
    return new Promise((res, rej) => {
        if (!db.name && !database)
            rej("No database specified.");
        if (database)
            db.name = database;
        fs.writeFile(database + '.json', JSON.stringify(db), (err) => {
            if (err)
                rej(err);
            else
                res();
        });
    });
};

db.use = (database, callback) => {
    return new Promise((res, rej) => {
        if (!database)
            rej("No database specified.")
        db.name = database;
        if (fs.existsSync(database + '.json')) {
            res();
        } else {
            fs.writeFile(database + '.json', JSON.stringify(db), (err) => {
                if (err)
                    rej(err);
                else
                    res();
            });
        }
    });
}

db.write = function(config, callback) {};

db.read = function(config, callback) {};

module.exports = db;
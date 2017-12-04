const fs = require('fs');

class database {
    constructor(database, object) {
        typeof database === "object" && (object = database);
        this.file = (typeof database === "string" ? database : 'db') + '.json';
        object && fs.writeFileSync(this.file, JSON.stringify(object));
        this.db = fs.existsSync(this.file) ? JSON.parse(fs.readFileSync(this.file, 'utf-8')) : {};
        return new Proxy(this.db, this);
    }

    set(target, key, value) {
        this.db[key] = value;
        fs.writeFileSync(this.file, JSON.stringify(this.db));
    }

}

module.exports = database;
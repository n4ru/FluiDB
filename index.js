const fs = require('fs');

class database {
    constructor(database, object) {
        this.name = database;
        if (object) {
            this.db = object;
            fs.writeFileSync(this.name, JSON.stringify(object));
        } else {
            if (fs.existsSync(database)) {
                this.db = JSON.parse(fs.readFileSync(this.name, 'utf-8'));
            } else {
                this.db = {};
            }
        }
        return new Proxy(this.db, this);
    }

    set(target, key, value) {
        this.db[key] = value;
        fs.writeFileSync(this.name, JSON.stringify(this.db));
    }

}

module.exports = database;
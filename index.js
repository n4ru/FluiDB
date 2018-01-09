const fs = require('fs');

class database {
    constructor(database, object) {
        typeof database === "object" && (object = database);
        this.file = (typeof database === "string" ? database : 'db') + '.json';
        object && fs.writeFileSync(this.file, JSON.stringify(object));
        this.db = fs.existsSync(this.file) ? JSON.parse(fs.readFileSync(this.file, 'utf-8')) : {};
        return this.proxy(this.db);
    }

    proxy(obj) {
        const _nref = this
        return new Proxy(obj, {
            get: function(target, k) {
                if (_nref.isObject(target[k])) return _nref.proxy(target[k])
                return target[k]
            },
            set: function(target, k, v) {
                target[k] = v
                _nref.dump();
                return target[k]
            }
        });
    }

    isObject(v) {
        return typeof v === 'object'
    }

    dump() {
        fs.writeFileSync(this.file, JSON.stringify(this.db, null, 4), () => {});
    }
}

module.exports = database;
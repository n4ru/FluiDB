const fs = require('fs')
const path = require('path')
const os = require('os')
const JSONB = require('json-buffer')

module.exports = class FluiDB {
    constructor (uri, opts) {
        this.opts = Object.assign(
            {
                serialize: JSONB.stringify,
                deserialize: JSONB.parse
            },
            opts
        )

        if (!this.opts.store) {
            this.opts.store = typeof uri === 'string'
                ? uri
                : path.resolve(os.homedir(), 'fluidb.json')
        }

        if (this.isObject(uri)) {
            fs.writeFileSync(this.opts.store, this.opts.serialize(uri))
        }

        this.store = fs.existsSync(this.opts.store)
            ? this.opts.deserialize(fs.readFileSync(this.opts.store, 'utf-8'))
            : {}

        return this.proxy(this.store)
    }

    proxy (obj) {
        const _nref = this

        return new Proxy(obj, {
            get (target, prop) {
                if (_nref.isObject(target[prop])) {
                    return _nref.proxy(target[prop])
                }

                return target[prop]
            },
            set (target, prop, value) {
                target[prop] = value

                _nref.dump()

                return target[prop]
            },
            has (target, prop) {
                return prop in target
            },
            deleteProperty (target, prop) {
                delete target[prop]

                _nref.dump()

                return target
            }
        })
    }

    isObject (value) {
        return typeof value === 'object'
    }

    dump () {
        fs.writeFileSync(this.opts.store, this.opts.serialize(this.store, null, 4), (err, data) => {
            if (err) {
                console.log(err)
            }

            console.log(data)
        })
    }
}

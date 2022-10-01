const fs = require('fs')
const path = require('path')
const os = require('os')
const JSONB = require('json-buffer')

// dump bigints as strings
BigInt.prototype.toJSON = function () { return this.toString() + "n" }

module.exports = class FluiDB {
	constructor(uri, opts, readOnly) {
		if (opts === true || uri === true) this.readOnly = true;
		this.opts = Object.assign(
			{
				serialize: JSON.stringify,
				deserialize: JSONB.parse
			},
			opts
		)

		if (!this.opts.store) {
			this.opts.store = path.resolve(process.cwd(), (typeof uri === 'string' ? uri : 'db') + '.json')
		}

		if (!(readOnly === true)) {
			if (this.isObject(uri)) {
				fs.writeFileSync(this.opts.store, this.opts.serialize(uri, null, 4), 'utf-8')
			} else if (this.isObject(opts)) {
				fs.writeFileSync(this.opts.store, this.opts.serialize(opts, null, 4), 'utf-8')
			}
		}

		this.store = fs.existsSync(this.opts.store)
			? this.opts.deserialize(fs.readFileSync(this.opts.store))
			: {}

		return this.proxy(this.store)
	}

	proxy(obj) {
		const _nref = this

		return new Proxy(obj, {
			get(target, prop) {
				if (_nref.isObject(target[prop]))
					return _nref.proxy(target[prop])
				// parse BigInts
				if (typeof target[prop] === "string" && /^\d+n$/.test(target[prop])) return BigInt(target[prop].slice(0, -1))
				else return target[prop]
			},
			set(target, prop, value) {

				target[prop] = value

				_nref.dump()

				return target[prop]
			},
			has(target, prop) {
				return prop in target
			},
			deleteProperty(target, prop) {
				delete target[prop]

				_nref.dump()

				return target
			},
		})
	}

	isObject(value) {
		return typeof value === 'object'
	}

	dump() {
		if (!(this.readOnly === true)) fs.writeFileSync(this.opts.store, this.opts.serialize(this.store, null, 4), 'utf-8')
	}
}

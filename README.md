# FluiDB

> JSON objects as an invisible flat file database with low overhead.

### Installation

Install via npm.

`npm install fluidb`

### Example

Normally, when using and storing JSON data in a file, you do something like this.

```
const fs = require('fs'),
jsonObj = fs.existsSync(path) ? JSON.parse(fs.readFileSync('./db.json', 'utf-8')) : {};

jsonObj[someKey] = someValue;
fs.writeFileSync("./db.json", JSON.stringify(jsonObj));
```

In the example above, we have to require fs, init our object from scratch or from an existing file, then after updating our object, we have to manually dump it back to the file. Anytime we change or add a property to the object, we need to remember to dump it.

With fluiDB, all we have to do is initialize our object, and we're good to go.

```
const jsonObj = new require('fluidb')();

jsonObj[someKey] = someValue;
```

Loading and handling the file is done invisibly by fluidb, and you never notice you're working with fluidb -- no code has to be rewritten aside from the initialization.  Most importantly, we never have to write back to the file manually. fluiDB takes care of it.

##### Multiple Databases

fluidb takes two arguments -- the database name, and an object you want to initialize it to. If you want to use multiple databases, just initialize it with `new db('someName')`. If you want to both use multiple databases (or a custom filename) and pass an object, you can do that as well using `new db('someName', someObject)`.

##### Clearing Objects
Due to the lack of support for destructors, do *not* clear or reinitialize your object using `jsonObj = {}` -- instead, use `jsonObj = new db({})` or `jsonObj = new db('someName', {})`. 

##### BigInt Support
Starting from `0.3.0`, native big integers are supported through both the native `BigInt` function and integer literals followed by `n`. Please be aware that these are stored as strings in the form `"123n"` because the JSON spec does not support it, and all strings in such format will be parsed as native big integers.

##### Read Only mode
If you pass in `true` as your last argument (in any position), you will get a read-only object that does not dump changes to disk. This is mostly useful for parsing saved JSON with native BigInts stored by fluidb that you don't need to make changes to.

## Security

If you discover a security vulnerability within this package, please send an e-mail to admin@n4ru.it. All security vulnerabilities will be promptly addressed.

## Credits

- [George Kushnir](https://github.com/n4ru)
- [Brian Faust](https://github.com/faustbrian)

## License

[MIT](LICENSE) © [George Kushnir](https://n4ru.it)

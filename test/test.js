const assert = require('assert');
const $ = require('fluidb');
const fs = require('fs');
let db = new $();

describe('FluiDB tests', () => {

    it('should match sample values', () => {
        db["test"] = {
            "key": "value"
        };

        assert.equal(JSON.stringify(db), JSON.stringify(JSON.parse(fs.readFileSync('./db.json', 'utf-8'))));

    });

    it('should be recreated with the passed object', () => {
        db = new $({
            "key": "value"
        })

        assert.equal(JSON.stringify(db), JSON.stringify({
            "key": "value"
        }));
    });

    it('should save if deleted', () => {
        fs.unlinkSync('./db.json');
        db["test"] = "value";

        assert.equal(JSON.stringify(db), JSON.stringify(JSON.parse(fs.readFileSync('./db.json', 'utf-8'))));
    })

    it('should store arrays and sub-arrays', () => {
        db["test"] = [0, 1, 2, 3, 4];
        db["testtwo"] = [
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2]
        ]

        assert.equal(Array.isArray(JSON.parse(fs.readFileSync('./db.json', 'utf-8'))["test"]) && Array.isArray(JSON.parse(fs.readFileSync('./db.json', 'utf-8'))["testtwo"][1]), true);
    })

    it('should store objects and sub-objects', () => {
        db["test"] = {
            "test": {
                "test": "yes"
            }
        };
        db["val"] = "someValue"

        assert.equal(JSON.stringify(db), JSON.stringify(JSON.parse(fs.readFileSync('./db.json', 'utf-8'))));
    })

    it('should allow multiple databases', () => {
        db = new $();
        let db2 = new $('db2');
        db["test"] = "some value";
        db2["test"] = "another value";
        assert.notEqual(JSON.stringify(db), JSON.stringify(db2))
        fs.unlinkSync('./db.json');
        fs.unlinkSync('./db2.json');
    })

});
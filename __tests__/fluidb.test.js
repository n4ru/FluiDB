const fs = require('fs')
const os = require('os')
const path = require('path')
const TestSubject = require('../lib')

const readDatabase = () => new TestSubject(JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'db.json'), 'utf-8')), true);

beforeEach(() => {
	try {
		fs.unlinkSync(path.resolve('db.json'))
	} catch (e) {
		//
	}
})

it('should match sample values', () => {
	const database = new TestSubject()
	database['test'] = { 'key': 'value' }

	expect(database).toEqual(readDatabase())
	
	fs.unlinkSync('db.json')
})

it('should be instantiated with the passed object', () => {
	const object = { 'key': 'value' }
	const database = new TestSubject(object)

	expect(database).toEqual(object)
	
	fs.unlinkSync('db.json')
})

it('should dump if deleted', () => {
	const database = new TestSubject()
	database['test'] = 'value'

	expect(database).toEqual(readDatabase())

	delete database['test']

	expect(database).toEqual(readDatabase())
	
	fs.unlinkSync('db.json')
})

it('should store arrays and sub-arrays', () => {
	const database = new TestSubject()
	database['test'] = [0, 1, 2, 3, 4]
	database['testtwo'] = [
		[0, 1, 2],
		[0, 1, 2],
		[0, 1, 2]
	]

	expect(database).toEqual(readDatabase())
	
	fs.unlinkSync('db.json')
})

it('should store objects and sub-objects', () => {
	const database = new TestSubject()
	database['test'] = {
		'test': {
			'test': 'yes'
		}
	}
	database['val'] = 'someValue'

	expect(database).toEqual(readDatabase())
	
	fs.unlinkSync('db.json')
})

it('should allow multiple databases', () => {
	const database1 = new TestSubject('fluidb1')
	database1['test'] = 'some value for instance 1'

	const database2 = new TestSubject('fluidb2')
	database2['test'] = 'some value for instance 2'

	expect(database1).not.toEqual(database2)

	fs.unlinkSync('fluidb1.json')
	fs.unlinkSync('fluidb2.json')
})

it('should pop properly', () => {
	const database1 = new TestSubject()
	database1['test'] = [1, 2, 3, 4]
	database1['test'].pop()

	expect({ 'test': [1, 2, 3] }).toEqual(readDatabase());

	fs.unlinkSync('db.json')
})

it('should splice properly', () => {
	const database1 = new TestSubject()
	database1['test'] = [1, 2, 3, 4]
	database1['test'].splice(0, 1, 5);

	expect({ 'test': [5, 2, 3, 4] }).toEqual(readDatabase());

	fs.unlinkSync('db.json')
});

it('should handle bigints', () => {
	const database1 = new TestSubject()
	database1['test'] = BigInt(1);

	expect({ 'test': BigInt(1) }).toEqual(readDatabase());

	fs.unlinkSync('db.json')
})

it('should handle bigint literals', () => {
	const database1 = new TestSubject()
	database1['test'] = 1n;

	expect({ 'test': 1n }).toEqual(readDatabase());

	fs.unlinkSync('db.json')
})

it('should not save in readonly mode', () => {
	(new TestSubject())['test'] = 1n;

	const readOnly = new TestSubject(true);
	readOnly['test'] = 2n;

	expect(readOnly['test']).not.toEqual((new TestSubject())['test']);

	fs.unlinkSync('db.json')
})
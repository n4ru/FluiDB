const fs = require('fs')
const os = require('os')
const path = require('path')
const TestSubject = require('../lib')

const readDatabase = () => JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'utf-8'))

beforeEach(() => {
	try {
		fs.unlinkSync('__tests__\\db.json')
	} catch (e) {
		//
	}
})

it('should match sample values', () => {
	const database = new TestSubject('..\\__tests__\\db')
	database['test'] = { 'key': 'value' }

	expect(database).toEqual(readDatabase())
})

it('should be instantiated with the passed object', () => {
	const object = { 'key': 'value' }
	const database = new TestSubject(object)

	expect(database).toEqual(object)
})

it('should dump if deleted', () => {
	const database = new TestSubject('..\\__tests__\\db')
	database['test'] = 'value'

	expect(database).toEqual(readDatabase())

	delete database['test']

	expect(database).toEqual(readDatabase())
})

it('should store arrays and sub-arrays', () => {
	const database = new TestSubject('..\\__tests__\\db')
	database['test'] = [0, 1, 2, 3, 4]
	database['testtwo'] = [
		[0, 1, 2],
		[0, 1, 2],
		[0, 1, 2]
	]

	expect(database).toEqual(readDatabase())
})

it('should store objects and sub-objects', () => {
	const database = new TestSubject('..\\__tests__\\db')
	database['test'] = {
		'test': {
			'test': 'yes'
		}
	}
	database['val'] = 'someValue'

	expect(database).toEqual(readDatabase())
})

it('should allow multiple databases', () => {
	const database1 = new TestSubject('..\\__tests__\\fluidb1')
	database1['test'] = 'some value for instance 1'

	const database2 = new TestSubject('..\\__tests__\\fluidb2')
	database2['test'] = 'some value for instance 2'

	expect(database1).not.toEqual(database2)

	fs.unlinkSync('__tests__\\fluidb1.json')
	fs.unlinkSync('__tests__\\fluidb2.json')
})

const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('Enter db password as argument...')
    process.exit(1)
}

const pw = process.argv[2]

const url = `mongodb+srv://emiabo:${pw}@fso.afl8foc.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(person.name, ' ', person.number)
        })
        mongoose.connection.close()
      })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const newPerson = new Person({
        name: name,
        number: number
    })
    
    newPerson.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook.`)
        mongoose.connection.close()
    })
}
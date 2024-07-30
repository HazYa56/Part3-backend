const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://yyyyagoub:${password}@firstcluster.2ltdbfm.mongodb.net/personsApp?retryWrites=true&w=majority&appName=firstCluster`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)


if (Boolean(process.argv[3]) && Boolean(process.argv[4])) {
    const person = new Person({})
    person.name = process.argv[3];
    person.number = process.argv[4];
    person
        .save()
        .then(result => {
            console.log(`added ${person.name} number ${person.number} to phonebook`)
            mongoose.connection.close()
        }
    )
} else {
    console.log("Phonebook :")
    Person
        .find({})
        .then(result => {
            result.forEach(contact => {
                console.log(contact.name, contact.number)
                mongoose.connection.close()
            })
        }
    )
}
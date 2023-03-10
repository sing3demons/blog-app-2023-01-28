const { connect, set } = require('mongoose')

const connectDB = async () => {
  try {
    set('strictQuery', false)
    const conn = await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      dbName: process.env.MONGO_DATABASE,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB

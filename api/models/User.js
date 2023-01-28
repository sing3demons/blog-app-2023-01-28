const { Schema, model } = require('mongoose')
const { genSalt, hash, compare } = require('bcryptjs')

const UserSchema = new Schema(
  {
    username: { type: String, required: true, min: 4, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.encryptPassword = async function (password) {
  const salt = await genSalt(10)
  return await hash(password, salt)
}

UserSchema.methods.checkPassword = async function (password) {
  return await compare(password, this.password)
}

const UserModel = model('User', UserSchema)

module.exports = UserModel

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Schema, model } from 'mongoose'
import type { UserType } from 'schemas/auth.js'

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true
})

export const authModel = model('users', userSchema)

export class UserModel {
  static async find () {
    return await authModel.find()
  }

  static async create (user: UserType) {
    return await authModel.create(user)
  }

  static async registered ({ email, username }: Omit<UserType, 'password'>) {
    const isRegistered = await authModel.exists({ $or: [{ email }, { username }] })
    return isRegistered
  }

  static async verifyUser ({ email }: Omit<UserType, 'username' | 'password'>) {
    const existUser = await authModel.exists({ email })
    if (existUser === null) return false
    const user = await authModel.findById(existUser._id).select('password')
    return user?.password
  }
}

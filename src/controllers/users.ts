import pkg from 'bcryptjs'
import { type Request, type Response } from 'express'
import { UserModel } from '../models/auth.js'
import type { UserRegisterType, UserType } from '../schemas/auth.js'
import { createToken } from '../utils/tokens.js'

const { compare, genSalt, hash } = pkg
export const getAll = async (_req: Request, res: Response) => {
  const users = await UserModel.find()

  res.json({
    success: true,
    message: 'Retrieved all users.',
    data: users
  })
}

export const signup = async (req: Request, res: Response) => {
  try {
    const userData = req.body as UserType
    const isUserRegister = await UserModel.containsThat(userData)
    if (isUserRegister !== null) {
      return res.status(409).json({ success: false, errors: 'Email already registered' })
    }

    const salt = await genSalt(10)
    const hashPassword = await hash(userData.password, salt)
    const user = { ...userData, password: hashPassword }
    await UserModel.create(user)
    createToken(res, user.email)
  } catch (err) {
    res.status(500).json({ success: false, errors: 'Internal Server Error' })
  }
}

export const signin = async (req: Request, res: Response) => {
  try {
    const userData = req.body as UserRegisterType
    const existUser = await UserModel.verification(userData)

    if (existUser === false || typeof existUser === 'undefined') {
      return res.status(400).json({ success: false, errors: 'error during login verification' })
    }

    const isValidPass = await compare(userData.password, existUser)
    if (!isValidPass) {
      return res.status(401).json({ success: false, errors: 'information in either field is invalid' })
    }

    createToken(res, userData.email)
  } catch (err) {
    res.status(500).json({ success: false, errors: 'Internal Server Error' })
  }
}

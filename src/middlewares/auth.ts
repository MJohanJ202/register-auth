import type { NextFunction, Request, Response } from 'express'
import JWT from 'jsonwebtoken'
import { UserModel } from '../models/auth.js'
import { userRegisterValidation, userValidation } from '../schemas/auth.js'

const getItemCookies = (itemName: string, cookies: string) => {
  const cookieSeparation = cookies?.split(';')
  const findItem = cookieSeparation?.find(item => item.trim().startsWith(`${itemName}=`))
  return findItem
}

async function verifyCookie (req: Request): Promise<boolean> {
  try {
    const { cookie } = req.headers
    if (cookie == null) return false

    const jwtCookie = getItemCookies('jwt', cookie)
    const token = jwtCookie?.slice(4)
    const secret = process.env.JWT_SIGN
    if ((token == null) || (secret == null)) return false

    const isAuthorized = JWT.verify(token, secret)
    if (typeof isAuthorized === 'string') return false

    const { email } = isAuthorized
    const result = await UserModel.verification({ email })
    return Boolean(result)
  } catch (error) {
    return false
  }
}

async function onlyAuthPassage (req: Request, res: Response, next: NextFunction) {
  const isLogging = await verifyCookie(req)
  if (!isLogging) {
    res.redirect('/signin')
    return null
  }

  next()
}

async function allowPublicAccess (req: Request, res: Response, next: NextFunction) {
  const isLogging = await verifyCookie(req)
  if (!isLogging) {
    next()
    return null
  }

  res.redirect('/blog')
  next()
}

async function userDataValidation (req: Request, res: Response, next: NextFunction) {
  const { body } = req
  const validate = userValidation(body)

  if (!validate.success) {
    return res.status(400).json({ success: false, errors: validate.error })
  }

  req.body = validate.data
  next()
}

async function userPartialValidation (req: Request, res: Response, next: NextFunction) {
  const { body } = req
  const validate = userRegisterValidation(body)

  if (!validate.success) {
    return res.status(400).json({ success: false, errors: validate.error })
  }

  req.body = validate.data
  next()
}

export {
  allowPublicAccess,
  onlyAuthPassage,
  userDataValidation,
  userPartialValidation
}

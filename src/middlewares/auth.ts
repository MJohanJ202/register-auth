import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { UserModel } from 'models/auth.js'

async function verifyCookie (req: Request): Promise<boolean> {
  try {
    const { cookie } = req.headers
    const jwtToken = cookie?.split(';')
      .find((cItem): boolean => cItem.trim().startsWith('jwt='))
    const token = jwtToken?.slice(4)
    const secret = process.env.JWT_SIGN
    if ((token == null) || (secret == null)) return false

    const isAuthorized = verify(token, secret)
    if (typeof isAuthorized === 'string') return false

    const { email } = isAuthorized
    const result = await UserModel.verifyUser({ email })
    return Boolean(result)
  } catch (error) {
    return false
  }
}

async function onlyAuthPassage (req: Request, res: Response, next: NextFunction) {
  const isLogging = await verifyCookie(req)
  if (!isLogging) {
    res.status(401).redirect('/signin')
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

  res.status(401).redirect('/blog')
  next()
}

export {
  allowPublicAccess,
  onlyAuthPassage
}

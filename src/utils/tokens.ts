import { randomBytes } from 'crypto'
import { type Response } from 'express'
import JWT from 'jsonwebtoken'

const convertDays = (expiration: number): number => {
  return expiration * 24 * 60 * 60 * 1000
}

const createExpiresCookie = (cookieExpires: number) => {
  const timeStamp = Date.now() + convertDays(cookieExpires) // set cookie to expire in a week
  return new Date(timeStamp)
}

export const createToken = (res: Response, email: string) => {
  const payload = {
    email,
    id: randomBytes(64).toString('hex')
  }
  const firmToken = process.env.JWT_SIGN ?? ''
  const expirationToken = process.env.EXPIRATION_JWT ?? '3d'
  const cookieExpires = Number.parseInt(process.env.COOKIE_EXPIRATION_JWT ?? '1')

  const userToken = JWT.sign(payload, firmToken, { expiresIn: expirationToken })
  const cookieOptions = {
    expires: createExpiresCookie(cookieExpires),
    path: '/'
  }

  res.cookie('jwt', userToken, cookieOptions).send({
    success: true,
    message: 'You have successfully logged',
    redirect: '/'
  })
}

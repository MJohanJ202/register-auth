// import express, { type Application, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import express, {
  type Application,
  type Request,
  type Response
} from 'express'
import { sign } from 'jsonwebtoken'
import { allowPublicAccess, onlyAuthPassage } from 'middlewares/auth.js'
import { UserModel } from 'models/auth.js'
import { randomBytes } from 'node:crypto'
import { resolve } from 'node:path'
import { userRegisterValidation, userValidation } from 'schemas/auth.js'

// Boot express
export const app: Application = express()

const convertDays = (expiration: number): number => {
  return expiration * 24 * 60 * 60 * 1000
}

const createToken = (res: Response, email: string) => {
  const payload = {
    email,
    id: randomBytes(64).toString('hex')
  }
  const firmToken = process.env.JWT_SIGN ?? ''
  const expirationToken = process.env.EXPIRATION_JWT ?? '3d'
  const userToken = sign(payload, firmToken, { expiresIn: expirationToken })
  const cookieExpires = Number.parseInt(process.env.COOKIE_EXPIRATION_JWT ?? '1')
  const cookieOptions = {
    expires: new Date(Date.now() + convertDays(cookieExpires)),
    path: '/'
  }

  res.cookie('jwt', userToken, cookieOptions)
  res.send({
    success: true,
    message: 'You have successfully logged',
    redirect: '/'
  })
}

//  Setup middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.static(resolve('./', 'public')))

// routes
app.get('/signin', allowPublicAccess, (_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/signin.html'))
})

app.get('/signup', allowPublicAccess, (_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/signup.html'))
})

app.get('/blog', onlyAuthPassage, (_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/blog/blog.html'))
})

app.get('/about', (_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/about/about.html'))
})

app.get('/api/signup', async (_req: Request, res: Response) => {
  const users = await UserModel.find()
  res.json({
    status: 'success',
    message: 'Retrieved all users.',
    data: users
  })
})

app.post('/api/signup', async (req: Request, res: Response) => {
  const { body } = req
  const validate = userValidation(body)

  if (!validate.success) {
    return res.status(400).json({ errors: validate.error })
  }

  try {
    const isUserRegister = await UserModel.registered(validate.data)
    if (isUserRegister !== null) {
      return res.status(409).json({ errors: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(validate.data.password, salt)
    const user = { ...validate.data, password: hashPassword }
    await UserModel.create(user)
    createToken(res, user.email)
  } catch (err) {
    console.error('[ERROR] Failed to create a new user :', err)
    res.status(500).json({ errors: 'Internal Server Error' })
  }
})

app.post('/api/signin', async (req: Request, res: Response) => {
  const { body } = req
  const validate = userRegisterValidation(body)

  if (!validate.success) {
    return res.status(400).json({ errors: validate.error })
  }

  try {
    const existUser = await UserModel.verifyUser(validate.data)

    if (existUser === false || typeof existUser === 'undefined') {
      return res.status(400).json({ errors: 'error during login verification' })
    }

    const isValidPass = await bcrypt.compare(validate.data.password, existUser)
    if (!isValidPass) {
      return res.status(401).json({ errors: 'information in either field is invalid' })
    }

    createToken(res, validate.data.email)
  } catch (err) {
    console.error('[ERROR] Failed to create a new user :', err)
    res.status(500).json({ errors: 'Internal Server Error' })
  }
})

// Application routing
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello Everyone 🤖 🎤 ' })
})

app.use((_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/404.html'))
})

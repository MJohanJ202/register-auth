import cookieParser from 'cookie-parser'
import type { Application, Request, Response } from 'express'
import express from 'express'
import { resolve } from 'node:path'
import authRoute from './routes/auth.js'
import pagesRoute from './routes/pages.js'
import userRoute from './routes/users.js'

// Boot express
export const app: Application = express()

//  Setup middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.static(resolve('./', 'public')))

// routes
app.use('/', authRoute)
app.use('/api/', userRoute)
app.use(pagesRoute)

// Application routing
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello Everyone 🤖 🎤 ' })
})
app.use((_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/404.html'))
})

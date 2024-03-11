// import express, { type Application, type Request, type Response } from 'express'
import express, { type Application, type Request, type Response } from 'express'
import { resolve } from 'node:path'

// Boot express
export const app: Application = express()

//  Setup middleware
app.use(express.json())
app.use(express.static(resolve('./', 'public')))



app.get('/login', (_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/login.html'))
})
app.get('/signup', (_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/signup.html'))
})
// Application routing
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello Everyone 🤖 🎤 ' })
})

app.use((_req: Request, res: Response) => {
  res.status(200).sendFile(resolve('./', 'public/404.html'))
})

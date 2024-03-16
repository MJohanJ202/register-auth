import { type Request, type Response } from 'express'
import { resolve } from 'path'

export const signin = (_req: Request, res: Response) => {
  res.sendFile(resolve('./', 'public/signin.html'))
}

export const signup = (_req: Request, res: Response) => {
  res.sendFile(resolve('./', 'public/signup.html'))
}

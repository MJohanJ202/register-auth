import { Router, type Request, type Response } from 'express'
import { onlyAuthPassage } from '../middlewares/auth.js'
import { resolve } from 'path'

const router = Router()

router.get('/blog', onlyAuthPassage, (_req: Request, res: Response) => {
  res.sendFile(resolve('./', 'public/blog/blog.html'))
})

router.get('/about', (_req: Request, res: Response) => {
  res.sendFile(resolve('./', 'public/about/about.html'))
})

export default router

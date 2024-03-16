import { signin, signup } from '../controllers/auth.js'
import { Router } from 'express'
import { allowPublicAccess } from '../middlewares/auth.js'

const rooter = Router()

rooter.get('/signin', allowPublicAccess, signin)
rooter.get('/signup', allowPublicAccess, signup)

export default rooter

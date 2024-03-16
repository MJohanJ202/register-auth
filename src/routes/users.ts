import { Router } from 'express'
import { getAll, signin, signup } from '../controllers/users.js'
import { userDataValidation, userPartialValidation } from '../middlewares/auth.js'

const rooter = Router()

rooter.get('/users', getAll)
rooter.post('/signup', userDataValidation, signup)
rooter.post('/signin', userPartialValidation, signin)

export default rooter

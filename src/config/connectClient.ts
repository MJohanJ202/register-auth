import { connect } from 'mongoose'

export const createConnection = async (): Promise<null> => {
  try {
    await connect(process.env.DB_URI ?? '')
    console.log('Connected to MongoDB ')
    return null
  } catch (err) {
    console.error('Error connecting to DB:', err)
    return null
  }
}

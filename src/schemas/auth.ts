import z from 'zod'

const regex = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  username: /^[a-zA-Z0-9@._-]{3,32}$/,
  password: /^(?=.*[a-zA-Z\d])[A-Za-z\d@$!%*?& ]{8,32}$/
}

const userSchema = z.object({
  username: z.string().min(8).max(32).regex(regex.username),
  email: z.string().email({ message: 'Invalid Email' }).regex(regex.email),
  password: z.string().min(8).max(32).regex(regex.password)
})

const userRegisterSchema = userSchema.omit({ username: true })

export type UserType = z.infer<typeof userSchema>
export type UserRegisterType = z.infer<typeof userRegisterSchema>
type UserValidation = z.SafeParseReturnType<UserType, UserType>
type UserRegisterValidation = z.SafeParseReturnType<UserType, UserRegisterType>

export const userValidation = (shape: unknown): UserValidation => {
  return userSchema.safeParse(shape)
}

export const userRegisterValidation = (shape: unknown): UserRegisterValidation => {
  return userRegisterSchema.safeParse(shape)
}

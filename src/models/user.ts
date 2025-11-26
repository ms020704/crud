import mongoose, { Schema, Model } from 'mongoose'

interface IUser {
  name: string
  email: string
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})

// 🔥 핵심 수정: mongoose.models가 undefined여도 절대 에러 안 나게
const User: Model<IUser> =
  (mongoose.models as any)?.User || mongoose.model<IUser>('User', userSchema)

export default User

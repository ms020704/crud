import mongoose, { Schema, Model } from 'mongoose'

interface IUser {
  name: string
  email: string
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})

// mongoose.models가 undefined일 수도 있으니 한 번 변수로 받는다
const models = mongoose.models as { User?: Model<IUser> } | undefined

// models?.User 가 있으면 그거 쓰고, 없으면 새로 모델 생성
const User: Model<IUser> =
  models?.User ?? mongoose.model<IUser>('User', userSchema)

export default User

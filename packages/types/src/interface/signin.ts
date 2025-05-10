export interface SigninRequestData {
  username: string
  password: string
}
export interface authRequestData {}
export type GetSigninResponseData = {
  code: number
  token: string
  message: string
}

export type Gender = "gender-neutral" | "female"

export type Category =
  | "OPEN"
  | "OPEN (PwD)"
  | "OBC_NCL"
  | "OBC-NCL (PwD)"
  | "SC"
  | "SC (PwD)"
  | "ST"
  | "ST (PwD)"
  | "EWS"
  | "EWS (PwD)"

export type IndianState =
  | "Andhra Pradesh"
  | "Arunachal Pradesh"
  | "Assam"
  | "Bihar"
  | "Chhattisgarh"
  | "Goa"
  | "Gujarat"
  | "Haryana"
  | "Himachal Pradesh"
  | "Jharkhand"
  | "Karnataka"
  | "Kerala"
  | "Madhya Pradesh"
  | "Maharashtra"
  | "Manipur"
  | "Meghalaya"
  | "Mizoram"
  | "Nagaland"
  | "Odisha"
  | "Punjab"
  | "Rajasthan"
  | "Sikkim"
  | "Tamil Nadu"
  | "Telangana"
  | "Tripura"
  | "Uttar Pradesh"
  | "Uttarakhand"
  | "West Bengal"
  | "Andaman and Nicobar Islands"
  | "Chandigarh"
  | "Dadra and Nagar Haveli and Daman and Diu"
  | "Delhi"
  | "Jammu and Kashmir"
  | "Ladakh"
  | "Lakshadweep"
  | "Puducherry"

export type ExamType = "jee-main" | "jee-advanced"

export interface User {
  id: string
  name: string
  email: string
  mobile: string
  gender: Gender
  category: Category
  home_state: IndianState
  credits: number
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  percentile: number
  rank: number
  colleges: College[]
  created_at: string
}

export interface College {
  name: string
  branch: string
  closing_rank: number
  opening_rank: number
  category: Category
  gender: Gender
  state: IndianState
  round: number
}

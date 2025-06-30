import jwt from "jsonwebtoken"
export const generatetoekn = (userid)=>
{
const token = jwt.sign({userid},process.env.JWT_SECRET)
return token 
}
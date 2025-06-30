import mongoose from "mongoose";
export const connectdb =  async ()=>
{
    try {
        mongoose.connection.on('connected',()=> console.log("DataBase Connected"))
        await mongoose.connect(`${process.env.URL}/chat-app`)
    } catch (error) {
        console.log(error)
    }
}
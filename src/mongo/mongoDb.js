import mongoose from "mongoose";
import "dotenv/config";

const mongoConnect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log('Connect Database Success')
    }catch (error) {
        console.log(`Error: ${error.mongoose}`)
        process.exit(1)
    }
}

export default mongoConnect
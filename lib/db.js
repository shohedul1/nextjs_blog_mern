import mongoose from "mongoose";

export async function connect() {
    try {
         mongoose.connect(process.env.MONGODB_URL); // Add 'await' here
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (err) => {
            console.log("MongoBD connection error. Please make sure");
            process.exit();
        });
    } catch (error) {
        console.log("Something goes wrong!");
        console.log(error);
    }
}

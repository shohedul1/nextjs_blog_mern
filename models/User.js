import mongoose from "mongoose";

mongoose.models = {};

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            default: "",
        },
        avatar: {
            type: Object,
            default: {}
        },
        age: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        about: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
)

export default mongoose.model("User", UserSchema);



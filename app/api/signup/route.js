import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import User from "../../../models/User";
import {connect} from "../../../lib/db";



export async function POST(req) {
    try {

        await connect();
        const { name, email, password } = await req.json();

        const isExistiong = await User.findOne({ email });

        if (isExistiong) {
            return NextResponse.json({
                success: false,
                error: true,
                message: "User already existis"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        const newUser = await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({
            newUser,
            success: true,
            status: 201,
            message: 'Data create successfully'
        })
    } catch (error) {
        return NextResponse.json({
            message: 'Please something wrong!'
        })
    }
}
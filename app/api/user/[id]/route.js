//api url http://localhost:3000/api/user/someId

import { connect } from "../../../../../my-app/lib/db";
import Blog from "../../../../../my-app/models/User";
import { verifyJwtToken } from "../../../../../my-app/lib/jwt";
import { NextResponse } from 'next/server'
import User from "../../../../../my-app/models/User";


//update any single api id
export async function PATCH(req, res) {
    await connect();

    const id = res.params.id
    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(" ")[1];

    const decodedToken = verifyJwtToken(token);
    if (!accessToken || !decodedToken) {
        return NextResponse({
            error: "unauthorized (wrong or expired token)",
            status: 403
        });
    };

    try {
        const body = await req.json();
        const user = await User.findById(id)
        if (user?._id.toString() !== decodedToken._id.toString()) {
            return NextResponse.json({
                message: 'Only author can update his/her data ',
                status: 403
            });
        }

        const updateUser = await User.findByIdAndUpdate(
           user?._id,
            body,
            { new: true }
        )

        return NextResponse.json(updateUser, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: "PATCH error" },
            { status: 500 }
        )
    }

}

//get any single api id show
export async function GET(req, res) {
    await connect();
    const id = res.params.id

    try {
        const user = await User.findById(id).select("-password -__v");
        
        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "GET error",
            status: 500,
        });
    }
}


//delete any sing api id 
export async function DELETE(req, res) {
    await connect();

    const id = res.params.id
    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(" ")[1];

    const decodedToken = verifyJwtToken(token);
    if (!accessToken || !decodedToken) {
        return NextResponse({
            error: "unauthorized (wrong or expired token)",
            status: 403
        });
    };

    try {
        const blog = await Blog.findById(id).populate("authorId");

        if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return NextResponse.json({
                message: 'Only author can delete his/her blog',
                status: 403
            });
        }

       await Blog.findByIdAndDelete(id);

        return NextResponse.json({mes:"Successfully deleted blog"},{status:200});

    } catch (error) {
        return NextResponse.json(
            { message: "delete error" },
            { status: 500 }
        )
    }

}



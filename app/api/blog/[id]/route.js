//api url http://localhost:3000/api/blog/someId

import { connect } from "../../../../lib/db";
import Blog from "../../../../models/Blog";
import { verifyJwtToken } from "../../../../lib/jwt";
import { NextResponse } from 'next/server'


//update any single api id
export async function PUT(req, res) {
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
        const blog = await Blog.findById(id).populate("authorId");

        if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return NextResponse.json({
                message: 'Only author can update his/her blog',
                status: 403
            });
        }

        const updateBlog = await Blog.findByIdAndUpdate(
            id,
            { $set: { ...body } },
            { new: true }
        )

        return NextResponse.json(updateBlog, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: "PUT error" },
            { status: 500 }
        )
    }

}

//get any single api id show
export async function GET(req, res) {
    await connect();
    const id = res.params.id

    try {
        const blog = await Blog.findById(id).populate({
            path: "authorId",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })


        return NextResponse.json(blog, { status: 200 });

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



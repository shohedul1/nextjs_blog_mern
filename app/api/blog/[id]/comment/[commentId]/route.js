//api url http://localhost:3000/api/blog/someId/comment/commentId

import { connect } from "../../../../../../lib/db";
import Blog from "../../../../../../models/Blog";
import { verifyJwtToken } from "../../../../../../lib/jwt";
import { NextResponse } from 'next/server'


//upda

//delete any sing api id 
export async function DELETE(req, res) {
    await connect();

    const id = res.params.id;
    const commentId = res.params.commentId;
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
        const blog = await Blog.findById(id).populate("authorId").populate("comments.user");
        const comment = blog.comments.find(comment => comment.id === commentId);

        if (!comment) {
            return NextResponse.json({
                message: "comment does not exist",
                status: 403
            })
        }

        blog.comments = blog.comments.filter(comment => comment.id !== commentId);

        await blog.save();

        return NextResponse.json({ mes: "Successfully deleted comment" }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: "delete error" },
            { status: 500 }
        )
    }

}

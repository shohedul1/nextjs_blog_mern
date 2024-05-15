// api url http://localhost:3000/api/blog/blogId/comment

import { connect } from "../../../../../lib/db";
import Blog from "../../../../../models/Blog";
import User from "../../../../../models/User";
import { verifyJwtToken } from "../../../../../lib/jwt";
import { NextResponse } from 'next/server'

// export async function POST(req,res) {
//     await connect();
//     const id = res.params.id;
//     const accessToken = req.headers.get('authorization');
//     const token = accessToken.split(" ")[1];

//     const decodedToken = verifyJwtToken(token);
//     if (!accessToken || !decodedToken) {
//         return new Response(
//             JSON.stringify({
//                 error: "unauthorized (wrong or  expired token)"
//             }),
//             { status: 403 }
//         )
//     };

//     try {
//         const body = await req.json();
//         const blog = await Blog.findById(id);
//         const user = await User.findById(decodedToken._id);

//         const newComment = {
//             text: body.text,
//             user
//         }

//         blog.comments.unshift(newComment);
//         await blog.seve();

//         return NextResponse.json({
//             blog,
//             status: 200,
//             seccess: true,
//             error: false,
//             message: 'user create comment successfully!'
//         })


//     } catch (error) {
//         return NextResponse.json({
//             message: "POST error"
//         })
//     }

// }

export async function POST(req, res) {
    await connect();
    const id = res.params.id;
    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(" ")[1];

    const decodedToken = verifyJwtToken(token);
    if (!accessToken || !decodedToken) {
        return new Response(
            JSON.stringify({
                error: "Unauthorized (wrong or expired token)"
            }),
            { status: 403 }
        );
    }

    try {
        const body = await req.json();
        const blog = await Blog.findById(id);
        const user = await User.findById(decodedToken._id);

        const newComment = {
            text: body.text,
            user
        };

        blog.comments.unshift(newComment);
        await blog.save(); // Typo fixed: Changed 'seve' to 'save'

        return new Response(
            JSON.stringify({
                blog,
                status: 200,
                success: true,
                error: false,
                message: 'User created comment successfully!'
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                message: "POST error"
            }),
            { status: 500 }
        );
    }
}


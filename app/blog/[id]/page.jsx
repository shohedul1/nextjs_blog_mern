'use client';

import { useSession } from 'next-auth/react';
import homeImage from "../../../image/knight.png";
import { CiCalendar } from "react-icons/ci";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsFillPencilFill, BsTrash } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import Image from 'next/image';
import { FaHeart } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import Input from '../../../components/Input';
import moment from 'moment';
import { deletePhoto } from '../../../actions/uploadActions';
import { useRouter } from 'next/navigation';


const BlogDetails = ({ params }) => {
    const { data: session } = useSession();
    const [blogDetails, setBlogDetails] = useState({});
    const [isDeleting, setisDeleting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [blogLikes, setBlogLikes] = useState(0)


    async function fetchBlog() {
        try {
            const response = await fetch(`/api/blog/${params.id}`);
            const blog = await response.json();
            setBlogDetails(blog);
            setIsLiked(blog?.likes?.includes(session?.user?._id));
            setBlogLikes(blog?.likes?.length || 0);
        } catch (error) {
            console.error('Error fetching blog:', error);
        }
    }

    useEffect(() => {
        fetchBlog();
    }, []);


    const timeStr = blogDetails?.createdAt;
    const time = moment(timeStr);
    const formattedTime = time.format("MMMM Do YYYY");
    const router = useRouter();


    const handleBlogDelete = async (imgeId) => {
        const confirmModal = window.confirm("Are you sure you want to delete your blog?");

        try {
            if (confirmModal) {
                setisDeleting(true);
                const response = await fetch(`/api/blog/${params.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`
                    }
                });

                if (response.ok) {
                    await deletePhoto(imgeId);
                    router.refresh();
                    router.push("/blog");
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setisDeleting(false);
        }
    };


    const handleLike = async () => {
        if (!session?.user) {
            alert("Please login before liking.");
            return;
        }

        try {
            const response = await fetch(`/api/blog/${params.id}/like`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(null)
            });

            if (response.ok) {
                setIsLiked(prev => !prev);
                setBlogLikes(prev => (isLiked ? prev - 1 : prev + 1)); // Update blogLikes immediately
            } else {
                console.log("Request failed with status:", response.status);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <section className='container max-w-3xl'>
            {blogDetails?.authorId?._id.toString() === session?.user?._id && (
                <div className='flex items-center justify-end gap-5'>
                    <Link href={`/blog/edit/${params.id}`} className='flex items-center gap-1 text-primaryColor'>
                        <BsFillPencilFill />
                        Edit
                    </Link>
                    <button onClick={() => handleBlogDelete(blogDetails?.image?.id)} className='flex items-center gap-1 text-red-500'>
                        <MdDelete />
                        {isDeleting ? "Deleting.." : " Delete"}
                    </button>

                </div>
            )}

            <div className='flex flex-col items-center justify-center'>
                <Link href={`/user/${blogDetails?.authorId?._id.toString()}`}>
                    <div className='flex flex-col justify-center items-center'>
                        <Image
                            src={blogDetails?.authorId?.avatar?.url ? blogDetails?.authorId?.avatar?.url : homeImage}
                            alt='avater image'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-20 h-20 rounded-full'
                        />
                        <div className='text-center'>
                            <p className='text-whiteColor'>{blogDetails?.authorId?.name}</p>
                            <p>{blogDetails?.authorId?.designation}</p>

                        </div>

                    </div>
                </Link>

                <div className='text-center space-y-3'>
                    <h2>{blogDetails?.title}</h2>
                    <p>{blogDetails?.excerpt}</p>
                    <p className="flex items-center justify-center gap-3">
                        <span className="text-primaryColor">{blogDetails?.category}</span>
                        <span className="flex items-center gap-1">
                            <CiCalendar />
                            {formattedTime}
                        </span>

                    </p>
                    <div>
                        <Image
                            src={blogDetails?.image ? blogDetails?.image?.url : homeImage}
                            alt='avater image'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-full h-full rounded-lg py-10'
                        />

                    </div>
                    <div className='text-start'>
                        <div className='space-y-5'>
                            <p>{blogDetails?.description}</p>
                        </div>
                    </div>

                </div>

            </div>

            <div className='py-12'>
                <div className='flex gap-10 items-center text-xl justify-center'>
                    <div className='flex items-center gap-1'>
                        <p>{blogLikes}</p>
                        {
                            isLiked ? (
                                <FaHeart onClick={handleLike} size={20} className='text-red-500 cursor-pointer' />
                            ) : (
                                <FaHeart onClick={handleLike} size={20} className='cursor-pointer' />
                            )
                        }
                    </div>

                    <div className='flex items-center gap-1'>
                        <p>12</p>
                        <AiOutlineComment size={20} className='cursor-pointer' />

                    </div>
                </div>

            </div>

            <div>
                <h3 className='text-red-500'>kindly login to leave a comment.</h3>
                <form className='space-y-2'>
                    <Input
                        name="comment"
                        type="text"
                        placeholder='Type message....'
                    />
                    <button className="btn" type='submit'>
                        comment
                    </button>
                </form>
                <div className='flex gap-3 items-cente py-5'>
                    <Image
                        src={homeImage}
                        alt='avater image'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='w-10 h-10 rounded-full'
                    />
                    <div>
                        <p className="text-whiteColor">Jhon</p>
                        <p>This is our frist comment</p>
                    </div>
                    <BsTrash cursor="poiner" className='text-red-500 ml-10' />

                </div>
            </div>


        </section>
    )
}

export default BlogDetails
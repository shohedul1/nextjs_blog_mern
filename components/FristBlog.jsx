
import Image from 'next/image';
import React from 'react';
import homeImage from "../image/knight.png";
import { CiCalendar } from "react-icons/ci";
import moment from 'moment';
import Link from 'next/link';


const FristBlog = ({ fristBlog }) => {

    const timeStr = fristBlog?.createdAt;
    const time = moment(timeStr);
    const formattedTime = time.format("MMMM Do YYYY");

    return (
        <section>
            <Link href={`/blog/${fristBlog?._id}`}>
                <div className='flex flex-col md:flex-row space-x-5 items-center '>
                    <div className='w-full lg:w-2/5'>
                        <Image
                            src={fristBlog?.image?.url ? fristBlog?.image?.url : homeImage}
                            alt='frist blog image'
                            priority={false}
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-full h-full rounded-lg'
                        />
                    </div>
                    <div className='w-full lg:w-3/5 space-y-5'>
                        <div className='flex items-center gap-3 text-xs'>
                            <p className='text-primaryColor'>{fristBlog?.category}</p>
                            <p className='flex items-center gap-1 text-paragraphColor'>
                                <CiCalendar />
                                {formattedTime}
                            </p>

                        </div>

                        <div className='space-y-2'>
                            <h2>{fristBlog?.title}</h2>
                            <p className='text-sm text-paragraphColor'>
                                {fristBlog?.excerpt}
                            </p>
                        </div>

                        <div className='flex items-center gap-3'>
                            <Image
                                src={fristBlog?.authorId?.avatar?.url ? fristBlog?.authorId?.avatar?.url : homeImage}
                                alt='image'
                                width={0}
                                height={0}
                                sizes='100vw'
                                className='w-10 h-10 rounded-full'
                            />
                            <div className='text-xl'>
                                <h6>{fristBlog?.authorId?.name}</h6>
                                <p className='text-paragraphColor'>{fristBlog?.authorId?.designation}</p>


                            </div>

                        </div>

                    </div>
                </div>
            </Link>
        </section>
    )
}

export default FristBlog
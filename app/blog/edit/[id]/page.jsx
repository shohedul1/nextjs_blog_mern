'use client';

import React, { useEffect, useState } from 'react'
import TextArea from '../../../../components/TextArea';
import Input from "../../../../components/Input"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { deletePhoto } from '../../../../actions/uploadActions';


const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Songbirds",
  image: {},
  blogId: "",
  newImage: ""

}

const EditBlog = ({ params }) => {

  const CLOUD_NAME = "djhjt07rh";
  const UPLOAD_PRESET = "nextjs_blog_images";

  const [state, setState] = useState(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blog/${params.id}`);
        if (res.ok) {
          const blogData = await res.json();
          setState(prevstate => ({
            ...prevstate,
            title: blogData.title,
            description: blogData.description,
            excerpt: blogData.excerpt,
            quote: blogData.quote,
            category: blogData.category,
            photo: blogData.image,
            blogId: blogData._id
          }))
        } else {
          setError("Error fetching blog data")
        }
      } catch (error) {
        console.error("Error fetching blog data", error); // Log the error properly
        setError("Error fetching blog data");
      }
    };

    fetchBlog();
  }, [params.id]);


  if (status === "loading") {
    return (
      <p>Loading...</p>
    )
  }

  if (status === "unauthenticated") {
    return (
      <p>Access denied</p>
    )
  }

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;

    if (type === 'file') {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newImage, title, description, excerpt, quote, category } = state;

    if (!title || !description || !excerpt || !quote || !category) {
      setError("Please fill out all required fields.");
      return;
    }

    if (newImage) {
      const maxSize = 5 * 1024 * 1024; //5MB  in bytes
      if (newImage.size > maxSize) {
        setError("File size is too large. Please select a file under 5MB");
        return;
      }
    }

    if (title.length < 4) {
      setError("Title must be at least 4 characters long.");
      return;
    }

    if (description.length < 20) {
      setError("Description must be at least 20 characters long.");
      return;
    }

    if (excerpt.length < 10) {
      setError("Excerpt must be at least 10 characters long.");
      return;
    }

    if (quote.length < 6) {
      setError("Quote must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      let image = state.photo; // Default to existing image
      if (state.newImage) {
        image = await uploadImage(); // Upload new image
        if (state.photo?.id) {
          await deletePhoto(state.photo.id); // Delete existing image
        }
      }

      const updateBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user._id
      };

      const response = await fetch(`/api/blog/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`
        },
        method: "PUT",
        body: JSON.stringify(updateBlog)
      });

      if (response.ok) {
        setSuccess("Blog updated successfully");
        setTimeout(() => {
          router.refresh();
          router.push(`/blog/${params.id}`);
        }, 1500);
      } else {
        setError("Error occurred while updating blog.");
      }
    } catch (error) {
      console.log(error);
    }
  };


  
  //cloudinary image uploade
  const uploadImage = async () => {
    if (!state.newImage) return;

    const formdata = new FormData();

    formdata.append('file', state.newImage);
    formdata.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formdata
      });

      const data = await res.json();
      const image = {
        id: data['public_id'],
        url: data['secure_url']
      }
      return image;

    } catch (error) {
      console.log(error);
    }

  }


  //image upload cancle handler

  const handleCancleUploadImg = () => {
    setState({ ...state, ["newImage"]: "" })
  }



  return (
    <section className="container max-w-3xl">
      <h2 className='mb-5'>
        <span className='special-word'>Edit</span> {" "}blog
      </h2>
      <form className='space-y-5' onSubmit={handleSubmit}>
        <Input
          label="title"
          type="text"
          placeholder="Write your title here."
          name="title"
          onChange={handleChange}
          value={state.title}
        />
        <TextArea
          label="Description"
          rows={2}
          type="text"
          placeholder="Write your description here."
          name="description"
          onChange={handleChange}
          value={state.description}
        />
        <TextArea
          label="Excerpt"
          rows={2}
          placeholder="Write your excerpt here."
          name="excerpt"
          onChange={handleChange}
          value={state.excerpt}
        />

        <TextArea
          label="Quote"
          rows={2}
          placeholder="Write your quote here."
          name="quote"
          onChange={handleChange}
          value={state.quote}
        />
        <div className='space-y-1'>
          <label className='block'>Select an option</label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className='block rounded-lg w-full p-3 bg-primaryColorLight'
          >
            <option value="Songbirds">Songbirds</option>
            <option value="Waterfowl">Waterfowl</option>
            <option value="parrots">parrots</option>
            <option value="Seabirds">Seabirds</option>
            <option value="Gamebirds">Gamebirds</option>
          </select>
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium'>
            Upload Image
          </label>
          <input onChange={handleChange} type="file" name='newImage' accept='image/*' />

          {state.newImage ? (
            <div>
              <Image
                src={URL.createObjectURL(state.newImage)}
                priority
                width={0}
                height={0}
                alt='image'
                property="true"
                sizes='100vw'
                className='w-32 mt-5'
              />
              <button onClick={handleCancleUploadImg}>Cancle</button>

            </div>
          ) : (
            <div>
              {state.photo && state.photo['url'] && (
                <div>
                  <Image
                    src={state.photo.url}
                    width={0}
                    height={0}
                    alt='image'
                    property="true"
                    sizes='100vw'
                    className='w-32 mt-5'
                  />

                </div>
              )}
            </div>
          )}


        </div>
        {
          error && <div className='text-red-700'>{error}</div>
        }
        {
          success && <div className='text-green-700'>{success}</div>
        }
        <button type='submit' className='btn'>
          {isLoading ? "Loading..." : "Edit"}
        </button>

      </form>

    </section>
  )
}

export default EditBlog
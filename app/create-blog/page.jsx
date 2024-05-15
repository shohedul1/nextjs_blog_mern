'use client';

import React, { useState } from 'react'
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';


const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Songbirds",
  photo: ""

}

const CreateBlog = () => {

  const CLOUD_NAME = "djhjt07rh";
  const UPLOAD_PRESET = "nextjs_blog_images";

  const [state, setState] = useState(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

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
    const { photo, title, description, excerpt, quote, category } = state;

    if (!title || !description || !excerpt || !quote || !category) {
      setError("Please fill out all required fields.");
      return;
    }

    if (photo) {
      const maxSize = 5 * 1024 * 1024; //5MB  in bytes
      if (photo.size > maxSize) {
        setError("File size is too large. Please select a file under 5MB");
        return;
      }
    }

    if (title.length < 4) {
      setError("Title must be at  least 4 chareachers long.");
      return;
    }

    if (description.length < 20) {
      setError("Description must be at  least 20 chareachers long.");
      return;
    }

    if (excerpt.length < 10) {
      setError("Excerpt must be at  least 10 chareachers long.");
      return;
    }

    if (quote.length < 6) {
      setError("quote must be at  least 6 chareachers long.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      const image = await uploadImage();

      const newBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user._id
      }

      const response = await fetch("/api/blog", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`
        },
        method: "POST",
        body: JSON.stringify(newBlog)

      });

      if (response.ok) {
        setSuccess("Blog Created successfully");
        setTimeout(() => {
          router.refresh();
          router.push("/blog");
        }, 1500)
      } else {
        setError("Error occurred white createing blog.")
      }

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }


  //cloudinary image uploade
  const uploadImage = async () => {
    if (!state.photo) return;

    const formdata = new FormData();

    formdata.append('file', state.photo);
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



  return (
    <section className="container max-w-3xl">
      <h2 className='mb-5'>
        <span className='special-word'>Create</span>blog
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
          <input onChange={handleChange} type="file" name='photo' accept='image/*' />

          {state.photo && (
            <div>
              <Image
                src={URL.createObjectURL(state.photo)}
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
        {
          error && <div className='text-red-700'>{error}</div>
        }
        {
          success && <div className='text-green-700'>{success}</div>
        }
        <button type='submit' className='btn'>
          {isLoading ? "Loading..." : "Login"}
        </button>

      </form>

    </section>
  )
}

export default CreateBlog
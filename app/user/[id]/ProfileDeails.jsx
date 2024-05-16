'use client';

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import homeLogo from "../../../image/knight.png";
import moment from "moment";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input"
import { deletePhoto } from '../../../actions/uploadActions';

import { AiOutlineClose } from "react-icons/ai";



const ProfileDeails = ({ profile, params }) => {

    const CLOUD_NAME = "djhjt07rh";
    const UPLOAD_PRESET = "nextjs_blog_images";

    const [profileToEdit, setProfileToEdit] = useState(profile);
    const [avatarToEdit, setAvatarToEdit] = useState("");

    const [openModalEdit, setOpenModalEdit] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { data: session, status } = useSession();
    const router = useRouter();


    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { name, designation, age, location, about } = profileToEdit;

        if (!name) {
            setError("name is required");
            return;
        }

        if (avatarToEdit) {
            const maxSize = 2 * 1024 * 1024; //2MB  in bytes
            if (avatarToEdit.size > maxSize) {
                setError("File size is too large. Please select a file under 5MB");
                return;
            }
        }



        try {
            setIsLoading(true);
            setError("");
            setSuccess("");

            let profileImg; // Default to existing image
            if (avatarToEdit) {
                profileImg = await uploadImage(); // Upload new image
                if (profile?.avatar?.id) {
                    await deletePhoto(profile?.avatar?.id); // Delete existing image
                }
            } else {
                profileImg = profile?.avatar;
            }

            const updateUser = {
                name,
                designation,
                age,
                location,
                about,
                avatar: profileImg
            };

            const response = await fetch(`/api/user/${params.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.accessToken}`
                },
                method: "PATCH",
                body: JSON.stringify(updateUser)
            });

            if (response.ok) {
                setSuccess("User updated successfully");

            } else {
                setError("Error occurred while updating user.");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSuccess("");
            setError("");
            setIsLoading(false);
            setOpenModalEdit(false);
            setAvatarToEdit("");
            router.refresh();
        }
    };

    //cloudinary image uploade
    const uploadImage = async () => {
        if (!avatarToEdit) return;

        const formdata = new FormData();

        formdata.append('file', avatarToEdit);
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



    const timeFormat = () => {
        const timeStr = profile?.createdAt;
        const time = moment(timeStr);
        const formattedTime = time.format("MMMM Do YYYY");

        return formattedTime;
    };

    const handleCancleUploadImage = () => {
        setAvatarToEdit("")
    }

    const handleChange = (event) => {
        setError("");
        const { name, value, type, files } = event.target;

        if (type === 'file') {
            setAvatarToEdit(files[0])
        } else {
            setProfileToEdit(preState => ({ ...preState, [name]: value }))

        }
    };




    if (!profile) {
        return <p>Access Denied.</p>
    }


    return (
        <div className="p-3 my-5 container">
            <div className="text-center text-primaryColor pb-20">
                <h2>Profile</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1 space-y-3">About Me</div>
                <p>{profile?.about}</p>
            </div>



            <div className="flex-1 space-y-3">
                <div className="flex flex-col justify-center items-center">
                    <Image
                        src={profile?.avatar?.url || homeLogo}
                        alt="avatar"
                        height={0}
                        width={0}
                        sizes="100vw"
                        className="w-40 h-40 rounded-full" />
                </div>
            </div>

            <div className="flex flex-col md:felx-row gap-5">
                <h4 className="text-xl">Details</h4>

                <div className="space-y-2">
                    <p>Designation:</p>
                    <p>{profile?.designation}</p>

                </div>
                <div className="space-y-2">
                    <p>Email:</p>
                    <p>{profile?.email}</p>
                </div>

                <div className="space-y-2">
                    <p>Name:</p>
                    <p>{profile?.name}</p>
                </div>

                <div className="space-y-2">
                    <p>Age:</p>
                    <p>{profile?.age}</p>
                </div>

                <div className="space-y-2">
                    <p>Location:</p>
                    <p>{profile?.location}</p>
                </div>

                <div className="space-y-2">
                    <p>Joined:</p>
                    <p>{timeFormat()}</p>
                </div>

            </div>

            <div className="pt-5">
                {profile?._id === session?.user?._id && (
                    <button
                        className="text-primaryColor mr-3"
                        onClick={() => setOpenModalEdit(true)}
                    >
                        Edit
                    </button>

                )}
                <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
                    <form onSubmit={handleEditSubmit}>
                        <h2 className="text-2xl text-primaryColor pb-3">Profile</h2>
                        {avatarToEdit ? (
                            <div className="flex justify-center items-start">
                                <Image
                                    src={URL.createObjectURL(avatarToEdit)}
                                    alt="avatar"
                                    width={0}
                                    height={0}
                                    property="true"
                                    sizes="100vw"
                                    className="w-20 h-20 rounded-full border-2 border-black"
                                />
                                <button className="text-red-700" onClick={handleCancleUploadImage}>
                                    <AiOutlineClose />
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                {profile.avatar && profile.avatar['url'] && (
                                    <div>
                                        <Image
                                            src={profile?.avatar?.url}
                                            alt="avatar"
                                            width={0}
                                            property="true"
                                            height={0}
                                            sizes="100vw"
                                            className="w-20 h-20 rounded-full border-2 border-black"
                                        />
                                    </div>
                                )}

                            </div>
                        )}
                        <div>
                            <input
                                onChange={handleChange}
                                type="file"
                                name='newImage'
                                accept='image/*'
                                className="block w-full border border-gray-300 rounded-lg"
                            />

                        </div>

                        <Input
                            label="name"
                            type="text"
                            placeholder="name"
                            name="name"
                            onChange={handleChange}
                            value={profileToEdit.name || ""}
                        />

                        <Input
                            label="Designation"
                            type="text"
                            placeholder="designation"
                            name="designation"
                            onChange={handleChange}
                            value={profileToEdit.designation || ""}
                        />

                        <Input
                            label="About"
                            type="text"
                            placeholder="about"
                            name="about"
                            onChange={handleChange}
                            value={profileToEdit.about || ""}
                        />

                        <Input
                            label="Age"
                            type="text"
                            placeholder="age"
                            name="age"
                            onChange={handleChange}
                            value={profileToEdit.age || ""}
                        />

                        <Input
                            label="Location"
                            type="text"
                            placeholder="location"
                            name="location"
                            onChange={handleChange}
                            value={profileToEdit.location || ""}
                        />

                        {
                            error && <div className='text-red-700'>{error}</div>
                        }
                        {
                            success && <div className='text-green-700'>{success}</div>
                        }

                        <div className="space-x-5 pt-5">
                            <button type='submit' className='btn'>
                                {isLoading ? "Loading..." : "Edit"}
                            </button>

                            <button onClick={() => setOpenModalEdit(false)} className='btn bg-red-700'>
                                Cancle
                            </button>

                        </div>


                    </form>

                </Modal>
            </div>






        </div>
    )
}

export default ProfileDeails
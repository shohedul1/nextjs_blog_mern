'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import homeLogo from "../image/knight.png";
import { signOut, useSession } from 'next-auth/react';


const Navbar = () => {
  const [userData, setUserData] = useState({});
  const { data: session, status } = useSession();

  const pathname = usePathname();

  const [showDropdown, setShowDropdown] = useState(false); // Use array destructuring

  async function fetchUser() {
    try {
      const res = await fetch(`/api/user/${session?.user?._id}`);

      if (res.ok) {
        const resData = await res.json();
        setUserData(resData);
      }

    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    fetchUser();
  }, [session?.user?._id]);

  

  const handleShowDropdown = () => setShowDropdown((prev) => true);
  const handleHideDropdown = () => setShowDropdown((prev) => false);



  return (
    <div className='bg-black sticky top-0 z-50'>
      <div className="container py-2 h-16 flex items-center justify-between ">
        <Link href={'/'}>
          <h2>
            Light<span className="special-word">code.</span>
          </h2>
        </Link>
        <ul className="flex items-center gap-3">
          <li>
            <Link href={'/blog'} className={pathname === "/blog" ? 'text-primaryColor font-bold' : ""}>Blog</Link>
          </li>
          {session?.user ? (
            <>
              <li>
                <Link href={'/create-blog'} className={pathname === "/create-blog" ? 'text-primaryColor font-bold' : ""}>Create</Link>
              </li>
              <li>
                <div className="relative">
                  <Image
                    onClick={handleShowDropdown}
                    src={userData?.avatar?.url || homeLogo}
                    width={500}
                    height={500}
                    property="true"
                    alt="avatar"
                    sizes="100vw"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  {showDropdown && (
                    <div className="absolute top-0 right-0  bg-primaryColorLight  p-5">
                      <AiOutlineClose className='w-full cursor-pointer' onClick={handleHideDropdown} />
                      <button
                        onClick={() => { signOut(); handleHideDropdown() }}
                        className={pathname === "/login" ? 'text-primaryColor font-bold' : ""}>
                        Logout
                      </button>
                      <Link
                        href={`/user/${session?.user?._id.toString()}`}
                        onClick={handleHideDropdown}
                        className={pathname === "/user" ? 'text-primaryColor font-bold' : ""}>
                        Profile
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href={'/login'} className={pathname === "/login" ? 'text-primaryColor font-bold' : ""}>Login</Link>
              </li>
              <li>
                <Link href={'/signup'} className={pathname === "/signup" ? 'text-primaryColor font-bold' : ""}>Sign Up</Link>
              </li>
            </>
          )}
        </ul>

      </div>

    </div>
  );
};

export default Navbar;






'use client';
import React, { useEffect } from 'react';
import LoginFrom from '../../components/LoginFrom';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';



const Login =  () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(()=>{
    if (session) {
      router.push("/blog")
    }
  },[session]);
  return (
    <div>
      <LoginFrom />
    </div>
  )
}

export default Login
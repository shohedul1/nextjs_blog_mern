'use client';
import React from 'react';
import LoginFrom from '../../components/LoginFrom';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';



const Login =  () => {
  const { data: session } = useSession();

  if (session) {
    redirect("/blog");
  }

  return (
    <div>
      <LoginFrom />
    </div>
  )
}

export default Login
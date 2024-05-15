
'use client';
import { useSession } from 'next-auth/react';
import SignupFrom from '../../components/SignupFrom';
import { redirect } from 'next/navigation';



const Signup = () => {
  const { data: session } = useSession();

  if (session) {
    redirect("/blog");
  }
  return (
    <div>
      <SignupFrom />
    </div>
  )
}

export default Signup
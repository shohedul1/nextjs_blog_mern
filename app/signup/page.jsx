
'use client';
import { useSession } from 'next-auth/react';
import SignupFrom from '../../components/SignupFrom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';



const Signup = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(()=>{
    if (session) {
      router.push("/blog")
    }
  },[session]);
  return (
    <div>
      <SignupFrom />
    </div>
  )
}

export default Signup
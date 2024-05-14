import React from 'react';
import LoginFrom from '../../components/LoginFrom';
import  {getServerSession}  from "next-auth";
import   {authOptions} from  "../api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation';


const Login =async () => {
  const session = await getServerSession(authOptions);
  if(session){
    redirect("/blog");
  }

  return (
    <div>
        <LoginFrom/>
    </div>
  )
}

export default Login
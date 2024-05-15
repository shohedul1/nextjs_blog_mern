import React from 'react';
import LoginFrom from '../../components/LoginFrom';
// import { redirect } from 'next/navigation';
// import { getServerSession } from 'next-auth';
// import authOptions from "../../app/api/auth/[...nextauth]/route"


const Login = async () => {
  // const session = await getServerSession(authOptions);

  // if (session) {
  //   redirect("/blog");
  // }

  return (
    <div>
      <LoginFrom />
    </div>
  )
}

export default Login
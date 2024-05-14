
import SignupFrom from '../../components/SignupFrom';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from "../../lib/authOptions"



const Signup = async () => {
  const session = await getServerSession(authOptions);

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
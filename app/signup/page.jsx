import SignupFrom from '../../components/SignupFrom';
import  {getServerSession}  from "next-auth";
import   {authOptions} from  "../api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation';


const Signup = async ()=> {
  const session = await getServerSession(authOptions);
  if(session){
    redirect("/blog");
  }


  return (
    <div>
      <SignupFrom />
    </div>
  )
}

export default Signup
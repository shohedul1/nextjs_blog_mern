import ProfileDeails from './ProfileDeails';

async function getUserData(params) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${params.id}`, {
    cache: "no-store"
  });
  if (res.ok) {
    return res.json();
    
  }

}

const UserProfile = async ({params}) => {
  const profile  = await getUserData(params)
  return (
    <div>
      <ProfileDeails profile={profile} params={params}/>
    </div>
  )
}

export default UserProfile
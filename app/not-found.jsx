import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='flex items-center justify-center flex-col space-y-5'>
      <h1>Page not found 404</h1>
      <p className='text-3xl hover:text-red-500'>
        <Link href={"/"}>
        returen home
        </Link>
      </p>
      
    </div>
  )
}

export default NotFound
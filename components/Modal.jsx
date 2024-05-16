import React from 'react'

function Modal({children, modalOpen, setModalOpen}) {
  return (
    <div>
        {modalOpen && (
            <div className='bg-black/10 fixed inset-0'>
                <div className='flex justify-center items-center h-full pt-4'>
                    <div className='max-h-[90%] md:max-x-lg overflow-auto flex flex-col items-end bg-[#635656] p-5'>
                        <button onClick={()=>setModalOpen(false)}>
                            &times;
                        </button>
                        {children}
                    </div>

                </div>

            </div>
        )}
    </div>
  )
}

export default Modal
import React from 'react'
import AppLayout from '../layout/AppLayout'
import RichTextEditor from '../components/RichTextEditor'

const CreateEvent = () => {
  return (
    <AppLayout>
      CreateEvent
      <div className='max-w-[1400px] w-full px-6'>
        <RichTextEditor/>
      </div>
    </AppLayout>
  )
}

export default CreateEvent

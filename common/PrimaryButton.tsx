import { Button } from '@heroui/react'
import { px } from 'framer-motion'
import React from 'react'

const PrimaryButton = ({ text}) => {
  return (
    <Button
      radius="none"
      className='flex flex-row bg-[#635BFF] text-white rounded-md' >
      {text}
    </Button>
  )
}

export default PrimaryButton

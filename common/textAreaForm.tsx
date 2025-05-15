import { Textarea } from "@heroui/react"

const TextAreaForm = ({label,placeholder}) => {
  return <Textarea

      label={label}
      labelPlacement="outside"
      className="color-[#F4F4F5] w-[340px] my-6 "
      placeholder={placeholder}
  />


}

export default TextAreaForm

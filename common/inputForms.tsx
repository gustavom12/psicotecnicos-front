import { Input } from "@heroui/react"


const InputForms = ({ label, placeholder, required }) => {

  return (
    <Input
      required={required}
      label={label}
      labelPlacement="outside"
      className="color-[#F4F4F5] w-[340px] my-6 "
      placeholder={placeholder}
    />
  )
}

export default InputForms

import { Input } from "@heroui/react";

const InputForms = ({ label, placeholder, required, ...props }: any) => {
  return (
    <Input
      required={required}
      label={label}
      labelPlacement="outside"
      className="color-[#F4F4F5] w-[340px] my-6 "
      placeholder={placeholder}
      {...props}
    />
  );
};

export default InputForms;

import type { ReactNode, ChangeEvent } from "react";

type FormInputProps = {
    label: string;
    type?: string;
    value: string;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    icon?: ReactNode;
};

function FormInput({label,type = "text",value,placeholder,onChange,icon}: FormInputProps) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-2">
                <label className="text-left text-black font-medium">{label}</label>
                <span className="text-red-500">*</span>
            </div>

            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-[52%] -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center">
            {icon}
          </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`border border-gray-300 rounded-lg w-full p-2 ${
                        icon ? "pl-10" : "pl-2"
                    } text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400`}
                />
            </div>
        </div>
    );
}

export default FormInput;

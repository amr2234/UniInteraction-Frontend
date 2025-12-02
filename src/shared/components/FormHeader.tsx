import React from "react";

interface FormHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgGradient: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  icon,
  title,
  description,
  iconBgGradient,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 ${iconBgGradient} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h1 className="text-[#2B2B2B]">{title}</h1>
          <p className="text-[#6F6F6F]">{description}</p>
        </div>
      </div>
    </div>
  );
};

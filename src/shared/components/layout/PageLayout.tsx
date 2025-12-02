import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth = "5xl",
}) => {
  const maxWidthClass = `max-w-${maxWidth}`;
  
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        {children}
      </div>
    </div>
  );
};

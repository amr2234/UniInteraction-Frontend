import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface FileUploadSectionProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  borderColor?: string;
  iconColor?: string;
  bgColor?: string;
  title?: string;
  description?: string;
  language?: 'ar' | 'en';
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  onFileChange,
  onRemoveFile,
  borderColor = "border-[#6CAEBD]/30",
  iconColor = "text-[#6CAEBD]",
  bgColor = "bg-[#6CAEBD]/10",
  title = "المرفقات",
  description = "رفع الملفات (إن وجدت)",
  language = 'ar',
}) => {
  const isRTL = language === 'ar';
  
  const translations = {
    clickToSelect: isRTL ? 'اضغط لاختيار الملفات أو اسحبها هنا' : 'Click to select files or drag them here',
    acceptedFiles: isRTL 
      ? 'الملفات المقبولة: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF (حتى 10MB)'
      : 'Accepted files: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF (up to 10MB)'
  };
  return (
    <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
      <h3 className="text-[#6CAEBD] mb-6">{title}</h3>
      <div>
        <Label htmlFor="files" className="text-[#2B2B2B]">
          {description}
        </Label>
        <div className="mt-2">
          <label
            htmlFor="files"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed ${borderColor} rounded-xl cursor-pointer hover:${bgColor.replace('/10', '/5')} transition`}
          >
             <Upload className={`w-8 h-8 ${iconColor} mb-2`} />
            <span className="text-xs text-[#6F6F6F]">{translations.clickToSelect}</span>
            <span className="text-[10px] text-[#6F6F6F] mt-1 text-center px-2">
              {translations.acceptedFiles}
            </span>
          </label>
          <input
            id="files"
            type="file"
            multiple
            onChange={onFileChange}
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#F4F4F4] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <Upload className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-[#2B2B2B]">{file.name}</p>
                    <p className="text-xs text-[#6F6F6F]">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="p-1 hover:bg-red-50 rounded-lg transition"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

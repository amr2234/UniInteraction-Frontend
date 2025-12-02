import React from "react";
import { Button } from "../../components/ui/button";

interface FormActionsProps {
  submitLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  submitGradient?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  submitLabel,
  cancelLabel = "إلغاء",
  onCancel,
  submitGradient = "bg-gradient-to-br from-[#875E9E] to-[#6CAEBD]",
}) => {
  return (
    <div className="flex gap-4">
      <Button
        type="submit"
        className={`flex-1 ${submitGradient} hover:opacity-90 h-12 rounded-xl shadow-soft`}
      >
        {submitLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="px-8 h-12 rounded-xl border-[#6F6F6F] text-[#6F6F6F] hover:bg-gray-50"
      >
        {cancelLabel}
      </Button>
    </div>
  );
};

/**
 * Add Visit Modal
 * Modal for creating a new visit when clicking an empty date
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { AddVisitModalProps, VisitRequest } from "../types/Calendar.types";

export function AddVisitModal({
  isOpen,
  selectedDate,
  onClose,
  onSubmit,
  language,
}: AddVisitModalProps) {
  const isRTL = language === "ar";

  // Form state
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    email: "",
    phone: "",
    visitDateTime: "",
    visitEndDateTime: "",
    leadershipNameAr: "",
    leadershipNameEn: "",
    location: "",
    reason: "",
    notes: "",
  });

  // Reset form when modal opens
  const handleOpen = (open: boolean) => {
    if (!open) {
      setFormData({
        nameAr: "",
        nameEn: "",
        email: "",
        phone: "",
        visitDateTime: "",
        visitEndDateTime: "",
        leadershipNameAr: "",
        leadershipNameEn: "",
        location: "",
        reason: "",
        notes: "",
      });
      onClose();
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Partial<VisitRequest>);
  };

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "إضافة زيارة جديدة" : "Add New Visit"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? selectedDate
                ? `إضافة زيارة ليوم ${format(selectedDate, "dd/MM/yyyy")}`
                : "قم بملء البيانات لإضافة زيارة جديدة"
              : selectedDate
              ? `Add a visit for ${format(selectedDate, "MM/dd/yyyy")}`
              : "Fill in the details to add a new visit"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Visitor Name (Arabic) */}
          <div className="space-y-2">
            <Label htmlFor="nameAr">
              {isRTL ? "اسم الزائر (عربي)" : "Visitor Name (Arabic)"}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => handleChange("nameAr", e.target.value)}
              placeholder={isRTL ? "أدخل الاسم بالعربي" : "Enter name in Arabic"}
              required
            />
          </div>

          {/* Visitor Name (English) */}
          <div className="space-y-2">
            <Label htmlFor="nameEn">
              {isRTL ? "اسم الزائر (إنجليزي)" : "Visitor Name (English)"}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => handleChange("nameEn", e.target.value)}
              placeholder={isRTL ? "أدخل الاسم بالإنجليزي" : "Enter name in English"}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={
                isRTL ? "visitor@example.com" : "visitor@example.com"
              }
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{isRTL ? "رقم الهاتف" : "Phone Number"}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder={isRTL ? "05xxxxxxxx" : "05xxxxxxxx"}
            />
          </div>

          {/* Visit Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitDateTime">
                {isRTL ? "وقت البداية" : "Start Time"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="visitDateTime"
                type="datetime-local"
                value={formData.visitDateTime}
                onChange={(e) => handleChange("visitDateTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitEndDateTime">
                {isRTL ? "وقت النهاية" : "End Time"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="visitEndDateTime"
                type="datetime-local"
                value={formData.visitEndDateTime}
                onChange={(e) => handleChange("visitEndDateTime", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Leadership (Arabic) */}
          <div className="space-y-2">
            <Label htmlFor="leadershipNameAr">
              {isRTL ? "الجهة المستقبلة (عربي)" : "Leadership (Arabic)"}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="leadershipNameAr"
              value={formData.leadershipNameAr}
              onChange={(e) => handleChange("leadershipNameAr", e.target.value)}
              placeholder={isRTL ? "مثال: عميد الكلية" : "e.g., Dean of the College"}
              required
            />
          </div>

          {/* Leadership (English) */}
          <div className="space-y-2">
            <Label htmlFor="leadershipNameEn">
              {isRTL ? "الجهة المستقبلة (إنجليزي)" : "Leadership (English)"}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="leadershipNameEn"
              value={formData.leadershipNameEn}
              onChange={(e) => handleChange("leadershipNameEn", e.target.value)}
              placeholder={isRTL ? "e.g., Dean of the College" : "e.g., Dean of the College"}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              {isRTL ? "الموقع" : "Location"}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder={
                isRTL
                  ? "مبنى الإدارة - الدور الثالث - مكتب 301"
                  : "Admin Building - 3rd Floor - Office 301"
              }
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              {isRTL ? "سبب الزيارة" : "Reason for Visit"}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder={
                isRTL
                  ? "اشرح سبب الزيارة..."
                  : "Explain the reason for the visit..."
              }
              rows={3}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{isRTL ? "ملاحظات إضافية" : "Additional Notes"}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder={
                isRTL ? "أي ملاحظات أخرى..." : "Any other notes..."
              }
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit" className="bg-[#6CAEBD] hover:bg-[#5E9CAA]">
              {isRTL ? "إضافة الزيارة" : "Add Visit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

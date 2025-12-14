import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useI18n } from "@/i18n";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, feedback: string) => void;
}

export function RatingDialog({ open, onOpenChange, onSubmit }: RatingDialogProps) {
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback);
      // Reset form
      setRating(0);
      setFeedback("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setRating(0);
    setFeedback("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("requests.rateYourExperience")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("requests.rateExperienceDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("requests.rating")}
            </label>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-10 h-10 cursor-pointer transition-all ${
                    star <= rating 
                      ? "text-yellow-500 fill-current scale-110" 
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-500 mt-2">
                {rating === 1 && t("requests.ratingLevel.veryPoor")}
                {rating === 2 && t("requests.ratingLevel.poor")}
                {rating === 3 && t("requests.ratingLevel.average")}
                {rating === 4 && t("requests.ratingLevel.good")}
                {rating === 5 && t("requests.ratingLevel.excellent")}
              </p>
            )}
          </div>
          
          {/* Feedback Textarea */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("requests.feedback")} ({t("requests.optional")})
            </label>
            <Textarea
              placeholder={t("requests.shareYourExperience")}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={rating === 0}
            className="bg-[#115740] hover:bg-[#0d4230] disabled:opacity-50"
          >
            {t("requests.submitRating")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Form Data Types
export interface FAQFormData {
  id?: number;
  questionAr: string;
  questionEn?: string;
  answerAr: string;
  answerEn?: string;
  order: number;
  categoryId?: number;
  isActive: boolean;
}

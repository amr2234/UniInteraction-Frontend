export const REQUEST_CATEGORIES = {
  ACADEMIC: { value: "academic", label: "الشؤون الأكاديمية" },
  ADMINISTRATIVE: { value: "administrative", label: "الشؤون الإدارية" },
  TECHNICAL: { value: "technical", label: "الدعم الفني" },
  FINANCIAL: { value: "financial", label: "الشؤون المالية" },
  STUDENT: { value: "student", label: "شؤون الطلاب" },
  FACILITIES: { value: "facilities", label: "المرافق والخدمات" },
  ACTIVITIES: { value: "activities", label: "الأنشطة والفعاليات" },
  DEVELOPMENT: { value: "development", label: "التطوير والجودة" },
} as const;

export const COMPLAINT_MAIN_CATEGORIES = [
  { value: "service", label: "جودة الخدمة" },
  { value: "staff", label: "التعامل مع الموظفين" },
  { value: "facilities", label: "المرافق والخدمات" },
  { value: "system", label: "الأنظمة الإلكترونية" },
  { value: "other", label: "أخرى" },
];

export const COMPLAINT_SUB_CATEGORIES = [
  { value: "sub1", label: "بطء في الإجراءات" },
  { value: "sub2", label: "عدم الاستجابة" },
  { value: "sub3", label: "معلومات خاطئة" },
  { value: "sub4", label: "سوء معاملة" },
];

export const INQUIRY_MAIN_CATEGORIES = [
  { value: "registration", label: "التسجيل والقبول" },
  { value: "courses", label: "المقررات الدراسية" },
  { value: "exams", label: "الاختبارات" },
  { value: "grades", label: "الدرجات والنتائج" },
  { value: "graduation", label: "التخرج" },
];

export const INQUIRY_SUB_CATEGORIES = [
  { value: "sub1", label: "التسجيل المبكر" },
  { value: "sub2", label: "الحذف والإضافة" },
  { value: "sub3", label: "الاعتذار عن فصل دراسي" },
  { value: "sub4", label: "تأجيل الدراسة" },
];

export const SUGGESTION_MAIN_CATEGORIES = [
  { value: "teaching", label: "طرق التدريس" },
  { value: "services", label: "الخدمات الطلابية" },
  { value: "technology", label: "التحول الرقمي" },
  { value: "infrastructure", label: "البنية التحتية" },
  { value: "programs", label: "البرامج والمبادرات" },
];

export const SUGGESTION_SUB_CATEGORIES = [
  { value: "sub1", label: "التعليم الإلكتروني" },
  { value: "sub2", label: "المكتبة الرقمية" },
  { value: "sub3", label: "الأنشطة الطلابية" },
  { value: "sub4", label: "المرافق الرياضية" },
];

export const SERVICES = [
  { value: "service1", label: "خدمات القبول والتسجيل" },
  { value: "service2", label: "الخدمات الأكاديمية" },
  { value: "service3", label: "الخدمات المالية" },
  { value: "service4", label: "الخدمات الإلكترونية" },
];

export const LEADERSHIP_OPTIONS = [
  { value: "rector", label: "مدير الجامعة" },
  { value: "vice-rector-academic", label: "وكيل الجامعة للشؤون الأكاديمية" },
  { value: "vice-rector-research", label: "وكيل الجامعة للبحث والابتكار" },
  { value: "vice-rector-development", label: "وكيل الجامعة للتطوير والجودة" },
  { value: "dean-student-affairs", label: "عميد شؤون الطلاب" },
  { value: "dean-admission", label: "عميد القبول والتسجيل" },
  { value: "dean-research", label: "عميد البحث العلمي" },
  { value: "dean-community", label: "عميد خدمة المجتمع" },
];

export const FILE_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

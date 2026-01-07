interface Department {
  id: number;
  nameAr: string;
  nameEn?: string;
}

interface Leadership {
  id: number;
  nameAr: string;
  nameEn?: string;
  positionTitleAr: string;
  positionTitleEn?: string;
}

export const createRequestHelpers = (
  departments: Department[],
  leaderships: Leadership[]
) => {
  const getDepartmentName = (
    departmentId?: number,
    language: "ar" | "en" = "ar"
  ): string => {
    if (!departmentId) return "";
    const department = departments.find((dept) => dept.id === departmentId);
    if (!department) return "";
    return language === "ar"
      ? department.nameAr
      : department.nameEn || department.nameAr;
  };

  const getLeadershipName = (
    leadershipId?: number,
    language: "ar" | "en" = "ar"
  ): string => {
    if (!leadershipId) return "";
    const leadership = leaderships.find((lead) => lead.id === leadershipId);
    if (!leadership) return "";
    return language === "ar"
      ? leadership.nameAr
      : leadership.nameEn || leadership.nameAr;
  };

  const getLeadershipPosition = (
    leadershipId?: number,
    language: "ar" | "en" = "ar"
  ): string => {
    if (!leadershipId) return "";
    const leadership = leaderships.find((lead) => lead.id === leadershipId);
    if (!leadership) return "";
    return language === "ar"
      ? leadership.positionTitleAr
      : leadership.positionTitleEn || leadership.positionTitleAr;
  };

  return {
    getDepartmentName,
    getLeadershipName,
    getLeadershipPosition,
  };
};

import { useUserRole } from "@/core/hooks";
import { DashboardPage } from "./DashboardPage";
import { UserDashboard } from "./UserDashboard";


export function Dashboard() {
  const { isUser } = useUserRole();

  if (isUser) {
    return <UserDashboard />;
  }

  return <DashboardPage />;
}

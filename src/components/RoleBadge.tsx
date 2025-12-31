import { Crown, Shield, Users, UserCircle } from "lucide-react";
import { UserRole, getRoleTranslationKey } from "@/core/constants/roles";
import { useI18n } from "@/i18n";
import { cn } from "@/components/ui/utils";

interface RoleBadgeProps {
  roleId: number;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

const getRoleConfig = (roleId: number) => {
  switch (roleId) {
    case UserRole.SUPER_ADMIN:
      return {
        icon: Crown,
        gradient: "from-amber-500 via-yellow-500 to-amber-600",
        bgGradient: "from-amber-50 to-yellow-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-300",
        glowColor: "shadow-amber-500/50",
        shimmer: true,
      };
    case UserRole.ADMIN:
      return {
        icon: Shield,
        gradient: "from-blue-500 via-indigo-500 to-blue-600",
        bgGradient: "from-blue-50 to-indigo-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-300",
        glowColor: "shadow-blue-500/50",
        shimmer: false,
      };
    case UserRole.EMPLOYEE:
      return {
        icon: Users,
        gradient: "from-green-500 via-emerald-500 to-green-600",
        bgGradient: "from-green-50 to-emerald-50",
        textColor: "text-green-700",
        borderColor: "border-green-300",
        glowColor: "shadow-green-500/50",
        shimmer: false,
      };
    case UserRole.USER:
      return {
        icon: UserCircle,
        gradient: "from-gray-500 via-slate-500 to-gray-600",
        bgGradient: "from-gray-50 to-slate-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-300",
        glowColor: "shadow-gray-500/50",
        shimmer: false,
      };
    default:
      return {
        icon: UserCircle,
        gradient: "from-gray-500 to-gray-600",
        bgGradient: "from-gray-50 to-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300",
        glowColor: "shadow-gray-500/50",
        shimmer: false,
      };
  }
};

export function RoleBadge({ roleId, variant = "default", className }: RoleBadgeProps) {
  const { t } = useI18n();
  const config = getRoleConfig(roleId);
  const Icon = config.icon;
  const roleLabel = t(getRoleTranslationKey(roleId));

  // Compact variant (for navbar)
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300",
          "hover:scale-105 cursor-default",
          `bg-gradient-to-r ${config.bgGradient}`,
          config.borderColor,
          config.shimmer && "animate-pulse",
          className
        )}
      >
        <Icon className={cn("w-3.5 h-3.5", config.textColor)} />
        <span className={cn("text-xs font-semibold", config.textColor)}>
          {roleLabel}
        </span>
      </div>
    );
  }

  // Detailed variant (for profile page)
  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300",
          "hover:scale-[1.02] hover:shadow-xl",
          `bg-gradient-to-br ${config.bgGradient}`,
          config.borderColor,
          config.glowColor,
          className
        )}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <Icon className="w-full h-full" />
        </div>

        {/* Shimmer effect for Super Admin */}
        {config.shimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br",
              config.gradient,
              "shadow-lg"
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t("profile.role")}</p>
            <p className={cn("text-lg font-bold", config.textColor)}>{roleLabel}</p>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300",
        "hover:scale-105 hover:shadow-lg cursor-default",
        `bg-gradient-to-r ${config.bgGradient}`,
        config.borderColor,
        config.shimmer && "animate-pulse",
        className
      )}
    >
      <div
        className={cn(
          "p-1.5 rounded-lg bg-gradient-to-br",
          config.gradient,
          "shadow-md"
        )}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className={cn("text-sm font-semibold", config.textColor)}>
        {roleLabel}
      </span>
    </div>
  );
}

// Component to display all user roles
interface UserRoleBadgesProps {
  roleIds: number[];
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export function UserRoleBadges({ roleIds, variant = "default", className }: UserRoleBadgesProps) {
  if (!roleIds || roleIds.length === 0) return null;

  // Sort roles by priority (Super Admin > Admin > Employee > User)
  const sortedRoles = [...roleIds].sort((a, b) => a - b);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sortedRoles.map((roleId) => (
        <RoleBadge key={roleId} roleId={roleId} variant={variant} />
      ))}
    </div>
  );
}

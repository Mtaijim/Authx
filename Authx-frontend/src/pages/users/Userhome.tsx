import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router";
import useAuthStore from "@/auth/store";
import { isAdmin } from "@/utils/roles";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Clock3,
  Users,
  UserPen,
  Copy,
  Check,
  ChevronRight,
  UserCog,
  Building2,
  ShieldAlert,
  UserCheck,
  Search,
} from "lucide-react";

function timeAgo(date: Date, now: Date) {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

const ADMIN_FEATURES = [
  {
    icon: UserCog,
    label: "User Management",
    description: "Search, view, and edit user accounts",
    to: "/dashboard/admin/users",
  },
  {
    icon: Building2,
    label: "Manage organizations ",
    description: "Manage organization",
    to: "/orgs",
  },
  {
    icon: ShieldAlert,
    label: "Permission Control",
    description: "Fine-tune what each role can access",
    to: "/dashboard/admin/permissions",
  },
  {
    icon: UserCheck,
    label: "Account Status Management",
    description: "Suspend, activate, or ban accounts",
    to: "/dashboard/admin/risk",
  },
];

const Userhome = () => {
  const user = useAuthStore((state) => state.user);

  const [loginTime] = useState(() => new Date());
  const [now, setNow] = useState(() => new Date());
  const [copied, setCopied] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [featureQuery, setFeatureQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAdminFeatures = useMemo(() => {
    const query = featureQuery.trim().toLowerCase();
    if (!query) return ADMIN_FEATURES;
    return ADMIN_FEATURES.filter(
      (feature) =>
        feature.label.toLowerCase().includes(query) ||
        feature.description.toLowerCase().includes(query),
    );
  }, [featureQuery]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const adminUser = isAdmin(user);

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleCopyEmail = async () => {
    if (!user.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Card */}
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-transparent transition-all hover:ring-primary/40">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome back, {user.name}
                  </h1>

                  {user.email && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleCopyEmail}
                          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span>{user.email}</span>
                          {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copied ? "Copied!" : "Click to copy email"}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              <Button asChild>
                <NavLink to="/dashboard/profile">
                  <UserPen className="mr-2 h-4 w-4" />
                  Edit Profile
                </NavLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Account status</p>
              <p className="mt-1 text-lg font-semibold capitalize">active</p>
            </CardContent>
          </Card>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {adminUser ? "Admin" : "Member"}
              </p>
            </CardContent>
          </Card>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Signed in via</p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {user.provider}
              </p>
            </CardContent>
          </Card>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="mt-1 text-lg font-semibold">{memberSince}</p>
            </CardContent>
          </Card>
        </div>

        {/* Last Login */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5" />
              Last Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <p className="font-medium">{loginTime.toLocaleString()}</p>
              <Badge variant="secondary" className="font-normal">
                {timeAgo(loginTime, now)}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-1 capitalize">
              Signed in via {user.provider}
            </p>
          </CardContent>
        </Card>

        {/* Admin Features */}
        {adminUser && (
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Features
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={featureQuery}
                  onChange={(event) => setFeatureQuery(event.target.value)}
                  placeholder="Search admin features..."
                  className="pl-8"
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-1">
              {filteredAdminFeatures.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No features match "{featureQuery}"
                </p>
              )}

              {filteredAdminFeatures.map((feature) => {
                const Icon = feature.icon;
                const isExpanded = expandedFeature === feature.label;

                return (
                  <div
                    key={feature.label}
                    className="rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
                  >
                    <button
                      onClick={() =>
                        setExpandedFeature(isExpanded ? null : feature.label)
                      }
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium flex-1">
                        {feature.label}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pl-10 flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                        <Button asChild size="sm" variant="secondary">
                          <NavLink to={feature.to}>Open</NavLink>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Userhome;

import { Card, CardContent } from "@/components/ui/card";
import {
  Lock,
  UsersRound,
  ShieldCheck,
  KeyRound,
  Mail,
  UserCog,
  MailCheck,
  History,
  Ban,
  AlertTriangle,
  LayoutDashboard,
  SlidersHorizontal,
  Building2,
  FileClock,
  Gauge,
} from "lucide-react";

const categories = [
  {
    label: "Core Authentication",
    services: [
      {
        icon: <Lock className="w-6 h-6" />,
        title: "Register & Login",
        desc: "Secure signup and sign-in flows with password hashing built in.",
      },
      {
        icon: <KeyRound className="w-6 h-6" />,
        title: "JWT + Refresh Rotation",
        desc: "Stateless access tokens with automatic refresh token rotation and reuse detection.",
      },
      {
        icon: <MailCheck className="w-6 h-6" />,
        title: "Email Verification",
        desc: "Time-limited tokens to confirm ownership before account activation.",
      },
      {
        icon: <Mail className="w-6 h-6" />,
        title: "Forgot / Reset Password",
        desc: "Secure recovery flow with expiring, single-use reset links.",
      },
      {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Email Validation",
        desc: "MX record checks and disposable-domain filtering at signup.",
      },
    ],
  },

  {
    label: "Security & Protection",
    services: [
      {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "TOTP / MFA",
        desc: "Authenticator app-based two-factor login for an extra layer of security.",
      },
      {
        icon: <Ban className="w-6 h-6" />,
        title: "Rate Limiting & Lockout",
        desc: "Automatic throttling and account lockout after repeated failed attempts.",
      },
      {
        icon: <KeyRound className="w-6 h-6" />,
        title: "Token Blacklisting",
        desc: "Instantly revoke compromised or logged-out tokens server-side.",
      },
      {
        icon: <AlertTriangle className="w-6 h-6" />,
        title: "Suspicious Login Alerts",
        desc: "Real-time notifications when a login looks unusual or unrecognized.",
      },
      {
        icon: <History className="w-6 h-6" />,
        title: "Login History & Devices",
        desc: "Full session history with device and location tracking per user.",
      },
    ],
  },

  {
    label: "Access Control & Admin",
    services: [
      {
        icon: <UsersRound className="w-6 h-6" />,
        title: "OAuth2 (Google / GitHub)",
        desc: "One-click social login with the most popular identity providers.",
      },
      {
        icon: <UserCog className="w-6 h-6" />,
        title: "RBAC (Admin / User)",
        desc: "Role-based access control enforced at the endpoint level.",
      },
      {
        icon: <LayoutDashboard className="w-6 h-6" />,
        title: "Admin Dashboard",
        desc: "Manage users, roles, and sessions from a single control panel.",
      },
    ],
  },

  {
    label: "Enterprise & Compliance",
    services: [
      {
        icon: <SlidersHorizontal className="w-6 h-6" />,
        title: "Fine-Grained Permissions",
        desc: "ABAC/PBAC policies for granular, attribute-based access rules.",
      },
      {
        icon: <Building2 className="w-6 h-6" />,
        title: "Organizations & Teams",
        desc: "Multi-tenant workspaces with team-level roles and boundaries.",
      },
      {
        icon: <FileClock className="w-6 h-6" />,
        title: "Audit Logs",
        desc: "Compliance-ready, tamper-evident records of every sensitive action.",
      },
      {
        icon: <Gauge className="w-6 h-6" />,
        title: "Risk Score",
        desc: "Adaptive risk scoring on login attempts based on behavior and context.",
      },
    ],
  },
];

export const Services = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      {/* Header */}

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Services
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Everything AuthX provides — from day-one essentials to
          enterprise-grade controls.
        </p>
      </div>

      {/* Categories */}

      <div className="max-w-6xl mx-auto space-y-16">
        {categories.map((cat) => (
          <div key={cat.label}>
            {/* Category heading */}

            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-primary" />

              <h2 className="text-xl font-semibold tracking-tight">
                {cat.label}
              </h2>
            </div>

            {/* Services */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.services.map((service) => (
                <Card
                  key={service.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    border
                    bg-card
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-primary/40
                    hover:shadow-lg
                  "
                >
                  <CardContent className="p-6">
                    {/* Icon */}

                    <div
                      className="
                        mb-5
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary/10
                        text-primary
                        transition-all
                        duration-300
                        group-hover:bg-primary
                        group-hover:text-primary-foreground
                      "
                    >
                      {service.icon}
                    </div>

                    {/* Title */}

                    <h3
                      className="
                        text-lg
                        font-semibold
                        tracking-tight
                        transition-colors
                        duration-300
                        group-hover:text-primary
                      "
                    >
                      {service.title}
                    </h3>

                    {/* Description */}

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-muted-foreground
                      "
                    >
                      {service.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

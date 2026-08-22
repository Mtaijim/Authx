import useAuthStore from "@/auth/store.ts";
import { Button } from "./ui/button.tsx";
import { NavLink, useNavigate } from "react-router";
import { isAdmin } from "@/utils/roles";
import { ThemeToggle } from "./ThemeToggle.tsx";
import {
  User,
  History,
  Building2,
  Shield,
  Lock,
  AlertTriangle,
} from "lucide-react";

const Navbar = () => {
  const checkLogin = useAuthStore((state) => state.checkLogin);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b border-border bg-background text-foreground">
      {/* ── Logo ── */}
      <NavLink to="/dashboard">
        <span className="rounded border border-border bg-card px-4 py-1.5 text-sm font-bold tracking-wide shadow-sm">
          Auth<span className="text-primary">X</span>
        </span>
      </NavLink>

      {/* ── Nav links ── */}
      <div className="flex items-center gap-4">
        {<ThemeToggle />}
        {checkLogin() ? (
          <>
            {/* Profile avatar */}
            <NavLink to="/dashboard/profile">
              {user?.image ? (
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={user.image}
                  alt="avatar"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </NavLink>

            {/* Organizations */}
            <NavLink
              to="/orgs"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors
                 ${isActive ? "text-foreground" : "text-muted-foreground"}`
              }
            >
              <Building2 className="w-4 h-4" />
              Orgs
            </NavLink>

            {/* Login History */}
            <NavLink
              to="/dashboard/history"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors
                 ${isActive ? "text-foreground" : "text-muted-foreground"}`
              }
            >
              <History className="w-4 h-4" />
              History
            </NavLink>

            {/* Admin links — only for admins */}
            {isAdmin(user) && (
              <>
                <NavLink
                  to="/dashboard/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition-colors
                     ${isActive ? "text-foreground" : "text-muted-foreground"}`
                  }
                >
                  <User className="w-4 h-4" />
                  Users
                </NavLink>

                <NavLink
                  to="/dashboard/admin/audit"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition-colors
                     ${isActive ? "text-foreground" : "text-muted-foreground"}`
                  }
                >
                  <Shield className="w-4 h-4" />
                  Audit
                </NavLink>

                <NavLink
                  to="/dashboard/admin/permissions"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition-colors
                     ${isActive ? "text-foreground" : "text-muted-foreground"}`
                  }
                >
                  <Lock className="w-4 h-4" />
                  Permissions
                </NavLink>

                <NavLink
                  to="/dashboard/admin/risk"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition-colors
                     ${isActive ? "text-foreground" : "text-muted-foreground"}`
                  }
                >
                  <AlertTriangle className="w-4 h-4" />
                  Risk
                </NavLink>
              </>
            )}

            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              size="sm"
              variant="outline"
              className="cursor-pointer"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-foreground
                 ${isActive ? "text-foreground" : "text-muted-foreground"}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-foreground
                 ${isActive ? "text-foreground" : "text-muted-foreground"}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-foreground
                 ${isActive ? "text-foreground" : "text-muted-foreground"}`
              }
            >
              Services
            </NavLink>

            <NavLink to="/login">
              <Button size="sm" variant="outline" className="cursor-pointer">
                Login
              </Button>
            </NavLink>

            <NavLink to="/signup">
              <Button size="sm" className="cursor-pointer">
                Sign up
              </Button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

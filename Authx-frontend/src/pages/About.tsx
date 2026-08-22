import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import {
  ShieldCheck,
  Lock,
  UsersRound,
  Code,
  Layers,
  Check,
  ArrowRight,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const techStack = [
  "Java",
  "Spring Boot",
  "Spring Security",
  "MySQL",
  "JWT",
  "React",
  "TypeScript",
  "REST API",
];

const featureGroups = [
  {
    label: "Core Authentication",
    items: [
      "Register & Login",
      "JWT + Refresh Token Rotation",
      "Email Verification",
      "Forgot / Reset Password",
      "Email Validation (MX + disposable check)",
    ],
  },
  {
    label: "Security & Protection",
    items: [
      "TOTP / MFA",
      "Rate Limiting & Account Lockout",
      "Token Blacklisting",
      "Suspicious Login Alerts",
      "Login History & Devices",
    ],
  },
  {
    label: "Access Control & Admin",
    items: [
      "OAuth2 (Google / GitHub)",
      "RBAC (Admin / User)",
      "Admin Dashboard",
    ],
  },
  {
    label: "Enterprise & Compliance",
    items: [
      "Fine-Grained Permissions (ABAC/PBAC)",
      "Organizations & Teams",
      "Audit Logs",
      "Risk Score",
    ],
  },
];

const pillars = [
  {
    icon: <Lock className="w-7 h-7" />,
    title: "Security First",
    desc: "Stateless JWTs, hashed backup codes, rotated refresh tokens — built with attacker-resistant defaults from day one.",
  },
  {
    icon: <UsersRound className="w-7 h-7" />,
    title: "Built for Teams",
    desc: "Role-based access control out of the box, with admin tooling for managing users at scale.",
  },
  {
    icon: <Code className="w-7 h-7" />,
    title: "Easy Integration",
    desc: "A clean REST API any frontend or service can consume, regardless of stack.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs font-medium"
          >
            About the project
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Authentication, done once,
            <br />
            <span className="text-primary">done right.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            AuthX is a generic, drop-in authentication and authorization service
            built with Java, Spring Boot, and Spring Security. It provides
            secure authentication, JWT-based sessions, refresh token rotation,
            OAuth2 login, multi-factor authentication, and role-based access
            control.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">What's included</h2>

            <p className="text-muted-foreground">
              Explore the authentication and security capabilities provided by
              AuthX. See the{" "}
              <button
                onClick={() => navigate("/services")}
                className="
                  text-primary
                  font-medium
                  hover:underline
                  underline-offset-4
                "
              >
                full services page
              </button>{" "}
              for details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureGroups.map((group) => (
              <motion.div
                key={group.label}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="
                    group
                    h-full
                    transition-all
                    duration-300
                    hover:border-primary/40
                    hover:shadow-lg
                  "
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-1 h-8 rounded-full bg-primary" />

                      <h3
                        className="
                          text-sm
                          font-semibold
                          leading-5
                          group-hover:text-primary
                          transition-colors
                        "
                      >
                        {group.label}
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="
                            flex
                            items-start
                            gap-2
                            text-sm
                            text-muted-foreground
                          "
                        >
                          <Check
                            className="
                              w-4
                              h-4
                              mt-0.5
                              shrink-0
                              text-primary
                            "
                          />

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/services")}
              className="
                group
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-primary
              "
            >
              View all features in detail
              <ArrowRight
                className="
                  w-4
                  h-4
                  group-hover:translate-x-1
                  transition-transform
                "
              />
            </button>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">
              Built for secure applications
            </h2>

            <p className="text-muted-foreground">
              Simple authentication infrastructure with the security features
              modern applications need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="
                    group
                    h-full
                    transition-all
                    duration-300
                    hover:border-primary/40
                    hover:shadow-lg
                  "
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="
                        mx-auto
                        mb-5
                        flex
                        h-14
                        w-14
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
                      {pillar.icon}
                    </div>

                    <h3
                      className="
                        text-lg
                        font-semibold
                        mb-2
                        group-hover:text-primary
                        transition-colors
                      "
                    >
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-6">
                      {pillar.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              mb-6
              text-muted-foreground
            "
          >
            <Layers className="w-4 h-4" />

            <span
              className="
                text-sm
                font-medium
                uppercase
                tracking-wider
              "
            >
              Built with
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="
                  text-sm
                  px-3
                  py-1.5
                  transition-all
                  duration-200
                  hover:bg-primary
                  hover:text-primary-foreground
                "
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div
          className="
            max-w-5xl
            mx-auto
            px-6
            py-10
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-5
          "
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />

            <span className="text-sm text-muted-foreground">
              AuthX &copy; {new Date().getFullYear()}
            </span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-muted-foreground
              hover:text-foreground
              transition-colors
            "
          >
            <FaGithub className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default About;

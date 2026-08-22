import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  ArrowRight,
  UsersRound,
  Copy,
  Check,
  ShieldCheck,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type JwtToken = {
  header: {
    alg: string;
    typ: string;
  };
  payload: {
    sub: string;
    role: string;
    exp: string;
  };
};

const createToken = (): JwtToken => ({
  header: {
    alg: "HS256",
    typ: "JWT",
  },
  payload: {
    sub: `user_${Math.floor(1000 + Math.random() * 9000)}`,
    role: Math.random() > 0.5 ? "admin" : "user",
    exp: `${Math.floor(1000 + Math.random() * 3000)}s`,
  },
});

const encode = (obj: object) => {
  return btoa(JSON.stringify(obj)).replace(/=/g, "").slice(0, 30) + "...";
};

const AuthHomeHero = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<JwtToken>(createToken());

  const [activeTab, setActiveTab] = useState<
    "encoded" | "header" | "payload" | "signature"
  >("encoded");

  const [copied, setCopied] = useState(false);

  const [password, setPassword] = useState("");

  /* JWT */

  const encodedToken = useMemo(() => {
    return `${encode(token.header)}.${encode(token.payload)}.4f9a1c`;
  }, [token]);

  const generateToken = () => {
    setToken(createToken());
    setActiveTab("encoded");
    setCopied(false);
  };

  const copyToken = async () => {
    await navigator.clipboard.writeText(encodedToken);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  /* Password strength */

  const passwordStrength = useMemo(() => {
    if (!password) {
      return {
        label: "Enter password",
        score: 0,
        requirements: [],
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = "Weak";

    if (score >= 4) {
      label = "Strong";
    } else if (score >= 2) {
      label = "Medium";
    }

    return {
      label,
      score,
      requirements: [
        {
          text: "8+ characters",
          valid: password.length >= 8,
        },
        {
          text: "12+ characters",
          valid: password.length >= 12,
        },
        {
          text: "Uppercase letter",
          valid: /[A-Z]/.test(password),
        },
        {
          text: "Number",
          valid: /[0-9]/.test(password),
        },
        {
          text: "Special character",
          valid: /[^A-Za-z0-9]/.test(password),
        },
      ],
    };
  }, [password]);

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-24">
      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.03]
          bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Status */}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-muted-foreground">
              Authentication system operational
            </span>

            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
        </motion.div>

        {/* Hero */}

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="
              text-5xl
              md:text-7xl
              font-bold
              tracking-tight
            "
          >
            Ship Features.
            <br />
            <span className="text-primary">We'll Handle Security.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.7,
            }}
            className="
              mt-6
              max-w-2xl
              mx-auto
              text-lg
              md:text-xl
              text-muted-foreground
            "
          >
            Built for developers who demand seamless security, lightning-fast
            authentication, and enterprise-grade protection.
          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.7,
            }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              className="rounded-xl px-7 text-lg font-semibold group"
              onClick={() => navigate("/login")}
            >
              Get Started
              <ArrowRight
                className="
                  ml-2
                  h-5
                  w-5
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-7 text-lg font-semibold"
              onClick={() =>
                document.getElementById("jwt-demo")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Security
            </Button>
          </motion.div>
        </div>

        {/* JWT Demo */}

        <motion.div
          id="jwt-demo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.7,
          }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <Card className="bg-card/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}

              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-semibold">JWT Security</p>

                    <p className="text-xs text-muted-foreground">
                      Interactive token demo
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateToken}
                    className="gap-2"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Generate
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToken}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tabs */}

              <div className="flex gap-2 p-4 border-b overflow-x-auto">
                {["encoded", "header", "payload", "signature"].map((tab) => (
                  <Button
                    key={tab}
                    size="sm"
                    variant={activeTab === tab ? "default" : "outline"}
                    onClick={() =>
                      setActiveTab(
                        tab as "encoded" | "header" | "payload" | "signature",
                      )
                    }
                    className="capitalize"
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {/* Content */}

              <div className="p-6 min-h-[220px]">
                <AnimatePresence mode="wait">
                  {/* Encoded */}

                  {activeTab === "encoded" && (
                    <motion.div
                      key="encoded"
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: 10,
                      }}
                    >
                      <p className="text-xs text-muted-foreground mb-3">
                        ENCODED JWT
                      </p>

                      <div
                        className="
                        rounded-xl
                        bg-muted/50
                        border
                        p-4
                        font-mono
                        text-sm
                        break-all
                        text-primary
                      "
                      >
                        {encodedToken}
                      </div>
                    </motion.div>
                  )}

                  {/* Header */}

                  {activeTab === "header" && (
                    <motion.div
                      key="header"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-xs text-muted-foreground mb-3">
                        HEADER
                      </p>

                      <pre className="rounded-xl bg-muted/50 border p-5 text-sm">
                        {JSON.stringify(token.header, null, 2)}
                      </pre>
                    </motion.div>
                  )}

                  {/* Payload */}

                  {activeTab === "payload" && (
                    <motion.div
                      key="payload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-xs text-muted-foreground mb-3">
                        PAYLOAD
                      </p>

                      <pre className="rounded-xl bg-muted/50 border p-5 text-sm">
                        {JSON.stringify(token.payload, null, 2)}
                      </pre>
                    </motion.div>
                  )}

                  {/* Signature */}

                  {activeTab === "signature" && (
                    <motion.div
                      key="signature"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-xs text-muted-foreground mb-3">
                        SIGNATURE
                      </p>

                      <div
                        className="
                        rounded-xl
                        border
                        bg-emerald-500/10
                        p-5
                      "
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-8 w-8 text-emerald-500" />

                          <div>
                            <p className="font-semibold text-emerald-500">
                              Signature Verified
                            </p>

                            <p className="text-sm text-muted-foreground">
                              HMAC SHA-256 signature matches
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}

              <div
                className="
                flex
                items-center
                justify-between
                border-t
                px-6
                py-4
              "
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Token validated
                </div>

                <span className="font-mono text-xs text-muted-foreground">
                  HS256
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Analyzer */}

        <div className="mt-8 max-w-3xl mx-auto">
          <Card className="bg-card/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <KeyRound className="h-5 w-5 text-primary" />

                <div>
                  <p className="font-semibold">Password Analyzer</p>

                  <p className="text-xs text-muted-foreground">
                    Check password strength
                  </p>
                </div>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password..."
                className="
                  w-full
                  rounded-lg
                  border
                  bg-background
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-primary/40
                "
              />

              {password && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="mt-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Strength
                    </span>

                    <span className="text-xs font-semibold">
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className={`
                            h-1.5
                            flex-1
                            rounded-full
                            ${
                              item <= passwordStrength.score
                                ? "bg-primary"
                                : "bg-muted"
                            }
                          `}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {passwordStrength.requirements.map((requirement) => (
                      <div
                        key={requirement.text}
                        className="flex items-center gap-2 text-xs"
                      >
                        {requirement.valid ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <span className="h-3.5 w-3.5 rounded-full border" />
                        )}

                        <span>{requirement.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="rounded-xl px-8 gap-2 group"
            onClick={() => navigate("/signup")}
          >
            Create free account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-xl px-8 gap-2"
            onClick={() => window.open("https://github.com", "_blank")}
          >
            <UsersRound className="h-4 w-4" />
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AuthHomeHero;

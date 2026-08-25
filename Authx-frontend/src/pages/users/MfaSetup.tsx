import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MfaSetupResponse } from "@/models/MfaModel";
import { getMfaSetup, verifyMfaSetup } from "@/services/MfaServices";
import { CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

const MfaSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"loading" | "scan" | "done">("loading");
  const [setupData, setSetupData] = useState<MfaSetupResponse | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMfaSetup()
      .then((data) => {
        setSetupData(data);
        setStep("scan");
      })
      .catch(() => {
        setError("failed to Stasrt Mfa Setup . please try again");
        setStep("scan");
      });
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the code from your authenticator app.");
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const result = await verifyMfaSetup(code.trim());
      setBackupCodes(result.codes);
      setStep("done");
      toast.success("Mfa enabled successfully !!");
    } catch (err: any) {
      setError(err.response?.data?.message || "invalid code . try again .");
    } finally {
      setVerifying(false);
    }
  };
  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      toast.success("Secret copied");
    }
  };
  const copyAllCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("Backup codes copied");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          {step === "loading" && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-muted border-t-primary mx-auto" />
            </div>
          )}

          {step === "scan" && setupData && (
            <>
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold">Set up 2FA</h1>
                <p className="text-muted-foreground text-sm">
                  Scan this QR code with Google Authenticator, Authy, or any
                  TOTP app.
                </p>
              </div>

              <div className="flex justify-center">
                <img
                  src={setupData.Qrcode}
                  alt="MFA QR code"
                  className="w-48 h-48 rounded-lg border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Can't scan? Enter manually</Label>
                <div className="flex gap-2">
                  <Input
                    value={setupData.secret}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copySecret}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Enter the 6-digit code to confirm
                  </Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={verifying}>
                  {verifying ? "Verifying..." : "Enable 2FA"}
                </Button>
              </form>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-sm text-muted-foreground hover:underline"
              >
                Cancel
              </button>
            </>
          )}

          {step === "done" && (
            <>
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-green-50">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold">2FA is enabled</h1>
                <p className="text-muted-foreground text-sm">
                  Save these backup codes somewhere safe. Each one can be used
                  once if you lose access to your authenticator app.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={copyAllCodes}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy all codes
              </Button>

              <Button
                className="w-full"
                onClick={() => navigate("/dashboard/profile")}
              >
                Done
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MfaSetup;

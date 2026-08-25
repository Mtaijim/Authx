import type { MfaStatusResponse } from "@/models/MfaModel";
import {
  disableMfa,
  getMfaStatus,
  regenerateBackupCodes,
} from "@/services/MfaServices";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Card, CardContent } from "./ui/card";
import { Badge, RefreshCw, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const MfaSettingCard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<MfaStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmCode, setConfirmCode] = useState("");
  const [actionMode, setActionMode] = useState<"disable" | "regenerate" | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [regeneratedCodes, setRegeneratedCodes] = useState<string[] | null>(
    null,
  );

  const loadStatus = () => {
    setLoading(true);
    getMfaStatus()
      .then(setStatus)
      .catch(() => toast.error("Failed to load MFA status"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleConfirm = async () => {
    if (!confirmCode.trim()) {
      toast.error("Enter your current code to continue");
      return;
    }
    setSubmitting(true);
    try {
      if (actionMode === "disable") {
        await disableMfa(confirmCode.trim());
        toast.success("Mfa disabled");
        setActionMode(null);
        setConfirmCode("");
        loadStatus();
      } else if (actionMode === "regenerate") {
        const result = await regenerateBackupCodes(confirmCode.trim());
        setRegeneratedCodes(result.codes);
        setActionMode(null);
        setConfirmCode("");
        loadStatus();
      }
    } catch {
      toast.error("Invalid code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading 2FA settings...
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="pt-5 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Two-Factor Authentication
            </p>
          </div>
          <Badge
            className={
              status?.mfaEnabled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }
          >
            {status?.mfaEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {!status?.mfaEnabled && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
            <Button size="sm" onClick={() => navigate("/dashboard/mfa/setup")}>
              Enable
            </Button>
          </div>
        )}

        {status?.mfaEnabled && !actionMode && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {status.backUpCodesRemaining} backup code
              {status.backUpCodesRemaining === 1 ? "" : "s"} remaining.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActionMode("regenerate")}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Regenerate codes
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => setActionMode("disable")}
              >
                <ShieldOff className="w-3.5 h-3.5 mr-1.5" />
                Disable 2FA
              </Button>
            </div>
          </div>
        )}

        {actionMode && (
          <div className="space-y-3 pt-2 border-t">
            <p className="text-sm">
              Enter your current authenticator code to{" "}
              {actionMode === "disable"
                ? "disable 2FA"
                : "regenerate backup codes"}
              .
            </p>
            <div className="flex gap-2">
              <Input
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="123456"
              />
              <Button onClick={handleConfirm} disabled={submitting}>
                {submitting ? "..." : "Confirm"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setActionMode(null);
                  setConfirmCode("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {regeneratedCodes && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-medium">
              New backup codes — save these now:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 gap-2 font-mono text-xs">
              {regeneratedCodes.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRegeneratedCodes(null)}
            >
              Done
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MfaSettingCard;

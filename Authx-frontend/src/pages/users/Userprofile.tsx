import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pencil,
  LogOut,
  Mail,
  Shield,
  Globe,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
} from "lucide-react";
import useAuthStore from "@/auth/store";
import { updateUser } from "@/services/Authservice";
import { useNavigate } from "react-router";
import MfaSettingsCard from "@/components/MfaSettingCard";

interface EditForm {
  name: string;
  phone: string;
  bio: string;
  organization: string;
  timezone: string;
  enable: boolean;
}

const UserProfile: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const changeLocalLoginData = useAuthStore((s) => s.changeLocalLoginData);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({
    name: "",
    phone: "",
    bio: "",
    organization: "",
    timezone: "",
    enable: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: (user as any).phone ?? "",
        bio: (user as any).bio ?? "",
        organization: (user as any).organization ?? "",
        timezone: (user as any).timezone ?? detectedTimezone,
        enable: user.enable ?? false,
      });
    }
  }, [user]);

  const setField = (key: keyof EditForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onEdit = () => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: (user as any).phone ?? "",
        bio: (user as any).bio ?? "",
        organization: (user as any).organization ?? "",
        timezone: (user as any).timezone ?? detectedTimezone,
        enable: user.enable ?? false,
      });
    }
    setError(null);
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const onSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    try {
      const serverUser = await updateUser(user.id, form);
      changeLocalLoginData(accessToken ?? "", serverUser, true);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSignOut = () => {
    (logout as any)?.();
    navigate("/login");
  };

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = (user as any)?.createdAt
    ? new Date((user as any).createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top navigation bar */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-semibold">Account Settings</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
        {/* ── Profile header card ── */}
        <Card>
          <CardContent className="pt-6 pb-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Avatar className="w-16 h-16 shrink-0 ring-2 ring-background shadow-sm">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold leading-tight truncate">
                    {user.name || "Unnamed User"}
                  </h2>
                  <Badge
                    variant="secondary"
                    className={
                      user.enable
                        ? "text-green-700 bg-green-50 border border-green-200 text-xs"
                        : "text-muted-foreground text-xs"
                    }
                  >
                    {user.enable ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {user.email}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {user.roles?.[0]?.name && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      {user.roles[0].name}
                    </span>
                  )}
                  {user.provider && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                      <Globe className="w-3 h-3" />
                      {user.provider}
                    </span>
                  )}
                  {memberSince && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Joined {memberSince}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit button */}
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        {/* ── Personal information card ── */}
        <Card>
          <CardContent className="pt-5 pb-6 space-y-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Personal Information
            </p>
            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={isEditing ? form.name : user.name || ""}
                  onChange={(e) => setField("name", e.target.value)}
                  readOnly={!isEditing}
                  placeholder="Your full name"
                  className={!isEditing ? "bg-muted/50 cursor-default" : ""}
                />
              </div>

              {/* Email — always read-only */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    value={user.email}
                    readOnly
                    className="bg-muted/50 cursor-default pl-9"
                  />
                </div>
              </div>

              {/* Timezone */}
            </div>

            {/* Bio — full width */}
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-sm">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={isEditing ? form.bio : (user as any).bio || ""}
                onChange={(e) => setField("bio", e.target.value)}
                readOnly={!isEditing}
                placeholder="Tell your team a little about yourself…"
                rows={3}
                className={`resize-none ${!isEditing ? "bg-muted/50 cursor-default" : ""}`}
              />
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2.5">
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Edit-mode action buttons */}
            {isEditing && (
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={onSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        {/* ── Account details (read-only) ── */}
        <Card>
          <CardContent className="pt-5 pb-6 space-y-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account Details
            </p>
            <Separator />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Provider</p>
                <p className="font-medium capitalize">{user.provider || "—"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <p className="font-medium">{user.roles?.[0]?.name ?? "—"}</p>
              </div>

              {memberSince && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Member Since
                  </p>
                  <p className="font-medium">{memberSince}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p
                  className={`font-medium ${
                    user.enable ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {user.enable ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* ── MFA settings ── */} {/* ✅ ADD THIS */}
        <MfaSettingsCard />
        {/* ── Sign out card ── */}
        <Card className="border-destructive/20">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sign out</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You'll need to log back in to continue.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onSignOut}
                className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;

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

const RANDOM_BIOS = [
  "Building things that make the web a little better.",
  "Code. Learn. Build. Repeat.",
  "Turning ideas into useful applications.",
  "Full-stack developer exploring modern technologies.",
  "Always learning, always building.",
  "Passionate about software and problem solving.",
  "Building secure and scalable applications.",
  "Developer by day, problem solver by nature.",
  "Exploring technology one project at a time.",
  "Turning coffee into code.",
  "Learning something new with every project.",
  "Building the future one line at a time.",
];

const getRandomBio = () => {
  return RANDOM_BIOS[Math.floor(Math.random() * RANDOM_BIOS.length)];
};

interface EditForm {
  name: string;
  phone: string;
  organization: string;
  timezone: string;
  enable: boolean;
}

const UserProfile: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const changeLocalLoginData = useAuthStore(
    (state) => state.changeLocalLoginData,
  );
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bio, setBio] = useState("");

  const [form, setForm] = useState<EditForm>({
    name: "",
    phone: "",
    organization: "",
    timezone: "",
    enable: false,
  });

  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Load user data
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      phone: (user as any).phone ?? "",
      organization: (user as any).organization ?? "",
      timezone: (user as any).timezone ?? detectedTimezone,
      enable: user.enable ?? false,
    });

    setBio(getRandomBio());
  }, [user]);

  // Update form fields
  const setField = (field: keyof EditForm, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Open edit mode
  const handleEdit = () => {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      phone: (user as any).phone ?? "",
      organization: (user as any).organization ?? "",
      timezone: (user as any).timezone ?? detectedTimezone,
      enable: user.enable ?? false,
    });

    setError(null);
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  // Save user changes
  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedUser = await updateUser(user.id, form);

      changeLocalLoginData(accessToken ?? "", updatedUser, true);

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Logout
  const handleSignOut = () => {
    logout?.();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-base font-semibold">Account Settings</h1>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
        {/* Profile */}
        <Card>
          <CardContent className="pt-6 pb-5">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 shrink-0">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold truncate">
                    {user.name || "Unnamed User"}
                  </h2>

                  <Badge
                    variant="secondary"
                    className={
                      user.enable
                        ? "text-green-700 bg-green-50 border-green-200"
                        : "text-muted-foreground"
                    }
                  >
                    {user.enable ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {user.email}
                </p>

                <div className="flex flex-wrap gap-3 mt-2">
                  {user.roles?.[0]?.name && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      {user.roles[0].name}
                    </span>
                  )}

                  {user.provider && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
                      <Globe className="w-3 h-3" />
                      {user.provider}
                    </span>
                  )}

                  {memberSince && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Joined {memberSince}
                    </span>
                  )}
                </div>
              </div>

              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Pencil className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardContent className="pt-5 pb-6 space-y-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Personal Information
            </p>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>

                <Input
                  id="name"
                  value={isEditing ? form.name : user.name || ""}
                  onChange={(e) => setField("name", e.target.value)}
                  readOnly={!isEditing}
                  placeholder="Your full name"
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    id="email"
                    value={user.email}
                    readOnly
                    className="bg-muted/50 pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>

              <Textarea
                id="bio"
                value={bio}
                readOnly
                rows={3}
                className="resize-none bg-muted/50"
              />

              <p className="text-xs text-muted-foreground">
                Bio is automatically generated.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2.5">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Save / Cancel */}
            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
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

        {/* Account Details */}
        <Card>
          <CardContent className="pt-5 pb-6 space-y-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account Details
            </p>

            <Separator />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Provider</p>
                <p className="font-medium capitalize">{user.provider || "—"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <p className="font-medium">{user.roles?.[0]?.name || "—"}</p>
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
                  className={
                    user.enable
                      ? "font-medium text-green-600"
                      : "font-medium text-muted-foreground"
                  }
                >
                  {user.enable ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MFA */}
        <MfaSettingsCard />

        {/* Sign Out */}
        <Card className="border-destructive/20">
          <CardContent className="py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-destructive" />
                </div>

                <div>
                  <p className="text-sm font-medium">Sign out</p>

                  <p className="text-xs text-muted-foreground">
                    You'll need to log back in to continue.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
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

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import DashboardNav from "@/components/layout/DashboardNav";
import { PaymentRequired } from "@/components/PaymentRequired";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getTierLabel, getTierColor } from "@/lib/utils";
import { User, Lock, Bell, Shield } from "lucide-react";

export default function DashboardSettings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    country: user?.country ?? "",
    school: user?.school ?? "",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? "",
        phone: user.phone ?? "",
        country: user.country ?? "",
        school: user.school ?? "",
      });
    }
  }, [user]);

  // Check if user signed up with Google OAuth (no password)
  const isGoogleUser = user && !user.passwordHash;

  // Profile update mutation
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      // Refresh user data
      window.location.reload();
    },
    onError: (error) => {
      alert(`Failed to update profile: ${error.message}`);
    },
  });

  // Payment gate check - only for non-admin users
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  if (!isAdmin && !user?.hasPaid) {
    return (
      <div className="min-h-screen bg-[#f5f4f1] flex">
        <DashboardNav />
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            <PaymentRequired />
            {/* Preview of settings (grayed out) */}
            <div className="opacity-40 pointer-events-none">
              <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Settings</h1>
              <div className="grid gap-6">
                <Card className="border-neutral-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input value="Locked" disabled />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value="Locked" disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: Implement profile update mutation
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <DashboardNav />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0d0d0d]">Settings</h1>
            <p className="text-sm text-neutral-500 mt-1">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Information */}
            <Card className="border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <p className="text-sm text-neutral-500 mt-1">Update your personal details</p>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email ?? ""} disabled />
                    <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Nigeria"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="school">School/University</Label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      disabled={!isEditing}
                      placeholder="University of Lagos"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0d0d0d]">Membership Tier</p>
                    <p className="text-xs text-neutral-500">Your current membership level</p>
                  </div>
                  <Badge className={getTierColor(user?.tier ?? "starter")}>
                    {getTierLabel(user?.tier ?? "starter")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0d0d0d]">Payment Status</p>
                    <p className="text-xs text-neutral-500">Your payment verification status</p>
                  </div>
                  <Badge variant={user?.hasPaid ? "default" : "secondary"}>
                    {user?.hasPaid ? "Paid" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0d0d0d]">Email Verification</p>
                    <p className="text-xs text-neutral-500">Verify your email address</p>
                  </div>
                  <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                    {user?.emailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0d0d0d]">Phone Verification</p>
                    <p className="text-xs text-neutral-500">Verify your phone number</p>
                  </div>
                  <Badge variant={user?.phoneVerified ? "default" : "secondary"}>
                    {user?.phoneVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security
                </CardTitle>
                <p className="text-sm text-neutral-500">Manage your password and security settings</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Password Management */}
                {isGoogleUser ? (
                  // Google OAuth user - offer to set password
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0d0d0d]">Password</p>
                      <p className="text-xs text-neutral-500">Signed in with Google • Add password for email login</p>
                    </div>
                    <SetPasswordDialog />
                  </div>
                ) : (
                  // Email/password user - offer to change password
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0d0d0d]">Password</p>
                      <p className="text-xs text-neutral-500">Change your account password</p>
                    </div>
                    <ChangePasswordDialog />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0d0d0d]">Two-Factor Authentication</p>
                    <p className="text-xs text-neutral-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <p className="text-sm text-neutral-500">Manage how you receive notifications</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0d0d0d]">Email Notifications</p>
                    <p className="text-xs text-neutral-500">Receive updates via email</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0d0d0d]">WhatsApp Notifications</p>
                    <p className="text-xs text-neutral-500">Receive updates via WhatsApp</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
                <p className="text-sm text-red-600/70">Irreversible actions</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Delete Account</p>
                    <p className="text-xs text-red-600/70">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" size="sm" disabled>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Set Password Dialog (for Google OAuth users)
function SetPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const setPasswordMutation = trpc.auth.setPassword.useMutation({
    onSuccess: () => {
      setOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      alert("Password set successfully! You can now login with email and password.");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPasswordMutation.mutate({ newPassword });
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Set Password
      </Button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Set Password</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Add a password to enable email/password login in addition to Google sign-in.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={setPasswordMutation.isPending}>
                  {setPasswordMutation.isPending ? "Setting..." : "Set Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Change Password Dialog (for email/password users)
function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      setOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      alert("Password changed successfully!");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Change Password
      </Button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-password-change">New Password</Label>
                <Input
                  id="new-password-change"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password-change">Confirm New Password</Label>
                <Input
                  id="confirm-password-change"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

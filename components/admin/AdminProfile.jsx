"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";
import { User, Mail, Building2, Image as ImageIcon, Lock, Save, Loader2, Trophy, Star, TrendingUp, Award } from "lucide-react";
import universities from "@/constants/university.json";

const AdminProfile = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        avatar: "",
        university: "",
        punya: 0,
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (status === "authenticated" && session?.user?.email) {
                try {
                    const response = await axios.get("/api/user/profile");
                    if (response.data) {
                        setProfileData({
                            name: response.data.name || "",
                            email: response.data.email || "",
                            avatar: response.data.avatar || "",
                            university: response.data.university || "",
                            punya: response.data.punya || 0,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    toast.error("Failed to load profile data");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();
    }, [session, status]);

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!profileData.name.trim()) {
            toast.error("Name is required");
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.patch("/api/user/profile", {
                name: profileData.name,
                avatar: profileData.avatar,
                university: profileData.university,
            });

            if (response.status === 201 || response.status === 200) {
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            const response = await axios.patch("/api/user/changepwd", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                sessionData: session?.user?.email,
            });

            if (response.status === 201) {
                toast.success("Password changed successfully");
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            const errorMessage = error.response?.data || error.response?.statusText || "Failed to change password";
            toast.error(errorMessage);
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl w-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-sm text-base-content/70 mt-1">Manage your account information and preferences</p>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Information Card */}
                    <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
                        <div className="bg-primary/5 px-4 py-3 border-b border-base-300">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile Information
                            </h2>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="p-4 sm:p-5 space-y-4">
                            {/* Avatar Preview */}
                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-16 h-16 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-2">
                                        {profileData.avatar ? (
                                            <img
                                                src={profileData.avatar}
                                                alt={profileData.name}
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.nextSibling.style.display = "flex";
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-full h-full bg-primary/20 flex items-center justify-center"
                                            style={{ display: profileData.avatar ? "none" : "flex" }}
                                        >
                                            <span className="text-2xl font-bold text-primary">
                                                {profileData.name?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold">{profileData.name}</h3>
                                    <p className="text-xs text-base-content/60">{profileData.email}</p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Name */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-sm font-medium flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            Name
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="input input-sm input-bordered w-full"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                {/* Email (Read-only) */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-sm font-medium flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5" />
                                            Email
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        className="input input-sm input-bordered w-full bg-base-200 cursor-not-allowed"
                                        disabled
                                    />
                                </div>

                                {/* University */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-sm font-medium flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5" />
                                            University
                                        </span>
                                    </label>
                                    <select
                                        value={profileData.university}
                                        onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                                        className="select select-sm select-bordered w-full"
                                    >
                                        <option value="" disabled>Select your university</option>
                                        {universities.map((uni) => (
                                            <option key={uni.id || uni.name} value={uni.id || uni.name}>
                                                {uni.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Avatar URL */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-sm font-medium flex items-center gap-1.5">
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            Avatar URL
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={profileData.avatar}
                                        onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                        className="input input-sm input-bordered w-full"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end pt-3 border-t border-base-200">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn btn-sm btn-primary gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-3.5 h-3.5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
                        <div className="bg-primary/5 px-4 py-3 border-b border-base-300">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Change Password
                            </h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="p-4 sm:p-5 space-y-3">
                            {/* Old Password */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-sm font-medium">Current Password</span>
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="input input-sm input-bordered w-full"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* New Password */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-sm font-medium">New Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="input input-sm input-bordered w-full"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-sm font-medium">Confirm New Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="input input-sm input-bordered w-full"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            {/* Change Password Button */}
                            <div className="flex justify-end pt-3 border-t border-base-200">
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="btn btn-sm btn-primary gap-2"
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Changing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3.5 h-3.5" />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column - Punya Points Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-xl">
                            {/* Decorative Background */}
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                            {/* Animated Stars */}
                            <div className="absolute top-4 right-12 animate-pulse">
                                <Star className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                            </div>
                            <div className="absolute bottom-6 right-8 animate-pulse delay-150">
                                <Star className="w-3 h-3 text-yellow-100 fill-yellow-100" />
                            </div>

                            <div className="relative p-5">
                                {/* Trophy Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                                        <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-2xl border-2 border-white/30">
                                            <Trophy className="w-10 h-10 text-yellow-100" />
                                        </div>
                                    </div>
                                </div>

                                {/* Punya Info */}
                                <div className="text-center">
                                    <div className="flex items-center gap-1.5 justify-center mb-2">
                                        <Award className="w-4 h-4 text-yellow-100" />
                                        <h2 className="text-base font-bold text-white">Punya Points</h2>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-5xl font-black text-white leading-none mb-1.5">
                                            {profileData.punya || 0}
                                        </div>
                                        <p className="text-yellow-100 text-xs font-medium">
                                            Total contribution points
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                            <TrendingUp className="w-3.5 h-3.5 text-yellow-100" />
                                            <span className="text-white text-xs font-semibold">
                                                +10 per upload
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                            <Star className="w-3.5 h-3.5 text-yellow-100 fill-yellow-100" />
                                            <span className="text-white text-xs font-semibold">
                                                Rank: {profileData.punya >= 100 ? "Gold" : profileData.punya >= 50 ? "Silver" : "Bronze"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Gradient Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Envelope, Lock, Eye, EyeSlash, User, ArrowRight } from "@phosphor-icons/react";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.error || "Registration failed");
        return;
      }

      showToast("success", "Account created successfully!");
      router.push("/login");
    } catch {
      showToast("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="glow-blob bg-primary w-[500px] h-[500px] top-[-150px] right-[-150px]" />
      <div className="glow-blob bg-accent w-[600px] h-[600px] bottom-[-200px] left-[-200px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-heading font-bold text-white">Nova</span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Create account</h1>
          <p className="text-text-muted">Start organizing your team's work</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Name"
              type="text"
              placeholder="John Doe"
              icon={<User size={20} />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Envelope size={20} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                icon={<Lock size={20} />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              icon={<Lock size={20} />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary-hover transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

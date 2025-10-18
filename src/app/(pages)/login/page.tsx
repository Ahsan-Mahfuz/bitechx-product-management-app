"use client";
import React, { useState } from "react";
import { Mail, ArrowRight, Zap } from "lucide-react";
import { useSignInMutation } from "@/app/redux/authApis";
import { useRouter } from "next/navigation";

const Login = () => {
  const navigate = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [loginUser, { isLoading }] = useSignInMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await loginUser({ email }).unwrap();

      if (res) {
        localStorage.setItem("token", res.token);
        navigate.push("/product");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as { data?: { message?: string } }).data;
        setError(errorData?.message || "Something went wrong during login");
      } else {
        setError("Something went wrong during login");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl p-8 shadow-2xl bg-black">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-white p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
              Product Hub
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-300 text-sm">
              Sign in to access the product hub
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Gmail Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-white/50 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10">
                {isLoading ? "Signing in..." : "Sign In"}
              </span>
              {!isLoading && (
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

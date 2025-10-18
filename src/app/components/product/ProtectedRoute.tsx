"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token)
    return <p className="text-center mt-12">Redirecting to login...</p>;

  return <>{children}</>;
};

export default ProtectedRoute;

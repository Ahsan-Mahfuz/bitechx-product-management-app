"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/product");
    }
  }, [router]);

  return <p className="text-center mt-12">Checking authentication...</p>;
}

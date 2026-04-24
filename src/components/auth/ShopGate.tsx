import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";

const PASSWORD = "LEGENDS26"; // Simple shared password

export function ShopGate({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

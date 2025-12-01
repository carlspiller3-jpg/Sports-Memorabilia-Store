import { ShieldCheck, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustBadgeProps {
    type: "authenticated" | "verified"
    className?: string
}

export function TrustBadge({ type, className }: TrustBadgeProps) {
    if (type === "authenticated") {
        return (
            <div className={cn("flex items-center gap-2 px-4 py-2 bg-navy/5 border border-navy/10 rounded-full", className)}>
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-xs font-semibold tracking-wider uppercase text-navy">Authenticity Guaranteed</span>
            </div>
        )
    }

    return (
        <div className={cn("flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full", className)}>
            <CheckCircle className="w-5 h-5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-charcoal">NFC Verified</span>
        </div>
    )
}

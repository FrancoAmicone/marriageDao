/**
 * Purpose: Homepage for HumanBond
 * Landing page with World ID verification before accessing the app
 * Users must verify as human before proceeding
 */

'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWorldVerification } from "@/lib/worldcoin/useWorldVerification";
import { WORLD_ACTIONS } from "@/lib/worldcoin/initMiniKit";
import { useAuthStore } from "@/state/authStore";
import { isInWorldApp } from "@/lib/worldcoin/initMiniKit";
import Image from "next/image";
import { ScanFace, Globe } from "lucide-react";
import { useHydrated } from "@/lib/hooks/useHydrated";
import dynamic from "next/dynamic";

const WorldAppChecker = dynamic(
  () => import("./components/WorldAppChecker").then(m => m.WorldAppChecker),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  const { verify, isVerifying, error } = useWorldVerification();
  const { setVerified, isVerified, checkVerificationExpiry } = useAuthStore();
  const [showError, setShowError] = useState<string | null>(null);
  const [showWorldAppDialog, setShowWorldAppDialog] = useState(false);
  const isMounted = useHydrated();

  /**
   * Handle "Get started" button click
   * Verifies user with World ID before allowing access
   */
  const handleGetStarted = async () => {
    setShowError(null);

    // Check if running in World App
    if (!isInWorldApp()) {
      setShowWorldAppDialog(true);
      return;
    }

    // If already verified, just navigate
    if (isVerified && checkVerificationExpiry()) {
      router.push("/home");
      return;
    }

    try {
      // Request World ID verification
      // Using APP_ACCESS action for general app access (unlimited verifications)
      const result = await verify(
        WORLD_ACTIONS.APP_ACCESS,
        undefined, // No signal needed for general access
      );

      if (!result.success) {
        setShowError(result.error || "Verification failed. Please try again.");
        return;
      }

      // Save verification to store (including proof for on-chain verification)
      setVerified({
        proof: result.proof!,
        merkle_root: result.merkle_root!,
        nullifier_hash: result.nullifier_hash!,
        verification_level: result.verification_level!,
        verified_at: Date.now(),
      });

      // Navigate to home
      router.push("/home");
    } catch (err) {
      console.error("Verification error:", err);
      setShowError("An unexpected error occurred. Please try again.");
    }
  };

  // Don't render World App specific UI until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#E8E8E8] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="flex flex-col items-center text-center space-y-8 max-w-2xl relative z-10">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-[0.8]">
              Human<br /><span className="text-gray-400">Bond</span>
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E8E8] flex flex-col relative overflow-hidden">
      {/* Main content - centered */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12 max-w-sm mx-auto">

          {/* Logo / Image */}
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.05)] mb-4 animate-in fade-in zoom-in duration-700">
            <Image
              src="/Isotype.png"
              alt="HumanBond Logo"
              width={70}
              height={70}
              className="hover:scale-105 transition-transform"
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          {/* Title Section */}
          <div className="space-y-6">
            <h1 className="text-6xl font-black text-black tracking-tighter leading-[0.9]">
              Human<br />
              <span className="text-gray-400">Bond</span>
            </h1>

            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[280px] mx-auto">
              The first protocol for eternalizing relationships on Worldchain. Verify your love, earn TIME.
            </p>
          </div>

          {/* Action Section */}
          <div className="w-full space-y-6">
            <button
              onClick={handleGetStarted}
              disabled={isVerifying}
              className="group w-full bg-black text-white px-8 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-gray-900 transition-all duration-300 shadow-xl shadow-gray-200 flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ScanFace size={20} className="text-white group-hover:text-emerald-400 transition-colors" />
                  <span>{isVerified && checkVerificationExpiry() ? "Enter Protocol" : "Verify World ID"}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Globe size={12} />
              <span>Secured by Worldcoin</span>
            </div>
          </div>

          {/* Error message */}
          {(showError || error) && (
            <div className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-bottom-2">
              <p className="text-xs font-bold text-red-500 text-center">{showError || error}</p>
            </div>
          )}
        </div>
      </main>

      <WorldAppChecker
        isOpen={showWorldAppDialog}
        onOpenChange={setShowWorldAppDialog}
      />
    </div>
  );
}

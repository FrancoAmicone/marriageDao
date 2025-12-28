/**
 * Purpose: Accept Marriage Proposal Form
 * Integrates World ID verification + MiniKit sendTransaction
 * Calls HumanBond.accept() on Worldchain
 * 
 * ON-CHAIN VERIFICATION:
 * - NO SIWE or backend API needed
 * - World ID proof is verified directly on the smart contract
 * - MiniKit provides wallet address automatically via MiniKit.user
 */

"use client";

import { useState, useEffect } from "react";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI, WORLD_APP_CONFIG } from "@/lib/contracts";
import { useAuthStore } from "@/state/authStore";
import { isInWorldApp } from "@/lib/worldcoin/initMiniKit";
import { Heart, ScanFace, Globe, Users } from "lucide-react";
import { PrenupModal } from "./PrenupModal";

type AcceptState = "idle" | "verifying" | "sending" | "success" | "error";

export function AcceptProposalForm() {
  const [proposerAddress, setProposerAddress] = useState("");
  const [state, setState] = useState<AcceptState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isWorldApp, setIsWorldApp] = useState(false);
  const [showPrenup, setShowPrenup] = useState(false);

  const { walletAddress, setWalletAddress } = useAuthStore();

  // Check if running in World App on mount
  useEffect(() => {
    const checkWorldApp = () => {
      const inWorld = isInWorldApp();
      setIsWorldApp(inWorld);

      // Auto-update wallet address from MiniKit if available
      if (inWorld && MiniKit.user?.walletAddress && !walletAddress) {
        setWalletAddress(MiniKit.user.walletAddress);
      }
    };

    // Give MiniKit time to initialize
    const timer = setTimeout(checkWorldApp, 300);
    return () => clearTimeout(timer);
  }, [walletAddress, setWalletAddress]);

  /**
   * Decode World ID proof string to uint256[8] array
   */
  const decodeProof = (proof: string): [string, string, string, string, string, string, string, string] => {
    const cleanProof = proof.startsWith("0x") ? proof.slice(2) : proof;
    const proofArray: string[] = [];
    for (let i = 0; i < 8; i++) {
      const chunk = cleanProof.slice(i * 64, (i + 1) * 64);
      proofArray.push(BigInt("0x" + chunk).toString());
    }
    return proofArray as [string, string, string, string, string, string, string, string];
  };

  /**
   * Step 1: Handle initial form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    // Validate proposer address
    if (!proposerAddress || !/^0x[a-fA-F0-9]{40}$/.test(proposerAddress)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    if (!isWorldApp) {
      setError("This app must be opened in World App");
      return;
    }

    // Show prenup modal before proceeding
    setShowPrenup(true);
  };

  /**
   * Step 2: Main flow after prenup confirmation: Verify with World ID → Send Transaction
   */
  const handlePrenupConfirm = async () => {
    setShowPrenup(false);

    try {
      setState("verifying");
      const userWallet = MiniKit.user?.walletAddress || walletAddress;

      if (!userWallet) {
        throw new Error("Wallet address not available. Please try again.");
      }

      const { finalPayload: verifyPayload } = await MiniKit.commandsAsync.verify({
        action: WORLD_APP_CONFIG.ACTIONS.ACCEPT_BOND,
        signal: userWallet,
        verification_level: VerificationLevel.Orb,
      });

      if (verifyPayload.status === "error") {
        const errPayload = verifyPayload as any;
        throw new Error(`Verification error: ${errPayload.error_code || "cancelled"}`);
      }

      const merkleRoot = verifyPayload.merkle_root;
      const nullifierHash = verifyPayload.nullifier_hash;
      const proofArray = decodeProof(verifyPayload.proof);

      setState("sending");
      const { finalPayload: txPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: CONTRACT_ADDRESSES.HUMAN_BOND,
            abi: HUMAN_BOND_ABI,
            functionName: "accept",
            args: [
              proposerAddress,
              merkleRoot,
              nullifierHash,
              proofArray,
            ],
          },
        ],
      });

      if (txPayload.status === "error") {
        const errPayload = txPayload as any;
        const errorMsg = errPayload.error_code || errPayload.message || "Unknown error";
        throw new Error(`Transaction failed: ${errorMsg}`);
      }

      setState("success");
      setTxHash(txPayload.transaction_id || null);

    } catch (err) {
      setState("error");
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMsg);
    }
  };

  const isLoading = state === "verifying" || state === "sending";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/[0.03] space-y-8 animate-in fade-in zoom-in duration-500">

        {/* Header Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
            <Users size={32} className="text-white" fill="white" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-black tracking-tighter">
              Accept Bond
            </h1>
            <p className="text-sm font-medium text-gray-400">
              Confirm your union on-chain
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                Proposer Address
              </label>
              <input
                type="text"
                value={proposerAddress}
                onChange={(e) => setProposerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-6 py-5 rounded-3xl bg-gray-50 text-black text-base font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black/5 border border-transparent focus:border-black/5 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Connected Info */}
            {walletAddress && (
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  Signer: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="group w-full bg-black text-white px-8 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-gray-900 transition-all duration-300 shadow-xl shadow-gray-100 flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!proposerAddress || isLoading || !isWorldApp}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <ScanFace size={20} className="group-hover:text-rose-400 transition-colors" />
                <span>Accept Proposal</span>
              </>
            )}
          </button>
        </form>

        {/* Status Messages */}
        <div className="space-y-4">
          {state === "success" && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] text-center space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-10 h-10 bg-rose-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-rose-200">
                <Heart size={20} className="text-white" fill="white" />
              </div>
              <p className="text-sm font-black text-rose-900 tracking-tight">Bond Accepted Successfully!</p>
              {txHash && (
                <a
                  href={`https://worldscan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors"
                >
                  View on WorldScan →
                </a>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
              <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest leading-relaxed">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Prenup Agreement Modal */}
      <PrenupModal
        isOpen={showPrenup}
        onClose={() => setShowPrenup(false)}
        onConfirm={handlePrenupConfirm}
        title="Binding Prenuptial Agreement"
      />
    </div>
  );
}


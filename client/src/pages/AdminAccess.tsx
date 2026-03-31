/**
 * Admin Access Management Page
 * Allows the club owner to grant or revoke free game access for students by email.
 * Route: /admin/access
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ShieldCheck, ShieldX, Users, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function AdminAccess() {
  const [, navigate] = useLocation();
  const [grantEmail, setGrantEmail] = useState("");
  const [revokeEmail, setRevokeEmail] = useState("");

  const { data: users, refetch } = trpc.payment.listUsers.useQuery();

  const grantMutation = trpc.payment.grantAccess.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ Access granted to ${data.name ?? grantEmail}`);
      setGrantEmail("");
      refetch();
    },
    onError: (err) => toast.error(`❌ ${err.message}`),
  });

  const revokeMutation = trpc.payment.revokeAccess.useMutation({
    onSuccess: () => {
      toast.success("Access revoked successfully");
      setRevokeEmail("");
      refetch();
    },
    onError: (err) => toast.error(`❌ ${err.message}`),
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-8 font-['Rajdhani']">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-white font-['Black_Han_Sans'] text-2xl tracking-wider">
              ACCESS MANAGEMENT
            </h1>
            <p className="text-white/50 text-sm">Grant or revoke free game access for club students</p>
          </div>
        </div>

        {/* Grant Access */}
        <div className="bg-white/5 border border-[#C9A84C]/30 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
            <h2 className="text-[#C9A84C] font-['Black_Han_Sans'] text-lg tracking-wider">
              GRANT FREE ACCESS
            </h2>
          </div>
          <p className="text-white/60 text-sm mb-4">
            Enter a student's email address to give them free access without payment. They must have logged in at least once for their account to exist.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              placeholder="student@email.com"
              className="flex-1 bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
              onKeyDown={(e) => e.key === "Enter" && grantEmail && grantMutation.mutate({ email: grantEmail, grantedBy: "admin" })}
            />
            <button
              onClick={() => grantMutation.mutate({ email: grantEmail, grantedBy: "admin" })}
              disabled={!grantEmail || grantMutation.isPending}
              className="px-6 py-3 bg-[#C9A84C] text-black font-['Black_Han_Sans'] rounded-lg hover:bg-[#E8C85A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {grantMutation.isPending ? "..." : "GRANT"}
            </button>
          </div>
        </div>

        {/* Revoke Access */}
        <div className="bg-white/5 border border-[#E8001D]/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldX className="w-5 h-5 text-[#E8001D]" />
            <h2 className="text-[#E8001D] font-['Black_Han_Sans'] text-lg tracking-wider">
              REVOKE ACCESS
            </h2>
          </div>
          <p className="text-white/60 text-sm mb-4">
            Remove game access from a user. They will need to purchase again to regain access.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              value={revokeEmail}
              onChange={(e) => setRevokeEmail(e.target.value)}
              placeholder="user@email.com"
              className="flex-1 bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#E8001D] transition-colors"
              onKeyDown={(e) => e.key === "Enter" && revokeEmail && revokeMutation.mutate({ email: revokeEmail })}
            />
            <button
              onClick={() => revokeMutation.mutate({ email: revokeEmail })}
              disabled={!revokeEmail || revokeMutation.isPending}
              className="px-6 py-3 bg-[#E8001D] text-white font-['Black_Han_Sans'] rounded-lg hover:bg-[#C80019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {revokeMutation.isPending ? "..." : "REVOKE"}
            </button>
          </div>
        </div>

        {/* User List */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-white/60" />
            <h2 className="text-white font-['Black_Han_Sans'] text-lg tracking-wider">
              ALL REGISTERED USERS
            </h2>
            <span className="ml-auto text-white/40 text-sm">{users?.length ?? 0} users</span>
          </div>

          {!users || users.length === 0 ? (
            <p className="text-white/40 text-center py-8">
              No users have logged in yet. Share the app link to get started!
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{u.name ?? "Unknown"}</p>
                    <p className="text-white/50 text-sm truncate">{u.email ?? "No email"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {u.hasAccess ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs font-semibold bg-green-400/10 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        {u.accessGrantedBy === "purchase" ? "Paid" : u.accessGrantedBy === "admin" ? "Free" : "Access"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-white/40 text-xs bg-white/5 px-2 py-1 rounded-full">
                        <XCircle className="w-3 h-3" />
                        No Access
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation links */}
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => navigate("/admin/belts")}
            className="text-[#C9A84C]/70 hover:text-[#C9A84C] font-['Rajdhani'] text-sm transition-colors"
          >
            🥋 Belt Upgrade Panel
          </button>
          <span className="text-white/20">·</span>
          <button
            onClick={() => navigate("/")}
            className="text-white/40 hover:text-white font-['Rajdhani'] text-sm transition-colors"
          >
            ← Home
          </button>
        </div>
      </div>
    </div>
  );
}

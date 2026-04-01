// TKD Trump Cards — Admin Photo Approval Queue
// Review pending student photo submissions and approve or reject them

import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminPhotoApproval() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const { data: pending, isLoading } = trpc.students.listPendingPhotos.useQuery();

  const approveMutation = trpc.students.approvePhoto.useMutation({
    onSuccess: (_, vars) => {
      toast.success("✅ Photo approved — now live on the card!");
      utils.students.listPendingPhotos.invalidate();
    },
    onError: (err) => toast.error("Error: " + err.message),
  });

  const rejectMutation = trpc.students.rejectPhoto.useMutation({
    onSuccess: () => {
      toast.success("🗑 Photo rejected and removed.");
      utils.students.listPendingPhotos.invalidate();
    },
    onError: (err) => toast.error("Error: " + err.message),
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/belts")}
        className="mb-6 flex items-center gap-2 text-[#F5C800] hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
      >
        ← Back to Belt Admin
      </button>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#F5C800] uppercase tracking-widest" style={{ fontFamily: "'Black Han Sans', sans-serif" }}>
              📸 Photo Approvals
            </h1>
            <p className="text-white/50 text-sm mt-1">Review student photo submissions before they go live on cards</p>
          </div>
          {pending && pending.length > 0 && (
            <div className="bg-[#E8001D] text-white font-black text-lg w-10 h-10 rounded-full flex items-center justify-center">
              {pending.length}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-16 text-white/40">
            <div className="text-4xl animate-spin mb-4">⟳</div>
            <p>Loading pending photos...</p>
          </div>
        )}

        {!isLoading && (!pending || pending.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-white/60 uppercase tracking-wider">All caught up!</h2>
            <p className="text-white/30 mt-2">No pending photo submissions right now.</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {pending?.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="rounded-2xl overflow-hidden border border-[#F5C800]/20 bg-white/5"
              >
                <div className="p-5 flex gap-5 items-start">
                  {/* Side by side: current vs pending */}
                  <div className="flex gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="w-20 h-24 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-white/5 mb-1">
                        {student.photoUrl ? (
                          <img src={student.photoUrl} alt="Current" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-3xl opacity-30">🥋</div>
                        )}
                      </div>
                      <p className="text-white/30 text-xs">Current</p>
                    </div>
                    <div className="flex items-center text-[#F5C800] text-xl font-bold">→</div>
                    <div className="text-center">
                      <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-[#F5C800] flex items-center justify-center bg-white/5 mb-1" style={{ boxShadow: "0 0 16px rgba(245,200,0,0.3)" }}>
                        {student.pendingPhotoUrl ? (
                          <img src={student.pendingPhotoUrl} alt="Pending" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-3xl opacity-30">?</div>
                        )}
                      </div>
                      <p className="text-[#F5C800] text-xs font-bold">Submitted</p>
                    </div>
                  </div>

                  {/* Student info and action buttons */}
                  <div className="flex-1">
                    <h3 className="text-white font-black text-lg uppercase tracking-wider" style={{ fontFamily: "'Black Han Sans', sans-serif" }}>
                      {student.name}
                    </h3>
                    <p className="text-white/50 text-sm mb-4">{student.grade}</p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => approveMutation.mutate({ studentId: student.id })}
                        disabled={approveMutation.isPending}
                        className="flex-1 py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95"
                        style={{ background: "#22C55E", color: "#fff", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate({ studentId: student.id })}
                        disabled={rejectMutation.isPending}
                        className="flex-1 py-3 rounded-xl font-black uppercase tracking-wider text-sm border border-[#E8001D]/60 text-[#E8001D] hover:bg-[#E8001D]/10 transition-all"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

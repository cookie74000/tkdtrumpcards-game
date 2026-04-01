// TKD Trump Cards — Player Profile Page
// Students can search for their card, view their stats, and submit a photo for admin approval

import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const BELT_COLOURS: Record<string, string> = {
  "White Belt - 10th Kup": "#FFFFFF",
  "White Belt  Yellow Tag - 9th Kup": "#FFFDE7",
  "Yellow Belt - 8th Kup": "#F5C800",
  "Yellow Belt Green Tag - 7th Kup": "#FFB300",
  "Green Belt - 6th Kup": "#2E7D32",
  "Green Belt Blue Tag - 5th Kup": "#1565C0",
  "Blue Belt - 4th Kup": "#1565C0",
  "Blue Belt Red Tag - 3rd Kup": "#B71C1C",
  "Red Belt - 2nd Kup": "#C62828",
  "Red Belt Black Tag - 1st Kup": "#4A148C",
  "Black Belt - 1st Dan": "#111111",
  "Black Belt - 1st Dan 1st*": "#111111",
  "Black Belt - 1st Dan 2nd*": "#111111",
  "Black Belt - 2nd Dan": "#111111",
  "Black Belt - 3rd Dan": "#111111",
  "Black Belt - 4th Dan": "#111111",
  "Black Belt - 5th Dan": "#111111",
};

type Student = {
  id: number;
  name: string;
  grade: string;
  membershipNumber: string;
  photoUrl?: string | null;
  pendingPhotoUrl?: string | null;
  photoApproved?: boolean;
  power: number;
  speed: number;
  technique: number;
  flexibility: number;
  aura: number;
  specialMove: string;
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-wider w-24 text-right" style={{ color: "#C9A84C", fontFamily: "'Rajdhani', sans-serif" }}>
        {label}
      </span>
      <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-white font-bold text-sm w-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        {value}
      </span>
    </div>
  );
}

export default function Profile() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoContentType, setPhotoContentType] = useState("image/jpeg");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading } = trpc.students.list.useQuery(
    { search, limit: 10 },
    { enabled: search.length >= 2 }
  );

  const submitPhotoMutation = trpc.students.submitPhoto.useMutation({
    onSuccess: () => {
      toast.success("📸 Photo submitted for approval! Your instructor will review it shortly.");
      setPreviewUrl(null);
      setPhotoBase64(null);
      setSubmitting(false);
    },
    onError: (err) => {
      toast.error("Failed to submit photo: " + err.message);
      setSubmitting(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }
    setPhotoContentType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreviewUrl(result);
      // Strip the data URL prefix to get pure base64
      const base64 = result.split(",")[1];
      setPhotoBase64(base64 ?? null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPhoto = () => {
    if (!selectedStudent || !photoBase64) return;
    setSubmitting(true);
    submitPhotoMutation.mutate({
      studentId: selectedStudent.id,
      photoBase64,
      contentType: photoContentType,
    });
  };

  const beltColor = selectedStudent ? (BELT_COLOURS[selectedStudent.grade] || "#888") : "#888";
  const isLightBelt = selectedStudent ? ["#FFFFFF", "#FFFDE7", "#F5C800", "#FFB300"].includes(beltColor) : false;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/2026")}
        className="mb-6 flex items-center gap-2 text-[#F5C800] hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
      >
        ← Back to 2026 Edition
      </button>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black text-[#F5C800] uppercase tracking-widest mb-2" style={{ fontFamily: "'Black Han Sans', sans-serif" }}>
            🥋 My Card
          </h1>
          <p className="text-white/60 text-base">Find your card and upload your best Taekwondo photo!</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your name..."
            className="w-full px-5 py-4 rounded-xl bg-white/10 border border-[#F5C800]/30 text-white placeholder-white/40 text-lg focus:outline-none focus:border-[#F5C800] transition-colors"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F5C800] animate-spin text-xl">⟳</div>
          )}
        </div>

        {/* Search results */}
        <AnimatePresence>
          {searchResults && searchResults.students.length > 0 && !selectedStudent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-xl overflow-hidden border border-[#F5C800]/20"
            >
              {searchResults.students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStudent(s as Student); setSearch(s.name); }}
                  className="w-full flex items-center gap-4 px-5 py-3 bg-white/5 hover:bg-[#F5C800]/10 transition-colors border-b border-white/5 last:border-0 text-left"
                >
                  <div
                    className="w-3 h-8 rounded-full flex-shrink-0"
                    style={{ background: BELT_COLOURS[s.grade] || "#888", border: s.grade.includes("White") ? "1px solid rgba(255,255,255,0.3)" : "none" }}
                  />
                  <div>
                    <div className="font-bold text-white text-base">{s.name}</div>
                    <div className="text-white/50 text-xs">{s.grade}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
          {searchResults && searchResults.students.length === 0 && search.length >= 2 && !selectedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/40 py-6 mb-6"
            >
              No student found with that name. Ask your instructor to add you!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Student Card */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl overflow-hidden border-2 mb-8"
              style={{ borderColor: beltColor === "#FFFFFF" ? "rgba(255,255,255,0.3)" : beltColor, boxShadow: `0 0 40px ${beltColor}40` }}
            >
              {/* Card header */}
              <div className="p-4 flex items-center justify-between" style={{ background: beltColor }}>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider" style={{ color: isLightBelt ? "#000" : "#fff", fontFamily: "'Black Han Sans', sans-serif" }}>
                    {selectedStudent.name}
                  </h2>
                  <p className="text-sm font-bold uppercase tracking-wider opacity-80" style={{ color: isLightBelt ? "#000" : "#fff" }}>
                    {selectedStudent.grade}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedStudent(null); setSearch(""); setPreviewUrl(null); setPhotoBase64(null); }}
                  className="text-2xl opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: isLightBelt ? "#000" : "#fff" }}
                >
                  ✕
                </button>
              </div>

              {/* Card body */}
              <div className="bg-[#0F0F1A] p-6">
                <div className="flex gap-6 mb-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-28 h-36 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-white/5"
                      style={{ borderColor: `${beltColor}60` }}
                    >
                      {(previewUrl || selectedStudent.photoUrl) ? (
                        <img
                          src={previewUrl || selectedStudent.photoUrl!}
                          alt={selectedStudent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-5xl opacity-30">🥋</div>
                      )}
                    </div>
                    {selectedStudent.pendingPhotoUrl && !previewUrl && (
                      <p className="text-xs text-[#F5C800] text-center mt-2 font-bold">⏳ Awaiting approval</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex-1 space-y-2">
                    <StatBar label="Power" value={selectedStudent.power} color="#E8001D" />
                    <StatBar label="Speed" value={selectedStudent.speed} color="#F5C800" />
                    <StatBar label="Technique" value={selectedStudent.technique} color="#00B4D8" />
                    <StatBar label="Flexibility" value={selectedStudent.flexibility} color="#06D6A0" />
                    <StatBar label="Aura" value={selectedStudent.aura} color="#9B5DE5" />
                    <div className="pt-1">
                      <span className="text-xs text-[#C9A84C] font-bold uppercase tracking-wider">Special Move: </span>
                      <span className="text-white text-xs font-bold">{selectedStudent.specialMove}</span>
                    </div>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="border-t border-white/10 pt-5">
                  <h3 className="text-[#F5C800] font-black uppercase tracking-wider text-base mb-1" style={{ fontFamily: "'Black Han Sans', sans-serif" }}>
                    📸 Upload Your Photo
                  </h3>
                  <p className="text-white/50 text-sm mb-4">
                    Upload your best Taekwondo photo! Show off your best kick, stance, or belt ceremony moment. Your instructor will review it before it goes live on your card.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <img src={previewUrl} alt="Preview" className="w-20 h-24 object-cover rounded-lg border border-[#F5C800]/40" />
                        <div className="flex-1 space-y-2">
                          <p className="text-white/70 text-sm">Looking good! Ready to submit for approval?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSubmitPhoto}
                              disabled={submitting}
                              className="flex-1 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-all"
                              style={{ background: submitting ? "#666" : "#F5C800", color: "#000" }}
                            >
                              {submitting ? "Submitting..." : "✓ Submit for Approval"}
                            </button>
                            <button
                              onClick={() => { setPreviewUrl(null); setPhotoBase64(null); }}
                              className="px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:text-white text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 rounded-xl border-2 border-dashed border-[#F5C800]/40 text-[#F5C800]/60 hover:border-[#F5C800] hover:text-[#F5C800] transition-all font-bold uppercase tracking-wider text-sm"
                    >
                      📷 Choose Photo (JPG, PNG — max 5MB)
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions if no student selected */}
        {!selectedStudent && search.length < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/30"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-bold uppercase tracking-wider">Type your name above to find your card</p>
            <p className="text-sm mt-2">You need at least 2 characters to search</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

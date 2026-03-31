// TKD Trump Cards — Admin Belt Upgrade Panel
// Search any student and update their belt grade with one click

import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const BELT_GRADES = [
  "White Belt - 10th Kup",
  "White Belt  Yellow Tag - 9th Kup",
  "Yellow Belt - 8th Kup",
  "Yellow Belt Green Tag - 7th Kup",
  "Green Belt - 6th Kup",
  "Green Belt Blue Tag - 5th Kup",
  "Blue Belt - 4th Kup",
  "Blue Belt Red Tag - 3rd Kup",
  "Red Belt - 2nd Kup",
  "Red Belt Black Tag - 1st Kup",
  "Black Belt - 1st Dan",
  "Black Belt - 1st Dan 1st*",
  "Black Belt - 1st Dan 2nd*",
  "Black Belt - 2nd Dan",
  "Black Belt - 3rd Dan",
  "Black Belt - 4th Dan",
  "Black Belt - 5th Dan",
] as const;

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
};

function BeltBadge({ grade }: { grade: string }) {
  const color = BELT_COLOURS[grade] || "#888";
  const isLight = ["#FFFFFF", "#FFFDE7", "#F5C800", "#FFB300"].includes(color);
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
      style={{
        background: color,
        color: isLight ? "#000" : "#fff",
        border: color === "#FFFFFF" ? "1px solid rgba(0,0,0,0.2)" : "none",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {grade}
    </span>
  );
}

function StudentRow({ student, onUpgrade }: { student: Student; onUpgrade: (s: Student) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        background: "rgba(245,200,0,0.04)",
        border: "1px solid rgba(245,200,0,0.12)",
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate" style={{ fontFamily: "'Anton', sans-serif" }}>
          {student.name}
        </p>
        <p className="text-white/40 text-xs mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          #{student.membershipNumber}
        </p>
        <BeltBadge grade={student.grade} />
      </div>
      <button
        onClick={() => onUpgrade(student)}
        className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #F5C800, #E6A800)",
          color: "#000",
          fontFamily: "'Rajdhani', sans-serif",
          boxShadow: "0 2px 12px rgba(245,200,0,0.3)",
        }}
      >
        ⬆ Upgrade
      </button>
    </motion.div>
  );
}

function UpgradeModal({
  student,
  onClose,
  onSaved,
}: {
  student: Student;
  onClose: () => void;
  onSaved: (newGrade: string) => void;
}) {
  const [selectedGrade, setSelectedGrade] = useState(student.grade);
  const updateGrade = trpc.students.updateGrade.useMutation({
    onSuccess: () => {
      toast.success(`✅ ${student.name}'s belt updated to ${selectedGrade}!`);
      onSaved(selectedGrade);
      onClose();
    },
    onError: (err) => {
      toast.error(`Failed to update: ${err.message}`);
    },
  });

  const currentIndex = BELT_GRADES.indexOf(student.grade as typeof BELT_GRADES[number]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1a1a1a, #111)",
          border: "2px solid rgba(245,200,0,0.4)",
          boxShadow: "0 0 60px rgba(245,200,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(245,200,0,0.15)", background: "rgba(245,200,0,0.06)" }}
        >
          <p className="text-[#F5C800] text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Belt Upgrade
          </p>
          <h2 className="text-white font-black text-xl" style={{ fontFamily: "'Anton', sans-serif" }}>
            {student.name}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <BeltBadge grade={student.grade} />
            <span className="text-white/40 text-xs">→ select new grade below</span>
          </div>
        </div>

        {/* Grade selector */}
        <div className="p-4 space-y-1.5 max-h-80 overflow-y-auto">
          {BELT_GRADES.map((grade, idx) => {
            const color = BELT_COLOURS[grade] || "#888";
            const isLight = ["#FFFFFF", "#FFFDE7", "#F5C800", "#FFB300"].includes(color);
            const isCurrent = grade === student.grade;
            const isSelected = grade === selectedGrade;
            const isHigher = idx > currentIndex;

            return (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                style={{
                  background: isSelected
                    ? "rgba(245,200,0,0.15)"
                    : "rgba(255,255,255,0.03)",
                  border: isSelected
                    ? "1px solid rgba(245,200,0,0.5)"
                    : "1px solid rgba(255,255,255,0.06)",
                  opacity: isCurrent ? 0.5 : 1,
                }}
              >
                {/* Belt colour dot */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    background: color,
                    border: color === "#FFFFFF" ? "1px solid rgba(0,0,0,0.3)" : "none",
                  }}
                />
                <span
                  className="flex-1 text-sm"
                  style={{
                    color: isSelected ? "#F5C800" : "#ccc",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: isSelected ? "700" : "400",
                  }}
                >
                  {grade}
                </span>
                {isCurrent && (
                  <span className="text-xs text-white/30" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    current
                  </span>
                )}
                {isHigher && !isCurrent && (
                  <span className="text-xs text-[#F5C800]/50">⬆</span>
                )}
                {isSelected && !isCurrent && (
                  <span className="text-[#F5C800] text-base">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div
          className="px-4 py-3 flex gap-3"
          style={{ borderTop: "1px solid rgba(245,200,0,0.15)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
            style={{ fontFamily: "'Rajdhani', sans-serif", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => updateGrade.mutate({ studentId: student.id, grade: selectedGrade as typeof BELT_GRADES[number] })}
            disabled={selectedGrade === student.grade || updateGrade.isPending}
            className="flex-1 py-2.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #F5C800, #E6A800)",
              color: "#000",
              fontFamily: "'Rajdhani', sans-serif",
              boxShadow: "0 2px 12px rgba(245,200,0,0.3)",
            }}
          >
            {updateGrade.isPending ? "Saving..." : "🥋 Save Upgrade"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminBelts() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [upgrading, setUpgrading] = useState<Student | null>(null);
  const [localGrades, setLocalGrades] = useState<Record<number, string>>({});

  const { data, isLoading, refetch } = trpc.students.list.useQuery(
    { search, limit: 200 },
    { refetchOnWindowFocus: false }
  );

  const studentList = data?.students ?? [];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#F5C800] z-10" />

      {/* Header */}
      <div
        className="sticky top-1 z-10 px-4 py-4"
        style={{
          background: "rgba(13,13,13,0.97)",
          borderBottom: "1px solid rgba(245,200,0,0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate("/2026")}
              className="text-[#F5C800]/60 hover:text-[#F5C800] text-sm font-bold transition-colors"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              ← HOME
            </button>
            <div className="flex-1">
              <h1
                className="text-[#F5C800] font-black text-xl uppercase leading-none"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                🥋 Belt Upgrade Panel
              </h1>
              <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Find a student and update their belt grade instantly
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/students/add")}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #F5C800, #E6A800)",
                color: "#000",
                fontFamily: "'Rajdhani', sans-serif",
                boxShadow: "0 2px 12px rgba(245,200,0,0.3)",
              }}
            >
              ➕ Add Student
            </button>
          </div>

          <input
            type="text"
            placeholder="Search student by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-white text-sm outline-none"
            style={{
              background: "rgba(245,200,0,0.08)",
              border: "1px solid rgba(245,200,0,0.2)",
              fontFamily: "'Rajdhani', sans-serif",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(245,200,0,0.6)")}
            onBlur={e => (e.target.style.borderColor = "rgba(245,200,0,0.2)")}
          />
        </div>
      </div>

      {/* Student list */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-2">
        {isLoading && (
          <div className="text-center py-20 text-[#F5C800]/50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Loading students...
          </div>
        )}

        {!isLoading && studentList.length === 0 && (
          <div className="text-center py-20 text-white/30" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {search ? `No students found matching "${search}"` : "No students in database yet."}
          </div>
        )}

        <AnimatePresence>
          {studentList.map(student => (
            <StudentRow
              key={student.id}
              student={{
                ...student,
                grade: localGrades[student.id] ?? student.grade,
              }}
              onUpgrade={s => setUpgrading(s)}
            />
          ))}
        </AnimatePresence>

        {!isLoading && studentList.length > 0 && (
          <p
            className="text-center text-white/20 text-xs pt-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {studentList.length} student{studentList.length !== 1 ? "s" : ""} shown
          </p>
        )}
      </div>

      {/* Upgrade modal */}
      <AnimatePresence>
        {upgrading && (
          <UpgradeModal
            student={upgrading}
            onClose={() => setUpgrading(null)}
            onSaved={newGrade => {
              setLocalGrades(prev => ({ ...prev, [upgrading.id]: newGrade }));
              refetch();
            }}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#F5C800]" />
    </div>
  );
}

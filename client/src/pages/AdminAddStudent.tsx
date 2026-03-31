/**
 * Admin — Add New Student
 * A clean form to add a new student to the database.
 * Route: /admin/students/add
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { UserPlus, ArrowLeft, Upload, CheckCircle } from "lucide-react";

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
  "White": "#FFFFFF",
  "Yellow": "#FFD700",
  "Green": "#22C55E",
  "Blue": "#3B82F6",
  "Red": "#EF4444",
  "Black": "#1A1A1A",
};

function getBeltColour(grade: string): string {
  for (const [key, colour] of Object.entries(BELT_COLOURS)) {
    if (grade.startsWith(key)) return colour;
  }
  return "#888";
}

export default function AdminAddStudent() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<typeof BELT_GRADES[number]>("White Belt - 10th Kup");
  const [membershipNumber, setMembershipNumber] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const utils = trpc.useUtils();

  const createMutation = trpc.students.create.useMutation({
    onSuccess: () => {
      toast.success(`✅ ${name} added successfully!`);
      utils.students.list.invalidate();
      setSuccess(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        setName("");
        setMembershipNumber("");
        setGrade("White Belt - 10th Kup");
        setPhotoFile(null);
        setPhotoPreview(null);
        setSuccess(false);
      }, 2000);
    },
    onError: (err) => toast.error(`❌ ${err.message}`),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !membershipNumber.trim()) {
      toast.error("Please fill in the name and membership number");
      return;
    }

    let photoUrl: string | undefined;

    // Upload photo if provided
    if (photoFile && photoPreview) {
      setUploading(true);
      try {
        // Convert to base64 and upload via a tRPC mutation
        // For now we use the data URL as a placeholder — real S3 upload can be wired later
        photoUrl = photoPreview; // data URL works as a placeholder
      } catch (err) {
        toast.error("Photo upload failed — student will be added without photo");
      } finally {
        setUploading(false);
      }
    }

    createMutation.mutate({
      name: name.trim(),
      grade,
      membershipNumber: membershipNumber.trim(),
      photoUrl,
    });
  };

  const beltColour = getBeltColour(grade);
  const isBlack = grade.includes("Black Belt");

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-8 font-['Rajdhani']">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/admin/belts")}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-white font-['Black_Han_Sans'] text-2xl tracking-wider">
              ADD NEW STUDENT
            </h1>
            <p className="text-white/50 text-sm">Add a new member to the TKD Trump Cards database</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center bg-black/40 cursor-pointer relative group"
              style={{ borderColor: beltColour }}
              onClick={() => document.getElementById("photo-input")?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-white/30 group-hover:text-white/60 transition-colors">
                  <Upload className="w-8 h-8" />
                  <span className="text-xs">Photo</span>
                </div>
              )}
            </div>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => document.getElementById("photo-input")?.click()}
              className="text-[#C9A84C]/70 hover:text-[#C9A84C] text-sm transition-colors"
            >
              {photoPreview ? "Change photo" : "Upload photo (optional)"}
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-white/70 text-sm mb-1 tracking-wider uppercase">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jamie Robertson"
              required
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Membership Number */}
          <div>
            <label className="block text-white/70 text-sm mb-1 tracking-wider uppercase">
              Membership Number *
            </label>
            <input
              type="text"
              value={membershipNumber}
              onChange={(e) => setMembershipNumber(e.target.value)}
              placeholder="e.g. TKD-2026-124"
              required
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Belt Grade */}
          <div>
            <label className="block text-white/70 text-sm mb-2 tracking-wider uppercase">
              Belt Grade *
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
              {BELT_GRADES.map((g) => {
                const colour = getBeltColour(g);
                const selected = grade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                      selected
                        ? "border-[#C9A84C] bg-[#C9A84C]/10"
                        : "border-white/10 bg-black/30 hover:border-white/30"
                    }`}
                  >
                    {/* Belt colour swatch */}
                    <div
                      className="w-6 h-4 rounded-sm shrink-0 border border-white/20"
                      style={{ backgroundColor: colour }}
                    />
                    <span className={`font-['Rajdhani'] text-sm ${selected ? "text-[#C9A84C] font-semibold" : "text-white/80"}`}>
                      {g}
                    </span>
                    {selected && <CheckCircle className="w-4 h-4 text-[#C9A84C] ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Card Preview</p>
            <div
              className="rounded-lg p-4 flex items-center gap-4"
              style={{
                background: `linear-gradient(135deg, ${isBlack ? "#1a1a1a" : "#0A0A0F"} 0%, ${beltColour}22 100%)`,
                border: `1px solid ${beltColour}44`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center bg-black/40 shrink-0"
                style={{ borderColor: beltColour }}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🥋</span>
                )}
              </div>
              <div>
                <p className="text-white font-['Black_Han_Sans'] text-base tracking-wide">
                  {name || "Student Name"}
                </p>
                <p className="text-sm" style={{ color: beltColour }}>
                  {grade}
                </p>
                <p className="text-white/40 text-xs">{membershipNumber || "Membership #"}</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createMutation.isPending || uploading || success}
            className="w-full py-4 rounded-lg font-['Black_Han_Sans'] text-xl tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: success ? "#22C55E" : "#C9A84C",
              color: "#000",
              boxShadow: success ? "0 0 24px rgba(34,197,94,0.4)" : "0 0 24px rgba(201,168,76,0.4)",
            }}
          >
            {success ? "✅ STUDENT ADDED!" : createMutation.isPending || uploading ? "SAVING..." : "➕ ADD STUDENT"}
          </button>
        </form>

        {/* Navigation */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/admin/belts")}
            className="text-[#C9A84C]/70 hover:text-[#C9A84C] text-sm transition-colors"
          >
            🥋 Belt Upgrades
          </button>
          <span className="text-white/20">·</span>
          <button
            onClick={() => navigate("/admin/access")}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            🛡 Access Management
          </button>
          <span className="text-white/20">·</span>
          <button
            onClick={() => navigate("/")}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            ← Home
          </button>
        </div>
      </div>
    </div>
  );
}

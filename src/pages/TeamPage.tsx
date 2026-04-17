import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera, GraduationCap, User } from "lucide-react";
import { useTeamStore, type TeamMember } from "@/hooks/useDataStore";
import TiltCard from "@/components/TiltCard";
import { toast } from "sonner";

const initials = (name: string) =>
  name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

const MemberCard = ({ member, onUpload }: { member: TeamMember; onUpload: (id: string, file: File) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <TiltCard max={14}>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card group relative overflow-hidden text-center neon-border"
    >
      <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-primary/20 to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex flex-col items-center pt-2">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/40 neon-glow bg-muted/30 flex items-center justify-center">
          {member.imageUrl ? (
            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-primary">{initials(member.name)}</span>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-primary"
            aria-label="Upload photo"
          >
            <Camera className="w-6 h-6" />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(member.id, f);
            }}
          />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">{member.name}</h3>
        <p className="text-xs text-primary mt-1 flex items-center gap-1">
          <User size={12} /> {member.role}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
          <GraduationCap size={12} /> {member.institute}
        </p>
      </div>
    </motion.div>
  );
};

const TeamPage = () => {
  const { team, updateMember } = useTeamStore();

  const handleUpload = (id: string, file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateMember(id, { imageUrl: reader.result as string });
      toast.success("Photo updated");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Our Team</h1>
        <p className="text-sm text-muted-foreground">The minds behind Aero Spark · Hover a card to upload a photo</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map(m => <MemberCard key={m.id} member={m} onUpload={handleUpload} />)}
      </div>
    </div>
  );
};

export default TeamPage;

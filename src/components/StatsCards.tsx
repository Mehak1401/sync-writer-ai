import { FileText, Clock, GitBranch, TrendingUp } from "lucide-react";

const stats = [
  { label: "Active Papers", value: "3", icon: FileText, change: "+1 this week" },
  { label: "Total Words", value: "25,550", icon: TrendingUp, change: "+2,400 today" },
  { label: "Versions Saved", value: "47", icon: GitBranch, change: "Auto-saved" },
  { label: "Next Deadline", value: "14 days", icon: Clock, change: "Feb 28, 2026" },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-ui">{stat.label}</span>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-semibold">{stat.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

import { FileText, Clock, TrendingUp } from "lucide-react";
import type { Paper } from "@/hooks/usePapers";

const StatsCards = ({ papers }: { papers: Paper[] }) => {
  const activePapers = papers.filter((p) => p.status !== "published").length;
  const totalWords = papers.reduce((sum, p) => sum + p.word_count, 0);

  const nextDeadline = papers
    .filter((p) => p.deadline && p.status !== "published")
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())[0];

  const daysToDeadline = nextDeadline
    ? Math.ceil((new Date(nextDeadline.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const stats = [
    { label: "Active Papers", value: String(activePapers), icon: FileText, change: "" },
    { label: "Total Words", value: totalWords.toLocaleString(), icon: TrendingUp, change: "" },
    {
      label: "Next Deadline",
      value: daysToDeadline !== null ? `${daysToDeadline} days` : "—",
      icon: Clock,
      change: nextDeadline?.deadline
        ? new Date(nextDeadline.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-ui">{stat.label}</span>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-semibold">{stat.value}</p>
          {stat.change && <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

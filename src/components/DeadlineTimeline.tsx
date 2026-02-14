import { mockPapers } from "@/lib/mock-data";

const DeadlineTimeline = () => {
  const sorted = [...mockPapers]
    .filter((p) => p.status !== "published")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="font-display text-sm font-semibold mb-4">Upcoming Deadlines</h3>
      <div className="space-y-4">
        {sorted.map((paper) => {
          const daysLeft = Math.ceil(
            (new Date(paper.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const urgent = daysLeft <= 14;
          return (
            <div key={paper.id} className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${urgent ? "bg-warning" : "bg-accent"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{paper.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(paper.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium ${urgent ? "text-warning" : "text-muted-foreground"}`}
              >
                {daysLeft}d left
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeadlineTimeline;

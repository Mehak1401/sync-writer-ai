import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import PaperCard from "@/components/PaperCard";
import DeadlineTimeline from "@/components/DeadlineTimeline";
import { mockPapers } from "@/lib/mock-data";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-8 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Good afternoon, Jordan
            </h2>
            <p className="mt-1 text-muted-foreground">
              You have 3 active papers and 1 deadline approaching.
            </p>
          </div>
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" />
            New Paper
          </Button>
        </div>

        <StatsCards />

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-3">
            <h3 className="font-display text-lg font-semibold">Your Papers</h3>
            {mockPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
          <div>
            <DeadlineTimeline />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

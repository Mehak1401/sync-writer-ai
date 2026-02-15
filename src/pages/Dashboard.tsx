import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import PaperCard from "@/components/PaperCard";
import DeadlineTimeline from "@/components/DeadlineTimeline";
import { useAuth } from "@/hooks/useAuth";
import { usePapers, useCreatePaper } from "@/hooks/usePapers";

const Dashboard = () => {
  const { profile, roles } = useAuth();
  const { data: papers = [], isLoading } = usePapers();
  const createPaper = useCreatePaper();
  const navigate = useNavigate();

  const isStudent = roles.includes("student");

  const handleNewPaper = async () => {
    const paper = await createPaper.mutateAsync("Untitled Paper");
    navigate(`/editor/${paper.id}`);
  };

  const displayName = profile?.full_name || "Researcher";
  const activePapers = papers.filter((p) => p.status !== "published");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-8 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Welcome, {displayName}
            </h2>
            <p className="mt-1 text-muted-foreground">
              You have {activePapers.length} active paper{activePapers.length !== 1 ? "s" : ""}.
            </p>
          </div>
          {isStudent && (
            <Button
              onClick={handleNewPaper}
              disabled={createPaper.isPending}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="h-4 w-4" />
              New Paper
            </Button>
          )}
        </div>

        <StatsCards papers={papers} />

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-3">
            <h3 className="font-display text-lg font-semibold">
              {isStudent ? "Your Papers" : "Papers"}
            </h3>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : papers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No papers yet. Create your first one!</p>
            ) : (
              papers.map((paper) => <PaperCard key={paper.id} paper={paper} />)
            )}
          </div>
          <div>
            <DeadlineTimeline papers={papers} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

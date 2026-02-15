import { GitBranch, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Paper } from "@/hooks/usePapers";
import { formatDistanceToNow } from "date-fns";

const statusStyles: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  "in-review": "bg-ai-muted text-ai",
  published: "bg-accent text-accent-foreground",
};

const PaperCard = ({ paper }: { paper: Paper }) => {
  const navigate = useNavigate();
  const lastEdited = formatDistanceToNow(new Date(paper.updated_at), { addSuffix: true });

  return (
    <button
      onClick={() => navigate(`/editor/${paper.id}`)}
      className="group flex w-full flex-col rounded-lg border bg-card p-5 text-left transition-all hover:shadow-md hover:border-accent/30"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h3 className="font-display text-base font-semibold leading-snug group-hover:text-accent transition-colors">
            {paper.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(paper.tags ?? []).map((tag) => (
              <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <Badge className={`${statusStyles[paper.status] ?? ""} text-xs font-medium capitalize`}>
          {paper.status.replace("-", " ")}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {lastEdited}
        </span>
        <span>{paper.word_count.toLocaleString()} words</span>
        <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-accent" />
      </div>
    </button>
  );
};

export default PaperCard;

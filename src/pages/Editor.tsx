import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EditorPane from "@/components/EditorPane";
import AICopilotPane from "@/components/AICopilotPane";
import VersionSidebar from "@/components/VersionSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useUpdatePaper, useSaveVersion, usePaperVersions } from "@/hooks/usePapers";
import type { Paper } from "@/hooks/usePapers";

const Editor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const updatePaper = useUpdatePaper();
  const saveVersion = useSaveVersion();
  const { data: versions = [] } = usePaperVersions(id);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("papers")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPaper(data);
          setContent(data.content);
        }
        setLoading(false);
      });
  }, [id]);

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const handleSave = async () => {
    if (!id) return;
    await updatePaper.mutateAsync({ id, content, word_count: wordCount });
    await saveVersion.mutateAsync({
      paper_id: id,
      content,
      word_count: wordCount,
      changes_summary: `Saved at ${new Date().toLocaleTimeString()}`,
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!paper) return <div className="flex h-screen items-center justify-center text-muted-foreground">Paper not found.</div>;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-sm font-semibold leading-tight">{paper.title}</h1>
            <p className="text-xs text-muted-foreground">
              {wordCount.toLocaleString()} words · {versions.length} versions
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleSave}
          disabled={saveVersion.isPending}
        >
          <Save className="h-3.5 w-3.5" />
          {saveVersion.isPending ? "Saving…" : "Save Version"}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <VersionSidebar versions={versions} />
        <div className="flex flex-1">
          <div className="flex-1">
            <EditorPane content={content} onChange={setContent} />
          </div>
          <div className="w-[380px]">
            <AICopilotPane content={content} title={paper.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;

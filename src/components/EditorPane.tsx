import { useState } from "react";
import { mockEditorContent } from "@/lib/mock-data";

const EditorPane = () => {
  const [content, setContent] = useState(mockEditorContent);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <h2 className="font-display text-sm font-semibold">Editor</h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>Auto-saved</span>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none bg-transparent p-6 font-body text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        placeholder="Start writing your paper…"
        spellCheck
      />
    </div>
  );
};

export default EditorPane;

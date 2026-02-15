import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

export type Paper = Tables<"papers">;

export const usePapers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["papers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Paper[];
    },
    enabled: !!user,
  });
};

export const useCreatePaper = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from("papers")
        .insert({ owner_id: user!.id, title })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["papers"] }),
  });
};

export const useUpdatePaper = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Paper> & { id: string }) => {
      const { error } = await supabase.from("papers").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["papers"] }),
  });
};

export const usePaperVersions = (paperId: string | undefined) => {
  return useQuery({
    queryKey: ["paper_versions", paperId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paper_versions")
        .select("*")
        .eq("paper_id", paperId!)
        .order("version_number", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!paperId,
  });
};

export const useSaveVersion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { paper_id: string; content: string; word_count: number; changes_summary: string }) => {
      // Get next version number
      const { data: versions } = await supabase
        .from("paper_versions")
        .select("version_number")
        .eq("paper_id", params.paper_id)
        .order("version_number", { ascending: false })
        .limit(1);
      const nextVersion = (versions?.[0]?.version_number ?? 0) + 1;
      const { error } = await supabase.from("paper_versions").insert({
        paper_id: params.paper_id,
        version_number: nextVersion,
        label: `v${nextVersion}`,
        content: params.content,
        word_count: params.word_count,
        changes_summary: params.changes_summary,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["paper_versions", vars.paper_id] }),
  });
};

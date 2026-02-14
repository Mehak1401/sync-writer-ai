import { BookOpen, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between border-b px-8 py-4">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-accent" />
        <h1 className="font-display text-xl font-semibold tracking-tight">ScholarSync</h1>
        <span className="ml-1 rounded-full bg-ai-muted px-2 py-0.5 text-xs font-medium text-ai">AI</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search papers…"
            className="w-64 pl-9 font-ui text-sm"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
        </Button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          JS
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

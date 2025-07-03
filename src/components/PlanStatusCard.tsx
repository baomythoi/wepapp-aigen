import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type PlanStatusCardProps = {
  plan: "Free" | "Pro";
  quota: number;
  used: number;
};

export function PlanStatusCard({ plan, quota, used }: PlanStatusCardProps) {
  const percent = Math.min(100, Math.round((used / quota) * 100));
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white border rounded-lg p-6 mb-8 shadow-sm gap-4">
      <div className="flex items-center gap-4">
        <Badge variant={plan === "Pro" ? "default" : "secondary"} className="text-base px-4 py-2">
          {plan} Plan
        </Badge>
        <div className="text-gray-500 text-sm">
          {quota - used} conversations left
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 max-w-xs">
        <Progress value={percent} className="h-2" />
        <div className="text-xs text-gray-400">
          {used} / {quota} conversations used
        </div>
      </div>
      <Button variant="outline" className="ml-0 md:ml-4">Upgrade</Button>
    </div>
  );
}
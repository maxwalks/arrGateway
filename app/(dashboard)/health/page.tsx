import Topbar from "@/components/layout/Topbar";
import HealthGrid from "@/components/health/HealthGrid";

export default function HealthPage() {
  return (
    <>
      <Topbar title="Health" />
      <div className="p-6">
        <HealthGrid />
      </div>
    </>
  );
}

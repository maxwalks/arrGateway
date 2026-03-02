import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import InviteForm from "@/components/admin/InviteForm";

export default function InvitePage() {
  return (
    <>
      <Topbar
        title="Add user"
        actions={
          <Link
            href="/admin/users"
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </Link>
        }
      />
      <div className="p-6">
        <InviteForm />
      </div>
    </>
  );
}

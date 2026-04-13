import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: authStatus, isLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey() }
  });
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!authStatus || !authStatus.isAuthenticated)) {
      setLocation("/admin/login");
    }
  }, [authStatus, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-blue)]" />
      </div>
    );
  }

  if (!authStatus?.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [passphrase, setPassphrase] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        if (data.success && data.isAuthenticated) {
          toast({
            title: "Access Granted",
            description: "Welcome to the admin dashboard.",
          });
          // Synchronously write the login response into the cache so
          // ProtectedRoute reads isAuthenticated:true the moment we navigate.
          // invalidateQueries is async (fires a background refetch) so the
          // dashboard would still see the stale unauthenticated value.
          queryClient.setQueryData(getGetMeQueryKey(), data);
          setLocation("/admin/dashboard");
        } else {
          toast({
            title: "Access Denied",
            description: "Invalid passphrase.",
            variant: "destructive",
          });
        }
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;
    loginMutation.mutate({ data: { passphrase } });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Navbar />

      <main className="max-w-md mx-auto px-4 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mb-4 border border-[var(--border-color)]">
              <KeyRound className="w-6 h-6 text-[var(--accent-yellow)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Access</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-2 text-center">
              Enter your passphrase to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="passphrase" className="text-sm font-medium text-[var(--text-secondary)]">
                Passphrase
              </label>
              <Input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="••••••••"
                className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-primary)] focus-visible:ring-[var(--accent-blue)] font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending || !passphrase.trim()}
              className="w-full bg-[var(--accent-blue)] text-[var(--bg-main)] hover:bg-[var(--accent-blue)]/90 font-bold"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loginMutation.isPending ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

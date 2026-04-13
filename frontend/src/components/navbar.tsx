import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  const { data: user } = useGetMe({
    query: { queryKey: getGetMeQueryKey(), retry: false }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const background = useTransform(
    scrollY,
    [0, 50],
    ["rgba(var(--bg-main), 0)", "rgba(var(--bg-main), 0.8)"]
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(var(--border-color), 0)", "1px solid rgba(var(--border-color), 0.1)"]
  );

  if (!isMounted) return null;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ background, backdropFilter, borderBottom }}
      className="w-full fixed top-0 z-50 transition-colors"
    >
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-[var(--text-primary)] hover:text-[var(--accent-blue)] transition-colors font-mono font-bold text-lg tracking-tighter">
          SHOWCASE
        </Link>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme("everforest")}
              className={`w-3 h-3 rounded-full transition-all ${theme === "everforest" ? "bg-[var(--accent-green)] scale-125" : "bg-[var(--border-color)] hover:bg-[var(--text-muted)]"}`}
              aria-label="Everforest theme"
            />
            <button
              onClick={() => setTheme("anime-subtle")}
              className={`w-3 h-3 rounded-full transition-all ${theme === "anime-subtle" ? "bg-[var(--accent-blue)] scale-125" : "bg-[var(--border-color)] hover:bg-[var(--text-muted)]"}`}
              aria-label="Anime theme"
            />
            <button
              onClick={() => setTheme("otaku-theme")}
              className={`w-3 h-3 rounded-full transition-all ${theme === "otaku-theme" ? "bg-[var(--accent-purple)] scale-125" : "bg-[var(--border-color)] hover:bg-[var(--text-muted)]"}`}
              aria-label="Otaku theme"
            />
          </div>

          {user && (
            <Link href="/admin/dashboard" className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">
              Admin
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

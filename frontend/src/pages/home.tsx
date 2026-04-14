import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { OtakuProjectCard } from "@/components/otaku-project-card";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextReveal } from "@/components/text-reveal";
import { DotGrid } from "@/components/dot-grid";
import { MangaBackground } from "@/components/manga-background";
import { OtakuOverlay } from "@/components/otaku-overlay";
import { Link } from "wouter";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const { data: projects, isLoading } = useListProjects({
    query: { queryKey: getListProjectsQueryKey() }
  });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const { theme } = useTheme();

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-main)] text-[var(--text-primary)] font-sans overflow-x-hidden selection:bg-[var(--accent-blue)] selection:text-[var(--bg-main)]">
      <DotGrid />
      {theme === "otaku-theme" && <MangaBackground />}
      {theme === "otaku-theme" && <OtakuOverlay />}
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="h-screen w-full flex flex-col justify-center relative px-6 max-w-[1400px] mx-auto">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <TextReveal 
              text="Digital" 
              as="h1"
              className="text-[clamp(4rem,12vw,10rem)] font-black leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)]" 
            />
            <TextReveal 
              text="Craftsmanship." 
              as="h1"
              className="text-[clamp(3.5rem,9.5vw,8.5rem)] font-black leading-[0.9] tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)]" 
            />
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 text-xl md:text-3xl text-[var(--text-secondary)] font-light max-w-2xl"
            >
              Building precise, cinematic, and robust web experiences.
            </motion.p>
            
            {theme === "otaku-theme" && (
              <p className="text-sm font-mono text-[var(--accent-pink)] opacity-60 mt-2 tracking-wider">
                第一章 — デジタルの物語 (Digital Stories, Chapter One)
              </p>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-12 flex items-center gap-6"
            >
              <a 
                href="#projects" 
                aria-label="View Work"
                className="px-8 py-4 border border-[var(--border-color)] rounded-full text-sm uppercase tracking-widest font-mono hover:bg-[var(--text-primary)] hover:text-[var(--bg-main)] transition-all duration-300"
              >
                {theme === "otaku-theme" ? "作品を見る" : "View Work"}
              </a>
              <Link href="/admin/login" className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors">
                [ Admin ]
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-24 left-6 right-6 h-[1px] bg-gradient-to-r from-[var(--border-color)] via-[var(--accent-blue)]/50 to-transparent origin-left max-w-[1400px] mx-auto"
          />
        </section>

        {/* Info Strip */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          className="max-w-[1400px] mx-auto px-6 py-8 border-b border-[var(--border-color)]"
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs md:text-sm font-mono text-[var(--text-muted)] uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              Available for work
            </span>
            <span className="hidden md:inline text-[var(--border-color)]">/</span>
            <span>{new Date().getFullYear()} Edition</span>
            <span className="hidden md:inline text-[var(--border-color)]">/</span>
            <span>{projects?.length || 0} Selected Projects</span>
            <span className="hidden md:inline text-[var(--border-color)]">/</span>
            <span>Frontend & Backend</span>
          </div>
        </motion.section>

        {/* Projects Section */}
        <section id="projects" className="py-32">
          <div className="max-w-[1400px] mx-auto px-6 mb-24">
            <TextReveal 
              text="Selected Work" 
              as="h2"
              className="text-5xl md:text-8xl font-black tracking-tighter"
            />
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex justify-center py-32">
                <div className="w-12 h-12 border-t-2 border-[var(--accent-blue)] rounded-full animate-spin" />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="flex flex-col">
                {projects.map((project, i) => (
                  <div key={project.id} className="relative">
                    {theme !== "otaku-theme" && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-0 left-0 right-0 h-[1px] bg-[var(--border-color)] origin-left"
                      />
                    )}
                    {theme === "otaku-theme" ? (
                      <OtakuProjectCard project={project} index={i} />
                    ) : (
                      <ProjectCard project={project} index={i} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-[1400px] mx-auto px-6 py-32">
                <p className="text-xl font-mono text-[var(--text-muted)]">No projects found. System empty.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-color)] relative z-10 bg-[var(--bg-main)]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-mono text-[var(--text-muted)] uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Showcase Portfolio.
          </p>
          <div className="text-xs font-mono text-[var(--accent-blue)] opacity-50">
            [ ALL SYSTEMS NOMINAL ]
          </div>
        </div>
      </footer>
    </div>
  );
}

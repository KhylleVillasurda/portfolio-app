import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@workspace/api-client-react/src/generated/api.schemas";

interface ProjectCardProps {
  project: Project;
  index: number;
}

import { getTechIcon } from "@/lib/tech-options";

export function ProjectCard({ project, index }: ProjectCardProps) {
  const formattedIndex = (index + 1).toString().padStart(2, "0");
  const mainImage = project.images?.sort((a, b) => a.displayOrder - b.displayOrder)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group relative border-b border-[var(--border-color)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[var(--bg-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
        {/* Project Number */}
        <div className="text-6xl md:text-8xl font-black font-sans text-[var(--text-primary)] opacity-15 tracking-tighter shrink-0 w-32 transition-opacity duration-500 group-hover:opacity-30">
          {formattedIndex}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 z-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent-blue)] transition-colors duration-500">
              {project.title}
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech, i) => {
                const iconInfo = getTechIcon(tech);
                return (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--bg-main)]/50 backdrop-blur-sm"
                  >
                    {iconInfo && <img src={iconInfo.iconUrl} alt={tech} className="w-4 h-4" />}
                    {tech}
                  </span>
                );
              })}
            </div>
          </div>

          <p className="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {project.description}
          </p>

          <div className="flex items-center gap-6 pt-4">
            {project.extUrl && (
              <a
                href={project.extUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--accent-blue)] transition-colors"
              >
                <span>Live Site</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
              >
                <span>Source Code</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Hover Image Reveal */}
        <div className="hidden md:block w-72 h-48 md:w-96 md:h-64 shrink-0 relative overflow-hidden rounded-lg opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-out z-10">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center">
              <div className="w-16 h-16 border-t-2 border-r-2 border-[var(--accent-blue)] rounded-full animate-spin opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 border border-[var(--accent-blue)]/20 rounded-lg pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-blue)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@workspace/api-client-react/src/generated/api.schemas";

interface ProjectCardProps {
  project: Project;
  index: number;
}

import { getTechIcon } from "@/lib/tech-options";

export function OtakuProjectCard({ project, index }: ProjectCardProps) {
  const formattedIndex = (index + 1).toString().padStart(2, "0");
  const mainImage = project.images?.sort((a, b) => a.displayOrder - b.displayOrder)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover="hover"
      className="group relative my-12"
    >
      <motion.div 
        variants={{
          hover: { 
            borderColor: "rgba(255,255,255,1)",
            boxShadow: "inset 4px 4px 0 var(--accent-purple), 0 0 20px rgba(184, 41, 221, 0.3)",
            transition: { duration: 0.15 }
          }
        }}
        className="relative bg-[var(--bg-card)] manga-border p-8 md:p-12 overflow-hidden flex flex-col md:flex-row gap-8 z-10"
      >
        {/* Project Number */}
        <div className="absolute top-[-1rem] left-[-1rem] text-[6rem] font-black font-sans text-[var(--accent-yellow)] opacity-20 tracking-tighter transform -rotate-3 z-0 pointer-events-none">
          #{formattedIndex}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-6 z-10 relative">
          <div className="border-t-4 border-[var(--accent-red)] pt-4 otaku-speed-lines relative">
            <h3 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] impact-text tracking-tight uppercase relative z-10">
              {project.title}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-2">
            {project.techStack.map((tech, i) => {
              const iconInfo = getTechIcon(tech);
              return (
                <span
                  key={i}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-input)]"
                >
                  {iconInfo && <img src={iconInfo.iconUrl} alt={tech} className="w-5 h-5" />}
                  {tech}
                </span>
              );
            })}
          </div>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl font-medium leading-relaxed bg-[var(--bg-main)]/50 p-4 border border-[var(--border-color)] mt-2">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 mt-auto">
            {project.extUrl && (
              <a
                href={project.extUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-2 text-lg font-black uppercase tracking-widest text-[var(--accent-blue)] relative overflow-hidden"
              >
                <span className="relative z-10">Live Site</span>
                <ArrowUpRight className="w-6 h-6 relative z-10" />
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent-blue)] transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-200" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-2 text-lg font-black uppercase tracking-widest text-[var(--accent-green)] relative overflow-hidden"
              >
                <span className="relative z-10">Source Code</span>
                <ArrowUpRight className="w-6 h-6 relative z-10" />
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent-green)] transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-200" />
              </a>
            )}
          </div>
        </div>

        {/* Image Area — height adapts to the image's natural aspect ratio */}
        <div className="w-full md:w-[400px] shrink-0 border-4 border-white/20 relative bg-[var(--bg-main)] z-10">
          {mainImage ? (
            <div className="relative">
              <img
                src={mainImage.url}
                alt={project.title}
                className="w-full h-auto block grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              {/* Halftone overlay on image */}
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1.5px)", backgroundSize: "8px 8px" }} />
            </div>
          ) : (
            <div className="w-full min-h-[300px] relative flex items-center justify-center overflow-hidden" style={{ background: "conic-gradient(from 0deg at 30% 70%, transparent 89deg, rgba(255,255,255,0.08) 90deg, transparent 91deg, transparent 178deg, rgba(255,255,255,0.05) 179deg, transparent 180deg)" }}>
               <div className="text-[120px] font-black text-white/5 whitespace-nowrap absolute transform -rotate-12 select-none">
                 {project.title}
               </div>
               <div className="text-[120px] font-black text-white/5 whitespace-nowrap absolute transform -rotate-12 translate-y-32 translate-x-12 select-none">
                 {project.title}
               </div>
               {/* Halftone overlay on placeholder */}
               <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1.5px)", backgroundSize: "8px 8px" }} />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

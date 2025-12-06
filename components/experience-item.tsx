interface ExperienceItemProps {
  role: string;
  company: string;
  period: string;
  description: string;
}

export function ExperienceItem({ role, company, period, description }: ExperienceItemProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6 group">
      <span className="text-sm text-neutral-400 font-mono pt-1">{period}</span>
      <div>
         <h3 className="font-medium text-lg text-black group-hover:text-neutral-600 transition-colors">
            {role} <span className="text-neutral-300 font-light mx-2">/</span> {company}
         </h3>
         <p className="text-neutral-600 mt-2 leading-relaxed text-sm sm:text-base">
            {description}
         </p>
      </div>
    </div>
  );
}

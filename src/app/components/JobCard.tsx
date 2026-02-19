import { Building2 } from 'lucide-react';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-violet-400';
    if (score >= 80) return 'text-cyan-400';
    if (score >= 70) return 'text-green-400';
    return 'text-amber-400';
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg border text-left transition-all ${
        isSelected
          ? 'bg-white/5 border-violet-500/50'
          : 'bg-black/20 border-white/5 hover:bg-white/[0.02] hover:border-white/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
          <Building2 className="size-5 text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white mb-0.5 truncate">
            {job.title}
          </h3>
          <p className="text-xs text-gray-400 mb-1">{job.company}</p>
          <p className="text-xs text-gray-500">{job.location}</p>
        </div>

        <div className="text-right flex-shrink-0">
          <div className={`text-lg font-bold ${getScoreColor(job.matchScore)}`}>
            {job.matchScore}%
          </div>
          <div className="text-xs text-gray-500">match</div>
        </div>
      </div>
    </button>
  );
}

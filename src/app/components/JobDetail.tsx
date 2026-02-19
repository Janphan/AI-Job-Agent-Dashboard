import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Job } from '../types/job';

interface JobDetailProps {
  job: Job | null;
}

export function JobDetail({ job }: JobDetailProps) {
  if (!job) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <Sparkles className="size-12 mx-auto mb-2 opacity-20" />
          <p className="text-sm">Select a job to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-8 border-b border-white/10">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
          <p className="text-gray-400 mb-1">{job.company}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.salary}</span>
            <span>•</span>
            <span>{job.posted}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-3xl space-y-8">
          {/* Match Score */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Sparkles className="size-5 text-violet-400" />
            <div>
              <div className="text-2xl font-bold text-violet-400">{job.matchScore}% Match</div>
              <p className="text-sm text-gray-400">AI analyzed compatibility</p>
            </div>
          </div>

          {/* Why it matches */}
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-400" />
              Why this matches
            </h3>
            <ul className="space-y-2">
              {job.whyMatch.map((reason, index) => (
                <li key={index} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-green-400">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Keywords */}
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <XCircle className="size-4 text-amber-400" />
              Missing from your profile
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-semibold mb-3">About the role</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Generate Cover Letter */}
          <button className="w-full px-4 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors flex items-center justify-center gap-2 font-medium">
            <Sparkles className="size-4" />
            Generate cover letter
          </button>
        </div>
      </div>
    </div>
  );
}

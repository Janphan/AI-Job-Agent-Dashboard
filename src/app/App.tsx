import { useState } from 'react';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import { mockJobs } from './data/mockJobs';
import { JobCard } from './components/JobCard';
import { JobDetail } from './components/JobDetail';
import { Job } from './types/job';

export default function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(mockJobs[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Jobs List */}
      <div className="w-[420px] border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-violet-400" />
            <h1 className="text-lg font-semibold">AI Job Agent</h1>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing jobs...
              </>
            ) : (
              <>
                <Search className="size-4" />
                Find new jobs
              </>
            )}
          </button>
        </div>

        {/* Jobs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs text-gray-500 px-2 mb-3">
            {mockJobs.length} jobs analyzed
          </p>
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>
      </div>

      {/* Job Detail */}
      <div className="flex-1">
        <JobDetail job={selectedJob} />
      </div>
    </div>
  );
}

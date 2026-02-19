export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  logo?: string;
  whyMatch: string[];
  missingKeywords: string[];
  description: string;
  requirements: string[];
  posted: string;
}

import Link from 'next/link';

import { formateDatePreview } from '@/utils/formatDate';

interface QuinkIssue {
  id: string;
  cover_image_url: string;
  title: string;
  summary: string;
  tags: string;
  pinned: 0 | 1;
  first_published_at: string;
  published_at: string;
  page_view_count: number;
  page_read_count: number;
  outline: Array<{
    level: 1 | 2 | 3 | 4;
    text: string;
  }>;
  score: number;
  is_paid_content: boolean;
}

export interface NewsLettersProps {
  className?: string;
  issues: QuinkIssue[];
}

const NewsLetters = ({ className, issues }: NewsLettersProps) => {
  const issueLen = issues?.length ?? 0;
  return (
    <div className={className}>
      <h1 className="font-semibold text-center mb-2">Previous Issues</h1>
      <ul>
        {issues.map((issue, idx) => (
          <li key={issue.id} className="grid grid-cols-[1fr_4fr_1fr] p-2 border-b last:border-none">
            <div>{formateDatePreview(issue.published_at)}</div>
            <div className="text-subscrible">
              <Link href={`/newsletter/${issue.id}`}>{issue?.title}</Link>
            </div>
            <div className="text-right opacity-60">#{issueLen - idx}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsLetters;

import Link from 'next/link';

import { formateDatePreview } from '@/utils/formatDate';

interface RevueIssue {
  id: string;
  send_time: string;
  settings: {
    title: string;
  };
}

export interface NewsLettersProps {
  className?: string;
  issues: RevueIssue[];
}

const NewsLetters = ({ className, issues }: NewsLettersProps) => {
  const issueLen = issues?.length ?? 0;
  return (
    <div className={className}>
      <h1 className="font-semibold text-center mb-2">Previous Issues</h1>
      <ul>
        {issues.map((issue, idx) => (
          <li key={issue.id} className="grid grid-cols-[1fr_4fr_1fr] p-2 border-b last:border-none">
            <div>{formateDatePreview(issue.send_time)}</div>
            <div className="text-subscrible">
              <Link href={`/newsletter/${issue.id}`}>{issue?.settings?.title}</Link>
            </div>
            <div className="text-right opacity-60">#{issueLen - idx}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsLetters;

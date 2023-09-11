import { useEffect, useState } from 'react';

import Issues from '@/components/Issues';
import Subscribe from '@/components/Subscribe';

const Subscription = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetch('/api/newsletters')
      .then((res) => res.json())
      .then((revRes) => {
        setIssues(revRes.issues);
      });
  }, []);
  return (
    <div className="max-w-[85ch] mx-auto flex justify-center items-center mt-[20ch] flex-col">
      <Subscribe />
      <Issues className="mt-10 w-11/12" issues={issues} />
    </div>
  );
};

export default Subscription;

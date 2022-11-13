import { useEffect } from 'react';

import Subscribe from '@/components/Subscribe';

const Subscription = () => {
  useEffect(() => {
    fetch('/api/newletters', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });
  }, []);

  return (
    <div className="max-w-[85ch] mx-auto flex justify-center items-center mt-[20ch]">
      <Subscribe />
    </div>
  );
};

export default Subscription;

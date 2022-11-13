import Issues from '@/components/Issues';
import Subscribe from '@/components/Subscribe';

export async function getServerSideProps() {
  const res = await fetch('/api/newletters', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  });

  const issues = await res.json();

  return { props: { issues } };
}

const Subscription = ({ issues }) => {
  return (
    <div className="max-w-[85ch] mx-auto flex justify-center items-center mt-[20ch] flex-col">
      <Subscribe />
      <Issues className="mt-10 w-11/12" issues={issues} />
    </div>
  );
};

export default Subscription;

import Issues from '@/components/Issues';
import Subscribe from '@/components/Subscribe';

export async function getServerSideProps() {
  const revRes = await fetch('https://www.getrevue.co/api/v2/issues', {
    method: 'GET',
    headers: {
      Authorization: `Token ${process.env.REVUE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const issues = await revRes.json();

  if (!revRes.ok) {
    return { props: { issues: [] } };
  }

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

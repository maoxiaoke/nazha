import Issues from '@/components/Issues';
import Subscribe from '@/components/Subscribe';

export async function getServerSideProps() {
  const revRes = await fetch(
    `https://${process.env.MAILCHIMP_API_DC}.api.mailchimp.com/3.0/campaigns?count=1000`,
    {
      method: 'GET',
      headers: {
        Authorization: `anystring ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const resObj = await revRes.json();

  console.log('adfsdf', resObj);

  if (resObj.status >= 400) {
    return { props: { issues: [] } };
  }

  return { props: { issues: resObj?.campaigns } };
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

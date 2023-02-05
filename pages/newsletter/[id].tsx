export async function getServerSideProps({ params }) {
  const { id } = params;
  const revRes = await fetch(
    `https://${process.env.MAILCHIMP_API_DC}.api.mailchimp.com/3.0/campaigns/${id}/content`,
    {
      method: 'GET',
      headers: {
        Authorization: `anystring ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const resObj = await revRes.json();

  if (resObj.status >= 400) {
    return { props: { issueContent: {} } };
  }

  return { props: { issueContent: resObj } };
}

export const Newsletter = ({ issueContent }) => {
  return (
    <div className="max-w-[75ch] mx-auto pt-12 pb-28 px-5">
      {/* @ts-ignore ignore to warn web component */}
      <newsletter-content content={issueContent?.html}></newsletter-content>
    </div>
  );
};

export default Newsletter;

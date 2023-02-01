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
  return <div dangerouslySetInnerHTML={{ __html: issueContent?.html }} />;
};

export default Newsletter;

export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://hnta.nazha.co',
      permanent: true
    }
  };
}

const HackNewsTopArchive = () => {
  return <></>;
};

export default HackNewsTopArchive;

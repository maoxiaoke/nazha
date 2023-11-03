export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
      // Do nothing
    },
    function (err) {
      throw new Error(err);
    }
  );
};

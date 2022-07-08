import React, { FormEvent, useRef, useState } from 'react';

const LoadingSVG = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 19 17"
        className="fill-black dark:fill-white"
        width="20"
        height="20">
        <circle className="loadingCircle" cx="2.2" cy="10" r="1.6" />
        <circle className="loadingCircle" cx="9.5" cy="10" r="1.6" />
        <circle className="loadingCircle" cx="16.8" cy="10" r="1.6" />
      </svg>
    </div>
  );
};

const Subscribe = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: inputEl?.current?.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    setLoading(false);
    const json = await res.json();
    const { error } = json;

    if (error) {
      setErrMsg(error);
      return;
    }

    if (inputEl?.current?.value) {
      inputEl.current.value = '';
    }

    setErrMsg('Success! 🎉 You are now subscribed to the newsletter.');
  };

  return (
    <div className="w-full p-4 bg-subscrible mt-10">
      <p className="text-xl font-bold text-gray-900 m-0">Subscribe to the newsletter</p>
      <p className="mt-1 text-gray-500 text-sm">
        Get emails from me about web development, tech, and early access to new articles. I will
        only send emails when new content is posted. No spam.
      </p>
      <form className="relative mt-4" onSubmit={subscribe}>
        <input
          className="px-4 py-2 mt-1 block w-full border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-32 outline-none"
          ref={inputEl}
          placeholder="Your e-mail address"
          type="email"
          autoComplete="email"
          required
        />
        {errMsg && <div className="mt-4 text-gray-500 text-sm">{errMsg}</div>}
        <button
          type="submit"
          className="flex items-center justify-center absolute right-1 top-1 px-4 pt-1 font-medium h-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded w-28">
          {loading ? <LoadingSVG /> : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default Subscribe;

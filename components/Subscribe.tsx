import React, { FormEvent, useRef, useState } from 'react';

const Subscribe = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [errMsg, setErrMsg] = useState('');

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: inputEl?.current?.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
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
    <>
      <p className="text-xl font-bold text-gray-900 m-0">Subscribe to the newsletter</p>
      <p className="m-1 text-gray-500">
        Get emails from me about web development, tech, and early access to new articles.
      </p>
      <form className="relative" onSubmit={subscribe}>
        <input
          className="px-4 py-2 mt-1 block w-full border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-32 outline-none"
          ref={inputEl}
          placeholder="maoxiaoke@outlook.com"
          type="email"
          autoComplete="email"
          required
        />
        {/* <div>{errMsg ? errMsg : `I'll only send emails when new content is posted. No spam.`}</div> */}
        <button
          type="submit"
          className="flex items-center justify-center absolute right-1 top-1 px-4 pt-1 font-medium h-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded w-28">
          Subscribe
        </button>
      </form>
    </>
  );
};

export default Subscribe;

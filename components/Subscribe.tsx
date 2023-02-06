import Image from 'next/image';
import React, { FormEvent, useRef, useState } from 'react';

const LoadingSVG = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 19 17"
        className="fill-white dark:fill-white"
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
    <div className="w-full p-4 mt-10 fontOutfit">
      <div className="flex justify-between items-center">
        <div>
          <Image
            className="w-8 h-8 rounded-full overflow-hidden"
            src="/portrait/logo.jpg"
            alt="portrait"
            width="100px"
            height="100px"
          />
        </div>

        <div className="max-w-[55ch]">
          <p className="font-medium text-sm">Have a weekly visit of</p>
          <p className="font-bold text-2xl bg-gradient-to-r from-subscribleRight to-subscrible bg-clip-text text-transparent">
            Howl&apos;s Moving Castle
          </p>
          <p className="font-light mt-4">
            Get emails from me about web development, tech, and early access to new articles. I will
            only send emails when new content is posted.
          </p>
          <p className="font-bold">Subscribe Now!</p>
        </div>
      </div>
      <div>
        <form className="relative mt-4 border rounded" onSubmit={subscribe}>
          <input
            className="px-4 py-2 block w-full border-gray-300 rounded-md bg-white dark:bg-bg text-gray-900 dark:text-gray-100 pr-32 outline-none"
            ref={inputEl}
            placeholder="Your e-mail address"
            type="email"
            autoComplete="email"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-subscribleRight to-subscrible flex items-center justify-center absolute right-1 top-1 px-4 py-1 font-medium bg-subscrible text-white rounded w-28 h-9">
            {loading ? <LoadingSVG /> : 'SUBSCRIBE'}
          </button>
        </form>
        {errMsg && <div className="mt-4 text-gray-500 text-sm">{errMsg}</div>}
      </div>
    </div>
  );
};

export default Subscribe;

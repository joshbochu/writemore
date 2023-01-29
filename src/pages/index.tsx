import React, { useState, useEffect } from 'react';

export default function Home() {
  const [wordCount, setWordCount] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    setWordCount(text.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0));
  }, [text]);

  return (
    <div className="flex justify-center h-screen">
      <textarea
        placeholder="Write here..."
        // className="overflow-hidden resize-none rounded w-1/3 h-full border-8 border-stone-200 outline-0"
        className="overflow-hidden resize-none rounded w-1/3 h-full outline-0"
        onChange={e => setText(e.target.value)}
      >
      </textarea>
      <div className="absolute bottom-0 right-0 p-4">
        <div className="text-sm">Word Count: {wordCount}</div>
      </div>
    </div>
  );
}

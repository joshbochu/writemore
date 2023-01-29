import React, { useState, useEffect } from 'react';

export default function Home() {
  const [wordCount, setWordCount] = useState(0);
  const [text, setText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setWordCount(text.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0));
  }, [text]);

  return (
    <div className={`flex justify-center h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <textarea
        placeholder="Write here..."
        className={`overflow-hidden resize-none rounded w-1/3 h-full outline-0 ${darkMode ? 'bg-gray-800 text-white' : ''}`}
        onChange={e => setText(e.target.value)}
      >
      </textarea>
      <div className="absolute bottom-0 right-0 p-4">
        <div className={`text-sm ${darkMode ? 'text-white' : ''}`}>Word Count: {wordCount}</div>
      </div>
      <div className="absolute top-0 right-0 p-4">
        <div className="text-sm">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'} p-2 rounded-md`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}

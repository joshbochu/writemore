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
        className={`overflow-hidden resize-none rounded w-1/3 h-full outline-0 pt-16 ${darkMode ? 'bg-gray-800 text-white' : ''}`}
        onChange={e => setText(e.target.value)}
      >
      </textarea>
      <div className={`text-sm absolute bottom-0 right-0 p-4 ${darkMode ? 'text-white' : ''}`}>
        {wordCount}
      </div>
      <div className="absolute top-0 right-0 p-4">
        <img
          onClick={() => setDarkMode(!darkMode)}
          src="https://upload.wikimedia.org/wikipedia/commons/a/a3/U%2B25D1.svg"
          style={{ filter: darkMode ? "invert(100%)" : "invert(0%)", width: "25px", height: "25px" }}>
        </img>
        {/* <div className="text-sm">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'} p-2 rounded-md`}
          >
            {darkMode ? '🌞' : 'Dark Mode'}
          </button>
        </div> */}
      </div>
    </div>
  );
}
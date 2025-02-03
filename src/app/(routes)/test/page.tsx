"use client"
import React, { useEffect } from 'react';

const TestPage = () => {
  useEffect(() => {  
    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = `http://localhost:3000/buble`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Append script to document
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="relative">
      <p>test page</p>
    </div>
  );
};

export default TestPage;
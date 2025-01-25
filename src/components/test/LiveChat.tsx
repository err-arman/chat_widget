"use client"

import React, { useEffect } from "react";

const LiveChat = () => {
  useEffect(() => {
    // Dynamically load the Tawk.to script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/678cf0a23a842732607145a3/1ihv8nuuk";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Add the script to the document
    document.body.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // No UI for this component
};

export default LiveChat;

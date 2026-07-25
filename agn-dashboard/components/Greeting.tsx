'use client';

import { useEffect, useState } from 'react';

export default function Greeting() {
  const [message, setMessage] = useState('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    const lastVisit = localStorage.getItem('agn_last_visit');
    const today = new Date().toDateString();

    let greeting: string;
    if (lastVisit === today) {
      greeting = 'Welcome back';
    } else if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    setMessage(greeting);
    localStorage.setItem('agn_last_visit', today);
  }, []);

  return (
    <div className="greeting">
      <span className="greeting-eyebrow">AGN International</span>
      <h1 className="greeting-title">{message}.</h1>
      <p className="greeting-sub">Here's what's happening across the network today.</p>
    </div>
  );
}
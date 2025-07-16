import React from 'react';
import CountdownTimer from './CountdownTimer';

export default function SignalCard({ interval, signal }) {
  if (!signal) return null;

  return (
    <div className="signal-card">
      <h3>{interval}</h3>
      <div className="signal-display">
        <div className={`prediction ${signal.bigSmall.toLowerCase()}`}>
          {signal.bigSmall}
        </div>
        <div className={`prediction ${signal.greenRed.toLowerCase()}`}>
          {signal.greenRed}
        </div>
        <div className="numbers">
          {signal.numbers.map((num, index) => (
            <span key={index} className="number">{num}</span>
          ))}
        </div>
      </div>
      <CountdownTimer interval={interval} />
    </div>
  );
}

import React from 'react';

export const NeuralNetworkIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {/* Nodes */}
    <circle cx="8" cy="8" r="2" fill="white" />
    <circle cx="24" cy="8" r="2" fill="white" />
    <circle cx="8" cy="24" r="2" fill="white" />
    <circle cx="24" cy="24" r="2" fill="white" />
    <circle cx="16" cy="16" r="3" fill="white" />
    
    {/* Connections */}
    <line x1="8" y1="8" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
    <line x1="24" y1="8" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
    <line x1="8" y1="24" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
    <line x1="24" y1="24" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
  </svg>
);

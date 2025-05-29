
export const orbStyles = `
  @keyframes pulse-ring {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(2.4);
      opacity: 0;
    }
  }
  
  .pulse-ring {
    animation: pulse-ring 3s infinite;
  }
  
  .orb-hover:hover {
    transform: scale(1.05);
  }
`;

export const panelStyles = `
  @keyframes panel-enter {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  .kiaan-panel {
    animation: panel-enter 0.3s ease-out;
  }
  
  @media (max-width: 768px) {
    .kiaan-panel {
      width: 95vw !important;
      height: 95vh !important;
    }
  }
`;

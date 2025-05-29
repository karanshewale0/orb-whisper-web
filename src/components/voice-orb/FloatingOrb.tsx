
import React, { useRef } from 'react';
import { NeuralNetworkIcon } from './NeuralNetworkIcon';
import { orbStyles } from './styles';
import { Position } from './types';

interface FloatingOrbProps {
  position: Position;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const orbSize = 64;

export const FloatingOrb: React.FC<FloatingOrbProps> = ({
  position,
  isDragging,
  onMouseDown,
  onClick
}) => {
  const orbRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>{orbStyles}</style>
      
      <div
        ref={orbRef}
        className="fixed z-50 cursor-pointer select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${orbSize}px`,
          height: `${orbSize}px`,
        }}
        onMouseDown={onMouseDown}
        onClick={onClick}
      >
        <div className="relative">
          {/* Pulsing ring */}
          <div className="absolute inset-0 pulse-ring">
            <div 
              className="w-16 h-16 rounded-full border-2 border-blue-400 opacity-30"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            ></div>
          </div>
          
          {/* Main orb */}
          <div 
            className="relative w-16 h-16 rounded-full orb-hover transition-transform duration-200 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 0 20px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)',
              transform: isDragging ? 'none' : undefined,
            }}
          >
            <NeuralNetworkIcon />
          </div>
        </div>
      </div>
    </>
  );
};

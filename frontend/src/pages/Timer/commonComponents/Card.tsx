import type { ReactNode } from 'react';

interface CardProps {
  content?: ReactNode;
  className?: string;
  title?: string;
}

const Card = ({ content, className = '', title }: CardProps) => {
  return (
    <div
      className={`p-6 rounded-2xl border shadow-xl backdrop-blur-sm bg-white/80 border-white/20 ${className}`}
    >
      {title && (
        <h2 className='mb-4 text-lg font-bold text-center text-gray-800'>
          {title}
        </h2>
      )}
      {content}
    </div>
  );
};

export default Card;

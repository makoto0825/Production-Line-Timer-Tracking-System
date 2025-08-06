interface InfoItem {
  id?: string;
  label: string;
  value: string | number;
}

interface InfoGridProps {
  items: InfoItem[];
  className?: string;
}

const InfoGrid = ({ items, className = '' }: InfoGridProps) => {
  return (
    <div
      className={`grid grid-cols-2 gap-4 text-center md:grid-cols-4 ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={item.id || `info-item-${index}`}
          className='p-3 bg-gray-50 rounded-lg'
        >
          <p className='text-sm text-gray-600'>{item.label}</p>
          <p className='font-semibold text-gray-800'>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoGrid;

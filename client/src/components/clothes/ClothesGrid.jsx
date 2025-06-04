import React, { useState, useEffect } from 'react';
import ClothesCard from './ClothesCard';

const ClothesGrid = ({ clothes }) => {
  const [filteredClothes, setFilteredClothes] = useState(clothes);

  // This component expects clothes prop and manages filter
  // If you want to add filter controls here, you can or pass filtered data from parent

  useEffect(() => {
    setFilteredClothes(clothes);
  }, [clothes]);

  if (!clothes.length) {
    return <div className="p-6 text-center">No clothes found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredClothes.map(item => (
        <ClothesCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ClothesGrid;

import React, { useState } from 'react';

interface CategoryIconProps {
  icon: string;
  className?: string;
  imgClassName?: string;
}

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value);

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, className = '', imgClassName = '' }) => {
  const [failed, setFailed] = useState(false);

  if (!isUrl(icon)) {
    return <span className={`material-symbols-outlined ${className}`}>{icon}</span>;
  }

  if (failed) {
    return <span className={`material-symbols-outlined ${className}`}>category</span>;
  }

  return (
    <img
      src={icon}
      alt=""
      loading="lazy"
      className={`shrink-0 object-contain ${imgClassName}`}
      onError={() => setFailed(true)}
    />
  );
};

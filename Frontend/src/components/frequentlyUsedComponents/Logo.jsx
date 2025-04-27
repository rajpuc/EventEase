import React from 'react';
import assetList from '../../assets/assetList';

const Logo = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex gap-2 items-center">
        <img className="w-7 h-7" src={assetList.logo} alt="EventEase Logo" />
        <h2 className="font-bold text-2xl">EventEase</h2>
      </div>
    </div>
  );
};

export default Logo;

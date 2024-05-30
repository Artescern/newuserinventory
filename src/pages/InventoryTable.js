import React from 'react';
import SideNav from '../components/SideNav'
import { useLocation } from 'react-router-dom';
import Table from '../components/Table';

const InventoryTable = () => {
  const location = useLocation();
  const { userEmail } = location.state || {};

  return (
    <div className='flex mr-10'>
      <SideNav userEmail={userEmail}/>
      <div className='ml-10 flex justify-center items-center w-full'>
        <Table />
      </div>
    </div>
  );
};

export default InventoryTable;

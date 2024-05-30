import React from 'react';

const InventorySearch = ({ tableRows, setTableRows, selectedTable, savedTableRows }) => {
  const tableFields = {
    Laptops: ["assetTag", "serialNumber", "status", "brand", "model", "type", "color", "issuedTo", "grant"],
    Students: ["badgeName", "studentName", "location"],
    Supplies: [""]
  };

  const handleSearch = (userInput) => {
    if (!userInput.trim()) {
      setTableRows(savedTableRows);
    } else {
      const filteredOptions = savedTableRows.filter(row => {
        const fieldsToSearch = tableFields[selectedTable] || [];
        return fieldsToSearch.some(field => {
          const fieldValue = row[field] ? row[field].toLowerCase() : '';
          return fieldValue.includes(userInput.toLowerCase());
        });
      });
      setTableRows(filteredOptions);
    }
  };

  return (
    <div className="relative mb-4">
      <label htmlFor="table-search" className="sr-only">Search</label>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input
        type="text"
        id="table-search-users"
        className="block w-80 pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search for users"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default InventorySearch;

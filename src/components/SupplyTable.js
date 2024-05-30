import React, { useState } from 'react';
import EditForm from './EditForm';
import Pagination from './Pagination';

const SupplyTable = ({
  tableRows,
  editMode,
  selectedRow,
  handleInputChange,
  confirmEdit,
  editRow,
  deleteRow,
  currentId,
  setCurrentId
}) => {
  const first = "sku";
  const second = "quantityInStock";
  const third = "unit";
  const fourth = "buildingLocation";
  const fifth = "floor";
  const sixth = "lockerArea";
  const seventh = "reorderLevel";
  const eighth = "reorderQuantity";
  const ninth = "leadTimeForReorder";
  const tenth = "vendor";
  const eleventh = "estimatedCost";
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableRows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 w-full">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="w-1/12 px-6 py-3">SKU</th>
              <th className="w-1/12 px-6 py-3">In Stock</th>
              <th className="w-1/12 px-6 py-3">Unit</th>
              <th className="w-1/12 px-6 py-3">Building</th>
              <th className="w-1/12 px-6 py-3">Floor</th>
              <th className="w-1/12 px-6 py-3">Locker</th>
              <th className="w-1/12 px-6 py-3">Reorder Level</th>
              <th className="w-1/12 px-6 py-3">Reorder Quantity</th>
              <th className="w-1/12 px-6 py-3">Lead Time</th>
              <th className="w-1/12 px-6 py-3">Vendor</th>
              <th className="w-1/12 px-6 py-3">Estimated Cost</th>
              <th className="w-2/12 px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, index) =>
              editMode === true && selectedRow === row.id ? (
                <EditForm
                  key={row.id}
                  row={row}
                  handleInputChange={handleInputChange}
                  confirmEdit={confirmEdit}
                  selectedTable="Supplies"
                />
              ) : (
                <tr key={row.id} className={index % 2 === 0 ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700" : "bg-white dark:bg-gray-800"}>
                  <td className="w-1/12 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{row[first]}</td>
                  <td className="w-1/12 px-6 py-4">{row[second]}</td>
                  <td className="w-1/12 px-6 py-4">{row[third]}</td>
                  <td className="w-1/12 px-6 py-4">{row[fourth]}</td>
                  <td className="w-1/12 px-6 py-4">{row[fifth]}</td>
                  <td className="w-1/12 px-6 py-4">{row[sixth]}</td>
                  <td className="w-1/12 px-6 py-4">{row[seventh]}</td>
                  <td className="w-1/12 px-6 py-4">{row[eighth]}</td>
                  <td className="w-1/12 px-6 py-4">{row[ninth]}</td>
                  <td className="w-1/12 px-6 py-4">{row[tenth]}</td>
                  <td className="w-1/12 px-6 py-4">{row[eleventh]}</td>
                  <td className="w-2/12 px-6 py-4">
                    <button
                      onClick={() => editRow(row.id)}
                      className="bg-customBlue hover:bg-customBlueLight text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={tableRows.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default SupplyTable;

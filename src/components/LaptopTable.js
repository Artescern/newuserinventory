import React, { useEffect, useState } from 'react';
import Loan from './Loan';
import Maintenance from './Maintenance';
import EditForm from './EditForm';
import Pagination from './Pagination'; 

const LaptopTable = ({
  tableRows,
  editMode,
  selectedRow,
  handleInputChange,
  confirmEdit,
  editRow,
  deleteRow,
  currentId,
  setCurrentId,
  fetchData,
  setTableRows
}) => {

  const [viewMainMode, setViewMainMode] = useState(false);
  const [viewLoanMode, setViewLoanMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  const viewMaintenance = (id) => {
    setCurrentId(id);
    setViewMainMode(!viewMainMode);
    console.log(viewMainMode);
  };

  const viewLoan = (id) => {
    setCurrentId(id);
    setViewLoanMode(!viewLoanMode);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableRows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
<div className="relative overflow-x-hidden shadow-md sm:rounded-lg p-4 w-full">
      {viewMainMode && (
        <Maintenance
          tableRows={tableRows}
          viewMainMode={viewMainMode}
          id={currentId}
          viewMaintenance={viewMaintenance}
          
        />
      )}
      {viewLoanMode && (
        <Loan
          tableRows={tableRows}
          viewLoanMode={viewLoanMode}
          id={currentId}
          viewLoan={viewLoan}
          fetchTableData={fetchData}
        />
      )}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-1/12 px-6 py-3">Asset Tag</th>
              <th scope="col" className="w-1/12 px-6 py-3">Serial #</th>
              <th scope="col" className="w-1/12 px-6 py-3">Status</th>
              <th scope="col" className="w-1/12 px-6 py-3">Brand</th>
              <th scope="col" className="w-1/12 px-6 py-3">Model</th>
              <th scope="col" className="w-1/12 px-6 py-3">Type</th>
              <th scope="col" className="w-1/12 px-6 py-3">Color</th>
              <th scope="col" className="w-1/12 px-6 py-3">Issued to</th>
              <th scope="col" className="w-1/12 px-6 py-3">Grant</th>
              <th scope="col" className="w-1/12 px-6 py-3">Charged</th>
              <th scope="col" className="w-1/12 px-6 py-3">Maintenance</th>
              <th scope="col" className="w-1/12 px-6 py-3">Loan</th>
              <th scope="col" className="w-2/12 px-6 py-3">Actions</th>
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
                  selectedTable="Laptops"
                />
              ) : (
                <tr key={row.id} className={index % 2 === 0 ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700" : "bg-white dark:bg-gray-800"}>
                  <th scope="row" className="w-1/12 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{row.assetTag}</th>
                  <td className="w-1/12 px-6 py-4">{row.serialNumber}</td>
                  <td className="w-1/12 px-6 py-4">{row.status}</td>
                  <td className="w-1/12 px-6 py-4">{row.brand}</td>
                  <td className="w-1/12 px-6 py-4">{row.model}</td>
                  <td className="w-1/12 px-6 py-4">{row.type}</td>
                  <td className="w-1/12 px-6 py-4">{row.color}</td>
                  <td className="w-1/12 px-6 py-4">{row.issuedTo}</td>
                  <td className="w-1/12 px-6 py-4">{row.grant}</td>
                  <td className="w-1/12 px-6 py-4">{row.chargedUpdated}</td>
                  <td className="w-1/12 px-4 py-4">
                    <button
                      onClick={() => viewMaintenance(row.id)}
                      className="bg-customOrange hover:bg-[#d6692a] text-white font-semibold py-2 px-4 rounded"
                    >
                      Maintenance
                    </button>
                  </td>
                  <td className="w-1/12 px-6 py-4">
                    <button
                      onClick={() => viewLoan(row.id)}
                      className="bg-customOrange hover:bg-[#d6692a] text-white font-semibold py-2 px-4 rounded"
                    >
                      Loan
                    </button>
                  </td>
                  <td className="w-2/12 px-6 py-4">
                    <button
                      onClick={() => editRow(row.id)}
                      className="bg-customBlue hover:bg-customBlueLight text-white font-semibold py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
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
}

export default LaptopTable;




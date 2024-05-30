import React, { useState } from 'react';
import EditForm from './EditForm';
import Modal from './Modal';
import Pagination from './Pagination'; 
const StudentTable = ({
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  const handleViewNotes = (notes) => {
    setNotesValue(notes);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
            <th className="w-1/4 px-6 py-3">Badge</th>
            <th className="w-1/4 px-6 py-3">Student Name</th>
            <th className="w-1/4 px-6 py-3">Location</th>
            <th className="w-1/4 px-6 py-3">Notes</th>
            <th className="w-1/4 px-6 py-3">Actions</th>
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
                selectedTable="Students"
              />
            ) : (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700" : "bg-white dark:bg-gray-800"}>
                <td className="w-1/4 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{row.badgeName}</td>
                <td className="w-1/4 px-6 py-4">{row.studentName}</td>
                <td className="w-1/4 px-6 py-4">{row.location}</td>
                <td className="w-1/4 px-6 py-4">{row.notes}</td>
                <td className="w-1/4 px-6 py-4">
                  <button
                    onClick={() => handleViewNotes(row.notes)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Notes
                  </button>
                  <button
                    onClick={() => editRow(row.id)}
                    className="bg-customBlue hover:bg-customBlueLight text-white font-bold py-2 px-4 rounded mx-2"
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
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Notes</h2>
            <p>{notesValue}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentTable;

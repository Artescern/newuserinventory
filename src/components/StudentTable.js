import React, { useState } from 'react';
import EditForm from './EditForm';
import Modal from './Modal';
import Pagination from './Pagination'; 
const StudentTable = ({
  tableRows,
  updateTableRows,
  editMode,
  selectedRow,
  handleInputChange,
  confirmEdit,
  editRow,
  deleteRow,
  currentId,
  setCurrentId,
  cancelEdit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [notesIdValue, setNotesIdValue] = useState('');
  const [notesNameValue, setNotesNameValue] = useState('');
  const [newNote, setNewNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  const handleViewNotes = (notes, id, name) => {
    setNotesValue(notes);
    setNotesIdValue(id);
    setNotesNameValue(name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNote = async () => {
    if (newNote.trim() === '') return;
    const response = await fetch(`http://localhost:8080/api/v1/students/appendNote/${notesIdValue}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: newNote
    });
    if (response.ok) {
      const updatedNotes = [...notesValue, newNote];
      setNotesValue(updatedNotes);
      updateTableRows(notesIdValue, updatedNotes);
      setNewNote('');
    }
  };

  const handleDeleteNote = async (noteIndex) => {
    const response = await fetch(`http://localhost:8080/api/v1/students/deleteNote/${notesIdValue }/${noteIndex}`, {
      method: 'PUT'
    });
    if (response.ok) {
      const updatedNotes = notesValue.filter((_, index) => index !== noteIndex);
      setNotesValue(updatedNotes);
      updateTableRows(notesIdValue, updatedNotes);
    }
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
                cancelEdit={cancelEdit}
              />
            ) : (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700" : "bg-white dark:bg-gray-800"}>
                <td className="w-1/4 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{row.badgeName}</td>
                <td className="w-1/4 px-6 py-4">{row.studentName}</td>
                <td className="w-1/4 px-6 py-4">{row.location}</td>
                <td className="w-1/4 px-6 py-4">{row.notes.length} Notes</td>
                <td className="w-1/4 px-6 py-4">
                  <button
                    onClick={() => handleViewNotes(row.notes, row.id, row.studentName)}
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
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}  onConfirm={handleAddNote}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Notes for {notesNameValue}</h2>
          <ul>
            {notesValue.map((note, index) => (
              <li key={index} className="mb-2 flex justify-between items-center">
                {note}
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </Modal>
      )}
    </div>
  );
};

export default StudentTable;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; 

const Loan = ({ id, viewLoan, tableRows }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [loanRows, setLoanRows] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [startInput, setStartInput] = useState(new Date().toISOString().split('T')[0]);
  const [endInput, setEndInput] = useState(new Date().toISOString().split('T')[0]);
  const [addNewMode, setAddNewMode] = useState(false);

  const index = tableRows.findIndex(row => row.id === id);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${apiUrl}/loans`);
      if (response && response.data) {
        const loanRowsWithIsoDates = response.data.map(loan => ({
          ...loan,
          startDate: new Date(loan.startDate).toISOString().split('T')[0],
          endDate: new Date(loan.endDate).toISOString().split('T')[0]
        }));
        setLoanRows(loanRowsWithIsoDates);
      } else {
        setLoanRows([]);
      }
    } catch (error) {
      console.error('Could not retrieve loans', error);
    }
  }

  const createNew = () => {
    setAddNewMode(!addNewMode);
  }

  const handleSubmit = async () => {
    const newRow = {
      name: nameInput,
      startDate: new Date(startInput).toISOString().split('T')[0],
      endDate: new Date(endInput).toISOString().split('T')[0]
    };
    try {
      await axios.post(`${apiUrl}/loans`, newRow);
      fetchData();
      setNameInput('');
      setStartInput(new Date().toISOString().split('T')[0]);
      setEndInput(new Date().toISOString().split('T')[0]);
      setAddNewMode(false);
    } catch (error) {
      console.error('Could not generate new loan', error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/loans/${id}`);
      fetchData();
    } catch (error) {
      console.error("Could not delete loan", error);
    }
  }

  return (
    <Modal
      id="loanModal"
      title="Loan Management"
      onClose={viewLoan}
      onConfirm={handleSubmit} 
    >
      <form className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Start Date:</label>
          <input
            type="date"
            value={startInput}
            onChange={(e) => setStartInput(e.target.value)}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">End Date:</label>
          <input
            type="date"
            value={endInput}
            onChange={(e) => setEndInput(e.target.value)}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </form>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-1/4 px-6 py-3">Name</th>
              <th scope="col" className="w-1/4 px-6 py-3">Start Date</th>
              <th scope="col" className="w-1/4 px-6 py-3">End Date</th>
              <th scope="col" className="w-1/4 px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loanRows.map((row) => (
              <tr key={row.id} className="bg-white dark:bg-gray-800">
                <td className="w-1/4 px-6 py-4">{row.name}</td>
                <td className="w-1/4 px-6 py-4">{row.startDate}</td>
                <td className="w-1/4 px-6 py-4">{row.endDate}</td>
                <td className="w-1/4 px-6 py-4">
                  <button className="secondary-button" onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export default Loan;

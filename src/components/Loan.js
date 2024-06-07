import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; 

const Loan = ({ id, viewLoan, tableRows, fetchTableData }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
    const [loanRows, setLoanRows] = useState([]);

    const [nameInput, setNameInput] = useState('');
    const [startInput, setStartInput] = useState(new Date().toISOString().split('T')[0]);
    const [endInput, setEndInput] = useState('');
    
    const [editNameInput, setEditNameInput] = useState('');
    const [editStartInput, setEditStartInput] = useState('');
    const [editEndInput, setEditEndInput] = useState('');

    const [addNewMode, setAddNewMode] = useState(false);
    const [selectedRow, setSelectedRow] = useState(0);
    const [editMode, setEditMode] = useState(false);

    //exception for when loan is out  
    const [currentlyLoaned, setCurrentlyLoaned] = useState(false);
    const [errorText, setErrorText] = useState('')
 
    const index = tableRows.findIndex(row => row.id === id);

  
    useEffect(() => {
      fetchData();
    }, [])

    async function fetchData() {
      try {
        let currentlyLoan = false;
        const response = await axios.get(`${apiUrl}/computers/${id}`);      
        const loanData = response.data.loans;
        console.log('fetcheddata')
        console.log(response.data);
        if(loanData.length === 0){
          setLoanRows([]);
          currentlyLoan= false;
          setCurrentlyLoaned(false);
        }
        else if (loanData) {
          const loanRowsWithIsoDates = loanData.map(loan => ({
            ...loan,
            startDate: new Date(loan.startDate).toISOString().split('T')[0],
            endDate: loan.endDate ? new Date(loan.endDate).toISOString().split('T')[0] : ''
          }));
          setLoanRows(loanRowsWithIsoDates);
          if(loanRowsWithIsoDates[loanRowsWithIsoDates.length -1].endDate === ""){
            currentlyLoan = true;
            setCurrentlyLoaned(true);
          }else{ 
            currentlyLoan= false;
            setCurrentlyLoaned(false);
            setErrorText("");
          }
        } else {
          setLoanRows([]);
        }
        //performs the update for if its loaned or not
        const newRow={...response.data, issuedTo: currentlyLoan ? loanData[loanData.length - 1].name : "N/A",
        status: currentlyLoan ? "Loaned" : "Available"};
        console.log(newRow);
        await axios.put(`${apiUrl}/computers/${id}`, newRow);
        fetchTableData();
      } catch (error) {
        console.error('Could not retrieve loans', error);
      }
    }

    const createNew = () => {
      setAddNewMode(!addNewMode);
    }
 
    const handleSubmit = (e) => {  
      e.preventDefault();
      const newRow = { name: nameInput, startDate: new Date(startInput).toISOString().split('T')[0], endDate: endInput !== "" ? new Date(endInput).toISOString().split('T')[0] : ""}
      create(newRow);
    }


    async function create(newRow) {
      if(currentlyLoaned){
        setErrorText("End previous loan to add new one");
      } else{
      try{
        setErrorText("");
        await axios.put(`${apiUrl}/loans/appendLoan/${id}`, newRow);  
        fetchData();
      } catch(error) {
        console.error('could not generate new loan')
      }} 
    }

    const handleEdit = (id) => {
      setEditMode(!editMode);
      setSelectedRow(id);
    }

    const handleEditSubmit = (mainId) => {
      const updatedRows = loanRows.map((row) => {
        const name = editNameInput === "" ? row.name : editNameInput;
        const formattedStartDate = editStartInput === "" ? row.startDate : new Date(editStartInput).toISOString().split('T')[0];
        const formattedEndDate = editEndInput === "" ? row.endDate : new Date(editEndInput).toISOString().split('T')[0];
        return row.id === selectedRow ? { ...row, name: name, startDate: formattedStartDate, endDate: formattedEndDate } : row;
      });
      const newRow = updatedRows.find((row) => row.id === selectedRow);
      async function edit() {
        try{
          await axios.put(`${apiUrl}/loans/appendLoan/${id}`, newRow); 
          setEditNameInput('');
          handleEdit(mainId);
          fetchData();
        } catch(error) {
          console.error('could not edit loan')
        } 
        }
      edit();
    }

    const handleDelete = (id) => {
      async function deleteLoan() {
        try{
          await axios.delete(`${apiUrl}/loans/${id}`)
          fetchData();
        } catch(error) {
          console.error("could not delete loan");
        }
      }
      deleteLoan();
    }
  return (
    <Modal
      id="loanModal"
      title="Loan Management"
      onClose={viewLoan}
      onConfirm={editMode? handleEditSubmit : handleSubmit}
      editMode={editMode}
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
              editMode && row.id == selectedRow ? (
                <tr key={row.id} className="bg-white dark:bg-gray-800">
                  <td className="w-1/4 pl-6 py-4"><input className="w-5/6" type="text" defaultValue={row.name} onChange={(e) => setEditNameInput(e.target.value)}></input></td>
                  <td className="w-1/4 pl-1 py-4"><input className="w-5/6"type="date" defaultValue={row.startDate} onChange={(e) => setEditStartInput(e.target.value)}></input></td>
                  <td className="w-1/4 pl-1 py-4"><input className="w-5/6"type="date" defaultValue={row.endDate} onChange={(e) => setEditEndInput(e.target.value)}></input></td>
                  <td className="w-1/4 pl-6 py-4"><button className="text-white bg-customBlue hover:bg-customBlueLight focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2" onClick={() => handleEditSubmit(row.id)}>Confirm</button></td>
                </tr>
              ) : (
              <tr key={row.id} className="bg-white dark:bg-gray-800">
                <td className="w-1/4 px-6 py-4">{row.name}</td>
                <td className="w-1/4 px-6 py-4">{row.startDate}</td>
                <td className="w-1/4 px-6 py-4">{row.endDate}</td>
                <td className="w-1/4 px-6 py-4">
                  <button className="ml-[-1rem] text-white bg-customBlue hover:bg-customBlueLight  focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2" onClick={() => handleEdit(row.id)}>Edit</button>
                  <button className="ml-1 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-2 rounded" onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>)
            ))}
          </tbody>
        </table>
        
      </div>
      <p className="color">{errorText}</p>
    </Modal>
  );
}

export default Loan;

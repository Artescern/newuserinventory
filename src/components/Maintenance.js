import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const Maintenance = ({ id, viewMaintenance, tableRows, cancelEdit }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
    const [maintenanceRows, setMaintenanceRows] = useState([]);    
    const [descriptionInput, setDescriptionInput] = useState('');
    const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
    const [editDescriptionInput, setEditDescriptionInput] = useState('');
    const [editDateInput, setEditDateInput] = useState(new Date().toISOString().split('T')[0]);
    const [addNewMode, setAddNewMode] = useState(false);
    const [selectedRow, setSelectedRow] = useState(0);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
      fetchData();
    }, []);

    async function fetchData() {
      try {
        const response = await axios.get(`${apiUrl}/computers/${id}`); 
        const mainData = response.data.maintenances;  
          if(Array.isArray(mainData) && mainData.length === 0){
            setMaintenanceRows([]);
          }else{
            const maintenanceRowsWithIsoDates = mainData.map(maintenance => ({
              ...maintenance,
              date: new Date(maintenance.date).toISOString().split('T')[0]
            }));
            setMaintenanceRows(maintenanceRowsWithIsoDates);
          }
      } catch (error) {
        console.error('Could not retrieve maintenances', error);
      }
    }

    const createNew = () => {
      setAddNewMode(!addNewMode);
    }  
    
    const handleSubmit = () => {
      const formattedDate = new Date(dateInput).toISOString().split('T')[0];
      const newRow = { description: descriptionInput, date: formattedDate}
      create(newRow);
    }

    async function create(newRow) {
      try{
        await axios.put(`${apiUrl}/maintenances/appendMaintenance/${id}`, newRow); 
        fetchData(); 
      } catch(error) {
        console.error('could not generate new maintenance')
      }  
    }
    const handleEdit = (id) => {
      setEditMode(!editMode);
      setSelectedRow(id);
    }

    const handleEditSubmit = (mainId) => {
      const formattedDate = new Date(editDateInput).toISOString().split('T')[0];
      const updatedRows = maintenanceRows.map((row) => {
        const desc = editDescriptionInput === "" ? row.description : editDescriptionInput;
        return row.id === selectedRow ? { ...row, description: desc, date: formattedDate } : row;
      });
      const newRow = updatedRows.find((row) => row.id === selectedRow);
      async function edit() {
        try{
          await axios.put(`${apiUrl}/maintenances/appendMaintenance/${id}`, newRow); 
          setEditDescriptionInput('');
          handleEdit(mainId);
          fetchData();
        } catch(error) {
          console.error('could not edit maintenance')
        } 
        }
        edit();
      }

    const handleDelete = (id) => {
        async function deleteMain() {
          try{
            await axios.delete(`${apiUrl}/maintenances/${id}`)
            fetchData();
          } catch(error) {
            console.error("could not delete maintenance");
          }
        }
      deleteMain();
    }
  return (
    <Modal
      id="maintenanceModal"
      title="Maintenance Management"
      onClose={viewMaintenance}
      onConfirm={editMode ? handleEditSubmit : handleSubmit}
      editMode={editMode}
    >
      <form className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <input
            type="text"
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </form>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" className="w-1/4 px-6 py-3">Description</th>
      <th scope="col" className="w-1/4 px-6 py-3">Date</th>
      <th scope="col" className="w-1/4 px-6 py-3">Actions</th>
    </tr>
  </thead>
  <tbody>
    {maintenanceRows.map((row) => (
      editMode && row.id == selectedRow ? (
        <tr key={row.id} className="bg-white dark:bg-gray-800">
          <td className="w-1/4 px-6 py-4"><input className="w-5/6" type="text" defaultValue={row.description} onChange={(e) => setEditDescriptionInput(e.target.value)}></input></td>
          <td className="w-1/4 px-6 py-4"><input className="w-5/6"type="date" defaultValue={row.date} onChange={(e) => setEditDateInput(e.target.value)}></input></td>
          <td className="w-1/4 px-6 py-4"><button className="text-white bg-customBlue hover:bg-customBlueLight focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2" onClick={() => handleEditSubmit(row.id)}>Confirm</button></td>
        </tr>
      ) : (
      <tr key={row.id} className="bg-white dark:bg-gray-800">
        <td className="w-1/4 px-6 py-4">{row.description}</td>
        <td className="w-1/4 px-6 py-4">{row.date}</td>
        <td className="w-1/4 px-6 py-4">
          <button className="ml-[-1rem] text-white bg-customBlue hover:bg-customBlueLight  focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2" onClick={() => handleEdit(row.id)}>Edit</button>
          <button className="ml-1 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-2 rounded" onClick={() => handleDelete(row.id)}>Delete</button>
        </td>
      </tr>
      )
    ))}
  </tbody>
</table>
</div>
    </Modal>
  );
}

export default Maintenance;
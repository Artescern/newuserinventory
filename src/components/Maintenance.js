import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const Maintenance = ({ id, viewMaintenance, tableRows }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [maintenanceRows, setMaintenanceRows] = useState([]);
  const index = tableRows.findIndex(row => row.id === id);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${apiUrl}/maintenances`);
      if (response && response.data) {
        const maintenanceRowsWithIsoDates = response.data.map(maintenance => ({
          ...maintenance,
          date: new Date(maintenance.date).toISOString().split('T')[0]
        }));
        setMaintenanceRows(maintenanceRowsWithIsoDates);
      } else {
        setMaintenanceRows([]);
      }
    } catch (error) {
      console.error('Could not retrieve maintenances', error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/maintenances/${id}`);
      fetchData();
    } catch (error) {
      console.error("Could not delete maintenance");
    }
  };

  const handleConfirm = async () => {
    const formattedDate = new Date(dateInput).toISOString().split('T')[0];
    const newRow = { item_id: id, description: descriptionInput, date: formattedDate };
    try {
      await axios.post(`${apiUrl}/maintenances`, newRow);
      fetchData();
      setDescriptionInput('');
      setDateInput(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Could not create maintenance', error);
    }
  };

  return (
    <Modal
      id="maintenanceModal"
      title="Maintenance Management"
      onClose={viewMaintenance}
      onConfirm={handleConfirm} 
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
      <tr key={row.id} className="bg-white dark:bg-gray-800">
        <td className="w-1/4 px-6 py-4">{row.description}</td>
        <td className="w-1/4 px-6 py-4">{row.date}</td>
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

export default Maintenance;
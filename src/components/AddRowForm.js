import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const AddRowForm = ({ fetchData, setAddRowMode, selectedTable }) => {
  const tableFields = {
    Computers: ["assetTag", "serialNumber", "brand", "model", "type", "color", "grantType", "chargedUpdated"],
    Students: ["badgeName", "studentName", "location", "notes"],
    Supplies: ["sku" , "quantityInStock", "unit", "buildingLocation", "floor", "lockerArea", "reorderLevel", "reoderQuantity", "leadTimeForReorder", "vendor", "estimatedCost" ]
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  const fields = tableFields[selectedTable] || [];
  const [newRowValues, setNewRowValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleInputChange = (field, value) => {
    setNewRowValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const newRow = { ...newRowValues, status: 'Available', issuedTo: 'N/A', chargedUpdated: newRowValues.chargedUpdated === undefined? 'Yes' : newRowValues.chargedUpdated };
    try {
      let response;
      if (selectedTable === "Computers") {
        response = await axios.post(`${apiUrl}/computers`, newRow);
      } else if (selectedTable === "Students") {
        response = await axios.post(`${apiUrl}/students`, newRow);
      } else {
        response = await axios.post(`${apiUrl}/supplies`, newRow);
      }
      const id = response.data.id;
      newRow.id = id;
      fetchData();
    } catch (error) {
      console.error('Something went wrong. Could not create.');
    }
    setAddRowMode(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          id="addRowModal"
          title="Add New Entry"
          onClose={closeModal}
          onConfirm={handleCreate} 
        >
          <form className="grid grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={index} className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}</label>
                {field === "chargedUpdated" ? (
                        <select  onChange={(e) => handleInputChange(field, e.target.value)}>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      ) : 
                      field ==="notes" ? 
                      <textarea onChange={(e) => handleInputChange(field, e.target.value)}></textarea> :
                      (
                <input
                  type={field === "quantityInStock" || 
                  field === "reorderLevel" || 
                  field === "reorderQuantity" || 
                  field ==="leadTimeForReorder" || 
                  field ==="estimatedCost" ? 'number' : 'text'}
                  id={field}
                  name={field}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder="Type here"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />)}
              </div>
            ))}
          </form>
        </Modal>
      )}
    </>
  );
}

export default AddRowForm;

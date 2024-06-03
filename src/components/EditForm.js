import React from 'react';
import Modal from './Modal';

const EditForm = ({ row, handleInputChange, confirmEdit, selectedTable, cancelEdit }) => {
  const tableFields = {
    Laptops: ["assetTag", "serialNumber", "status", "brand", "model", "type", "color", "issuedTo", "grantType", "chargedUpdated"],
    Students: ["badge", "studentName", "location"],
    Supplies: ["sku", "quantityInStock", "unit", "buildingLocation", "floor", "lockerArea", "reorderLevel", "reorderQuantity", "leadTimeForReorder", "vendor", "estimatedCost"]
  };

  const fields = tableFields[selectedTable] || [];

  return (
    <Modal
      id="editRowModal"
      title="Edit Row"
      onClose={cancelEdit}
      onConfirm={confirmEdit}
    >
      <form className="grid grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index} className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}</label>
            {field === "chargedUpdated" ? 
              <select defaultValue={row[field]} onChange={(e) => handleInputChange(field, e.target.value)}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select> :
              <input
              type={field === "quantityInStock" || 
                          field === "reorderLevel" || 
                          field === "reorderQuantity" || 
                          field ==="leadTimeForReorder" || 
                          field ==="estimatedCost" ? 'number' : 'text'}
              id={field}
              name={field}
              onChange={(e) => handleInputChange(field, e.target.value)}
              defaultValue={row[field]}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
              }
          </div>
        ))}
      </form>
    </Modal>
  );
};

export default EditForm;

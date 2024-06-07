import React from 'react';
import Modal from './Modal';

const ConfirmDelete = ({ setDeleteYes, setConfirmDelete }) => {
  const confirmDelete = () => {
    setDeleteYes(true);
    setConfirmDelete(false);
  };

  return (
    <Modal
      id="confirmDeleteModal"
      title="Confirm Deletion"
      onClose={() => setConfirmDelete(false)} 
      onConfirm={confirmDelete} 
      editMode={true}
    >
      <div>
        <h1 className="text-center my-4 text-xl font-bold">Are you sure you want to delete?</h1>

      </div>
    </Modal>
  );
};

export default ConfirmDelete;

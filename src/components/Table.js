import React, { useEffect, useState } from "react";
import axios from "axios";
import AddRowForm from "./AddRowForm";
import LaptopTable from "./LaptopTable";
import StudentTable from "./StudentTable";
import InventorySearch from "./InventorySearch";
import SupplyTable from "./SupplyTable";
import ConfirmDelete from "./ConfirmDelete";
import EditForm from "./EditForm";
import Modal from "./Modal"; 

const Table = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [editedRowValues, setEditedRowValues] = useState({});
  const [addRowMode, setAddRowMode] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [savedTableRows, setSavedTableRows] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [selectedTable, setSelectedTable] = useState("Computers");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteYes, setDeleteYes] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!editMode) {
      setEditedRowValues({});
    }
  }, [editMode]);

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  useEffect(() => {
    if (deleteYes === true && rowToDelete !== null) {
      handleDelete(rowToDelete);
      setConfirmDelete(false);
      setDeleteYes(false);
    }
  }, [deleteYes, rowToDelete]);

  const addNewRow = () => {
    setAddRowMode(!addRowMode);
  };

  const handleInputChange = (field, value) => {
    setEditedRowValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleConfirmEdit = () => {
    confirmEdit();
    closeEditModal();
  };

  const confirmEdit = () => {
    const updatedRows = tableRows.map((row) =>
      row.id === selectedRow ? { ...row, ...editedRowValues } : row
    );
    console.log(updatedRows);
    async function update() {
      try {
        const newRow = updatedRows.find((row) => row.id === selectedRow);
        await axios.put(`${apiUrl}/${selectedTable.toLowerCase()}/${selectedRow}`, newRow);
        fetchData();
      } catch (error) {
        console.error("something went wrong could not update");
      }
    }
    update();
    setEditMode(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/${selectedTable.toLowerCase()}`);
      setTableRows(response.data ? response.data : []);
      setSavedTableRows(response.data ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateTableRows = (studentId, notes) => {
    setTableRows(prevRows => 
      prevRows.map(row => 
        row.id === studentId ? { ...row, notes } : row
      )
    );
  };

  const editRow = (id) => {
    setSelectedRow(id);
    setEditMode(true);
    openEditModal();
  };

  const deleteRow = (id) => {
    setRowToDelete(id); 
    setConfirmDelete(true); 
  };

  async function handleDelete(id) {
    try {
      await axios.delete(`${apiUrl}/${selectedTable.toLowerCase()}/${id}`);
      fetchData();
    } catch (error) {
      console.error("something went wrong could not delete");
    }
  }

  const changeDisplayedTable = (e) => {
    setSelectedTable(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {confirmDelete && <ConfirmDelete setDeleteYes={setDeleteYes} setConfirmDelete={setConfirmDelete} />}
      <div>
        <label style={{ fontSize: "1.5rem" }}>View: </label>
        <select onChange={changeDisplayedTable} className="mx-2 px-2 py-1 border border-gray-300 rounded-md">
          <option value="Computers">Computers</option>
          <option value="Students">Students</option>
          <option value="Supplies">Supplies</option>
        </select>
        <button type="submit" className="bg-customBlue hover:bg-customBlueLight text-white font-bold py-2 px-4 rounded" onClick={addNewRow}>
          Add New
        </button>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <InventorySearch tableRows={tableRows} setTableRows={setTableRows} selectedTable={selectedTable} savedTableRows={savedTableRows}/>
        <div></div>
      </div>
      {addRowMode && (
        <AddRowForm
          fetchData={fetchData}
          setTableRows={setTableRows}
          setAddRowMode={setAddRowMode}
          addNewRow={addNewRow}
          selectedTable={selectedTable}
         
        />
      )}
      {selectedTable === "Computers" ? 
        <LaptopTable
          tableRows={tableRows}
          editMode={editMode}
          selectedRow={selectedRow}
          handleInputChange={handleInputChange}
          confirmEdit={confirmEdit}
          editRow={editRow}
          deleteRow={deleteRow}
          currentId={currentId}
          setCurrentId={setCurrentId}
          fetchData={fetchData}
        /> :
        selectedTable === "Students" ? 
        <StudentTable
          tableRows={tableRows}
          updateTableRows={updateTableRows}
          editMode={editMode}
          selectedRow={selectedRow}
          handleInputChange={handleInputChange}
          confirmEdit={confirmEdit}
          editRow={editRow}
          deleteRow={deleteRow}
          currentId={currentId}
          setCurrentId={setCurrentId}
        /> : 
          <SupplyTable 
            tableRows={tableRows}
            editMode={editMode}
            selectedRow={selectedRow}
            handleInputChange={handleInputChange}
            confirmEdit={confirmEdit}
            editRow={editRow}
            deleteRow={deleteRow}
            currentId={currentId}
            setCurrentId={setCurrentId}
          />
      } 
    </div>
  );
};

export default Table;

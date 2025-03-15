import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const UserTable = ({ records, showModal, handleClose }) => {
    
  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Records List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>UUID</th>
            </tr>
          </thead>
          <tbody>
        {records && records.length > 0 ? (
            records.map((record, index) => (
            <tr key={index}>
                <td>{record[1]}</td>
                <td>{record[2]}</td>
                <td>{record[0]}</td>
            </tr>
            ))
        ) : (
        <tr>
        <td colSpan="3">No data available</td>
        </tr>
    )}
</tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserTable;

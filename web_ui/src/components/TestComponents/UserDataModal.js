import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const renderNestedData = (data) => {
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{renderNestedData(item)}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <div style={{ marginLeft: '1rem' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {renderNestedData(value)}
            </div>
          ))}
        </div>
      );
    }
  }
  return data === null ? 'null' : data.toString();
};

const UserDataModal = ({ data, onClose }) => {
  return (
    <Modal show={!!data} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data ? (
          <div>{renderNestedData(data)}</div>
        ) : (
          <p>Invalid Response</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDataModal;

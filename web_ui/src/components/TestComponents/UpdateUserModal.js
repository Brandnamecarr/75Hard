import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const UpdateUserModal = ({ isOpen, onClose, uuids }) => {
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUuidClick = (uuid) => {
    setSelectedUuid(uuid);
    setEmail('');  // Reset email and password when selecting a new UUID
    setPassword('');
  };

  const handleSubmit = () => {
    // Handle submission of email and password
    console.log('Submitted:', { uuid: selectedUuid, email, password });
    // Close the modal or perform other actions
    let data = {
        'uuid': selectedUuid,
        'email': email,
        'password': password
    };
    onClose(data);
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Records List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {uuids && uuids.length > 0 ? (
              uuids.map((uuid, index) => (
                <tr key={index} onClick={() => handleUuidClick(uuid)}>
                  <td>{uuid}</td>
                  <td colSpan="2">
                    {selectedUuid === uuid && (
                      <div>
                        <input
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">UUID length is 0</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {selectedUuid && (
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateUserModal;

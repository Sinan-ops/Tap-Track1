import React from 'react';
import '../styles/Users.css';

function Users() {
  return (
    <div className="users-container">
      <h1>User Management</h1>
      
      <button className="btn btn-primary">+ Add New User</button>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Employee</td>
            <td>Engineering</td>
            <td><span className="status active">Active</span></td>
            <td>
              <button className="btn-small">Edit</button>
              <button className="btn-small">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Users;

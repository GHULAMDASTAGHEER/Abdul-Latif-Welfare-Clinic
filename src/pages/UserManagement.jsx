import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, updateUser, deleteUser } from "../redux/slices/authSlice";
import "../css/UserManagement.css";

export default function UserManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(state => state.auth.users);
  const currentUser = useSelector(state => state.auth.user);
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "staff"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      dispatch(updateUser({ ...formData, id: editingUser.id }));
    } else {
      dispatch(addUser({ ...formData, id: Date.now() }));
    }
    setShowModal(false);
    setEditingUser(null);
    setFormData({ username: "", password: "", fullName: "", role: "staff" });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: user.password, fullName: user.fullName, role: user.role });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="user-management-container">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage system users and permissions</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowModal(true)} className="btn-primary">Add User</button>
          <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                <td>
                  <button onClick={() => handleEdit(user)} className="btn-edit">Edit</button>
                  {user.id !== currentUser?.id && (
                    <button onClick={() => handleDelete(user.id)} className="btn-delete">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


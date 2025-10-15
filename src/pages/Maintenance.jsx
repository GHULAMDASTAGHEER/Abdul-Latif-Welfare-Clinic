import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBrand, deleteBrand } from "../redux/slices/inventorySlice";
import "../css/Maintenance.css";

export default function Maintenance() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const brands = useSelector(state => state.inventory.brands);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "medicine",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBrand({ ...formData, id: Date.now() }));
    setShowModal(false);
    setFormData({ name: "", type: "medicine", description: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      dispatch(deleteBrand(id));
    }
  };

  const medicineBrands = brands.filter(b => b.type === 'medicine');
  const labTestBrands = brands.filter(b => b.type === 'lab_test');

  return (
    <div className="maintenance-container">
      <div className="page-header">
        <div>
          <h1>Maintenance</h1>
          <p>Manage item brands and categories</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowModal(true)} className="btn-primary">Add Brand</button>
          <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
        </div>
      </div>

      <div className="brands-sections">
        <div className="brand-section">
          <h2>Medicine Brands</h2>
          <div className="brands-grid">
            {medicineBrands.map(brand => (
              <div key={brand.id} className="brand-card">
                <div className="brand-header">
                  <h3>{brand.name}</h3>
                  <button onClick={() => handleDelete(brand.id)} className="btn-delete-small">×</button>
                </div>
                {brand.description && <p>{brand.description}</p>}
              </div>
            ))}
            {medicineBrands.length === 0 && (
              <div className="empty-state-small">No medicine brands added yet</div>
            )}
          </div>
        </div>

        <div className="brand-section">
          <h2>Lab Test Brands</h2>
          <div className="brands-grid">
            {labTestBrands.map(brand => (
              <div key={brand.id} className="brand-card">
                <div className="brand-header">
                  <h3>{brand.name}</h3>
                  <button onClick={() => handleDelete(brand.id)} className="btn-delete-small">×</button>
                </div>
                {brand.description && <p>{brand.description}</p>}
              </div>
            ))}
            {labTestBrands.length === 0 && (
              <div className="empty-state-small">No lab test brands added yet</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Brand</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="medicine">Medicine Brand</option>
                  <option value="lab_test">Lab Test Brand</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Optional description..."
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save Brand</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


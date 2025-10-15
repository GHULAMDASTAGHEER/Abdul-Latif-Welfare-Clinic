import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem, updateItem, deleteItem } from "../redux/slices/inventorySlice";
import "../css/Inventory.css";

export default function Inventory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(state => state.inventory.items);
  const brands = useSelector(state => state.inventory.brands);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "medicine",
    brand: "",
    price: "",
    purchasePrice: "",
    stock: 0,
    unit: "piece",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateItem({ ...formData, id: editingItem.id }));
    } else {
      dispatch(addItem({ ...formData, id: Date.now() }));
    }
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: "", type: "medicine", brand: "", price: "", purchasePrice: "", stock: 0, unit: "piece", description: ""
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteItem(id));
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Manage medicines, lab tests, and supplies</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowModal(true)} className="btn-primary">Add Item</button>
          <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-header">
              <span className={`item-type ${item.type}`}>{item.type}</span>
              <span className={`stock-badge ${item.stock < 10 ? 'low' : ''}`}>
                Stock: {item.stock} {item.unit}
              </span>
            </div>
            <h3>{item.name}</h3>
            <p className="item-brand">{item.brand}</p>
            <div className="item-prices">
              <div>
                <small>Purchase Price</small>
                <div className="price">Rs. {item.purchasePrice}</div>
              </div>
              <div>
                <small>Sale Price</small>
                <div className="price">Rs. {item.price}</div>
              </div>
            </div>
            {item.description && <p className="item-desc">{item.description}</p>}
            <div className="item-actions">
              <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <p>No items found. Add your first item to get started.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name</label>
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
                    <option value="medicine">Medicine</option>
                    <option value="lab_test">Lab Test</option>
                    <option value="supply">Medical Supply</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="piece">Piece</option>
                    <option value="box">Box</option>
                    <option value="bottle">Bottle</option>
                    <option value="strip">Strip</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
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


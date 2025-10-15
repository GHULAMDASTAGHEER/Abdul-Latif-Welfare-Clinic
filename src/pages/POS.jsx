import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSaleInvoice } from "../redux/slices/salesSlice";
import { updateStock } from "../redux/slices/inventorySlice";
import "../css/POS.css";

export default function POS() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(state => state.inventory.items);
  
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(c => c.id !== id));
    } else {
      setCart(cart.map(c => c.id === id ? { ...c, quantity } : c));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const invoice = {
      id: Date.now(),
      invoiceNo: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      customerName: customerName || "Walk-in Customer",
      customerPhone,
      items: cart,
      total: calculateTotal(),
      type: "sale"
    };

    dispatch(addSaleInvoice(invoice));
    
    cart.forEach(item => {
      dispatch(updateStock({ id: item.id, quantity: -item.quantity }));
    });

    alert("Sale completed successfully!");
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
  };

  return (
    <div className="pos-container">
      <div className="pos-header">
        <h1>Point of Sale</h1>
        <button onClick={() => navigate("/dashboard")} className="btn-back">Back to Dashboard</button>
      </div>

      <div className="pos-layout">
        <div className="pos-left">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="items-list">
            {filteredItems.map(item => (
              <div key={item.id} className="pos-item" onClick={() => addToCart(item)}>
                <div className="pos-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.brand}</p>
                </div>
                <div className="pos-item-price">
                  <div className="price">Rs. {item.price}</div>
                  <div className="stock">Stock: {item.stock}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pos-right">
          <div className="customer-section">
            <h3>Customer Details</h3>
            <input
              type="text"
              placeholder="Customer Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="customer-input"
            />
            <input
              type="text"
              placeholder="Phone Number (Optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="customer-input"
            />
          </div>

          <div className="cart-section">
            <h3>Cart Items ({cart.length})</h3>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>Rs. {item.price} x {item.quantity}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.id)} className="btn-remove">×</button>
                  </div>
                  <div className="cart-item-total">Rs. {item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            {cart.length === 0 && (
              <div className="empty-cart">Cart is empty</div>
            )}
          </div>

          <div className="checkout-section">
            <div className="total-section">
              <span>Total Amount:</span>
              <span className="total-amount">Rs. {calculateTotal().toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-checkout">Complete Sale</button>
          </div>
        </div>
      </div>
    </div>
  );
}


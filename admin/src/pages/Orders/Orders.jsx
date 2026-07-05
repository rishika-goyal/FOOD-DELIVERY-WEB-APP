import React from 'react';
import "./Orders.css";
import { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from 'react';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  // Update status LOCALLY only (no API call yet)
  const handleStatusChange = (event, orderId) => {
    const newStatus = event.target.value;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Called only when admin clicks "Save"
  const saveStatus = async (orderId, status) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status
    });
    if (response.data.success) {
      toast.success("Status updated");
    } else {
      toast.error("Failed to update status");
    }
  };

  // Returns a color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Food Processing":
        return "orange";
      case "Out for delivery":
        return "#3b82f6"; // blue
      case "Delivered":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='oder-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.street + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>

            <div className='order-status-control'>
              <div className='status-indicator'>
                <span
                  className='status-dot'
                  style={{ backgroundColor: getStatusColor(order.status) }}
                ></span>
                <select
                  onChange={(event) => handleStatusChange(event, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <button
                className='save-status-btn'
                onClick={() => saveStatus(order._id, order.status)}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
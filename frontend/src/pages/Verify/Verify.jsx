import React, { useContext, useEffect } from 'react';
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from 'react-toastify';

const Verify = () => {

  const [searchParams, setSearchParams]=useSearchParams();
  const success=searchParams.get("success")
  const orderId=searchParams.get("orderId")
  console.log(success, orderId);
  const {url}=useContext(StoreContext);
  const navigate=useNavigate();

  const verifyPayment=async ()=>{
    const response=await axios.post(url+"/api/order/verify", {success, orderId});
    if(response.data.success){
      toast.success("Order placed successfully!");
      navigate("/myorders");
    }else{
      toast.error("Payment failed. Please try again.");
      navigate("/")
    }
  }
  useEffect(()=>{
    if(success && orderId){
      verifyPayment();
    }
  },[success, orderId])

  return (
    <div className='verify'>
      <div className='spinner'></div>
    </div>
  )
}

export default Verify

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext=createContext(null);

const StoreContextProvider = (props) =>{
  const url="http://localhost:4000";
  
  const [cartItems, setCartItems]=useState({});
  const [token, setToken]=useState("");
  const [food_list, setFoodList]=useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchFoodList = async()=>{
    try {
      const response=await axios.get(url+ "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.log("Error fetching food list:", error);
    }
  }
  // useEffect(() => {
  //   fetchFoodList();
  // }, []);
  // useEffect(()=>{
  //   async function loadData(){
  //     await fetchFoodList();
  //     if(localStorage.getItem("token")){
  //       setToken(localStorage.getItem("token"));
  //       await loadCartData(localStorage.getItem("token"))
  //     }
  //   }
  //   loadData();
  // },[])
  useEffect(() => {
  async function loadData() {
    await fetchFoodList();

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      await loadCartData(storedToken);
    }
  }

  loadData();
}, []);

  const addToCart = async (itemId) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token);

  if (!token) {
    console.log("User not logged in");
    return;
  }

  await axios.post(
    url + "/api/cart/add",
    { itemId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  // 🔥 UPDATE STATE
  setCartItems((prev) => ({
    ...prev,
    [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
  }));
};

  const removeFromCart = async (itemId) => {
  console.log(itemId); 
  try {
    const response = await axios.post(
      url + "/api/cart/remove",
      { itemId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }})
      
       // 🔥 UPDATE STATE
  setCartItems((prev) => ({
  ...prev,
  [itemId]: prev[itemId] > 1 ? prev[itemId] - 1 : 0
}));
    

    console.log(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};
  const getTotalCartAmount=()=>{
    let totalAmount=0;
    for(const item in cartItems){
      if(cartItems[item]>0){
        let itemInfo=food_list.find((product)=>product._id ==item);
        totalAmount+=itemInfo.price*cartItems[item];
      }
    }
    return totalAmount;
  }

  // const loadCartData=async(token)=>{
  //   const response=await axios.post(url+"/api/cart/get", {}, {headers:{token}})
  //   setCartItems(response.data.cartData);
  // }
  const loadCartData = async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setCartItems(response.data.cartData);
  } catch (error) {
    console.log("CART ERROR:", error.response?.data || error.message);
  }
};
  const contextValue ={
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}
export default StoreContextProvider;
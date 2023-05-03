import React, { useEffect, useContext, useState, useCallback } from "react";
import { uc } from "./UserContext";
import Order from "./Order";
import { OrdersService, ProductsService } from "./Service";


function Dashboard() {
  let [orders, setOrders] = useState([]);
  let [showOrderDeletedAlert, setShowOrderDeletedAlert] = useState(false);
  let [showOrderPlacedAlert, setShowOrderPlacedAlert] = useState(false);

  
  //get context
  let ur = useContext(uc);

    //load data from database

    const loadDataFromDatabase = useCallback(
      async () => {
        let ordersResponse = await fetch(
          `http://localhost:5500/orders?userid=${ur.user.currentUserId}`,
          { method: "GET" }
        );
  
        if (ordersResponse.ok) {
          //status code is 200
          let ordersResponseBody = await ordersResponse.json();
  
          //get all data from products
          let productsResponse = await ProductsService.fetchProducts();
          if (productsResponse.ok) {
            let productsResponseBody = await productsResponse.json();
  
            //read all orders data
            ordersResponseBody.forEach((order) => {
              order.product = ProductsService.getProductByProductId(
                productsResponseBody,
                order.productId
              );
            });
  
            console.log(ordersResponseBody);
  
            setOrders(ordersResponseBody);
          }
        }
      
    }, [ur.user.currentUserId]
    )

    useEffect(() => {
      document.title = "Dashboard - eCommerce";
  
      loadDataFromDatabase();
    }, [ur.user.currentUserId, loadDataFromDatabase]);

     //When the user clicks on Buy Now
     let onBuyNowClick = useCallback(async(orderId,userId,productId,quantity)=>{

      if(window.confirm("Do you want to place order for this product?")){
let updateOrder = {
  id : orderId,
  productId:productId,
  userId:userId,
  quantity:quantity,
  isPaymentCompleted: true
}
let ordersResponse= await fetch( `http://localhost:5500/orders/${orderId}`,{
  method:"PUT",
  body: JSON.stringify(updateOrder),
  headers: { "Content-type": "application/json" },
})
let ordersResponseBody = await ordersResponse.json()
if(ordersResponse.ok){
  console.log(ordersResponseBody);
  loadDataFromDatabase()
  setShowOrderPlacedAlert(true);
}

      }
     },[loadDataFromDatabase])

       //When the user clicks on Delete button
       let onDeleteClick = useCallback(async(orderId)=>{
if(window.confirm("Are you sure to delete this item from cart?")){
  let ordersResponse= await fetch( `http://localhost:5500/orders/${orderId}`,{method:"DELETE"})
  if(ordersResponse.ok){
    let orderResponseBody = await ordersResponse.json();
    console.log(orderResponseBody);
   
    setShowOrderDeletedAlert(true);
    loadDataFromDatabase();
  }
}



       },[loadDataFromDatabase])

  return (
    <div className="row">
      <div className="col-12 py-3 header">
        <h4 style = {{display:"inline"}}>
          <i className="fa fa-dashboard"></i> Dashboard{" "}
      
        </h4>
        <button className="btn btn-md btn-info" onClick={loadDataFromDatabase}>
        <i className="fa fa-refresh"></i> Refresh</button>
      </div>

      <div className="col-12">
        <div className="row">
          {/* previous orders starts*/}
          <div className="col-lg-6">
            <h4 className="py-2 my-2 text-info border-bottom border-info">
              <i className="fa fa-history"></i> Previous Orders{" "}
              <span className="badge badge-info">
                {OrdersService.getPreviousOrders(orders).length}
              </span>
            </h4>

            {OrdersService.getPreviousOrders(orders).length === 0 ? (
              <div className="text-danger">No Orders</div>
            ) : (
              ""
            )}

            {OrdersService.getPreviousOrders(orders).map((ord) => {
              return (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  userId={ord.userId}
                  isPaymentCompleted={ord.isPaymentCompleted}
                  quantity={ord.quantity}
                  productName={ord.product.productName}
                  price={ord.product.price}
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
                
                />
              );
            })}
          </div>
          {/* previous orders ends*/}

          {/* cart starts*/}
          <div className="col-lg-6">
            <h4 className="py-2 my-2 text-primary border-bottom border-primary">
              <i className="fa fa-shopping-cart"></i> Cart{" "}
              <span className="badge badge-primary">
                {OrdersService.getCart(orders).length}
              </span>
            </h4>

            {/* {
              showOrderPlacedAlert ? (
                <div className="col-12">

<div class="alert alert-success alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong>   You Order has been placed.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

  
              </div>
              ):("")
            } */}

{/* {showOrderDeletedAlert ? (
              <div className="col-12">
               <div class="alert alert-danger alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong>   Your Order has been removed.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
              </div>
            ) : (
              ""
            )} */}

            {OrdersService.getCart(orders).length === 0 ? (
              <div className="text-danger">No products in your cart</div>
            ) : (
              ""
            )}

            {OrdersService.getCart(orders).map((ord) => {
              return (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  userId={ord.userId}
                  isPaymentCompleted={ord.isPaymentCompleted}
                  quantity={ord.quantity}
                  productName={ord.product.productName}
                  price={ord.product.price}
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
                
                />
              );
            })}
          </div>
          {/* cart ends*/}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
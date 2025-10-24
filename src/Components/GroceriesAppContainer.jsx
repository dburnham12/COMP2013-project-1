import { useState } from "react";
import CartContainer from "./CartContainer";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";

// Contains all logic for the application and manages states, all functions to be used are written here
export default function GroceriesAppContainer({ products }) {
    // State used to store product quantities for all products in the list of products
    const [productQuantities, setProductQuantities] = useState(
        products.map((prod) => {
            return {
                id: prod.id,
                quantity: 0,
            };
        })
    );

    // State used to store all cart items for all products currently in the cart
    const [cartItems, setCartItems] = useState([]);
    // State used to store the current cart total
    const [cartTotal, setCartTotal] = useState(0);

    // Function used to calculate the item total based off of quantity and price
    const calculateItemTotal = (price, quantity) => {
        // Use replace to remove the $ and multiply by quantity
        return price.replace("$", "") * quantity;
    };

    // Function used to calculate the cart total based off of the items currently in the cart
    const calculateCartTotal = (newCartItems) => {
        // Use reduce to add up all item totals
        return newCartItems.reduce((total, item) => total + item.total, 0);
    };

    // Function used to update the quantity of items either in cart card or product card
    const updateQuantity = (id, increment, mode) => {
        // 0 is the mode to add to item total
        if (mode === 0) {
            // Use map to cycle through each item in product quantites and update them
            const newQuantities = productQuantities.map((prodQuantity) => {
                // Once we find the item that we are adding to
                if (prodQuantity.id === id) {
                    // Add one to the current quantity
                    let newQuantity = prodQuantity.quantity + increment;
                    // Check if the quantity is within range, if not assign it to 0 as it cannot be negative
                    newQuantity = newQuantity > 0 ? newQuantity : 0;
                    // Update the item quantity for the specified item
                    prodQuantity = { ...prodQuantity, quantity: newQuantity };
                }
                // Return the item with either its original quantity or an updated on based off of wether or not it
                // matches our found id
                return prodQuantity;
            });
            // Update item quantites to our newly mapped array
            setProductQuantities(newQuantities);
        }
        // Any other number will handle adding to the cart total
        else {
            let removeItem = false;
            // Use map to cycle through each item in cart items and update them
            const newCartItems = cartItems.map((item) => {
                // If we have found our item to be updated
                if (item.id === id) {
                    // Set up a new value and increment by either + or - 1 (increment)
                    let newQuantity = item.quantity + increment;
                    // https://stackoverflow.com/questions/9334636/how-to-create-a-dialog-with-ok-and-cancel-options
                    // Used this article to set up an alert with Ok Cancel dialogue allowing the user to select their
                    // option as to wether or not the item should be removed.
                    // Check if our quantity is equal to 0 and if the user selects the option to remove from cart
                    if (
                        newQuantity === 0 &&
                        confirm(`Quantity reduced to 0 would you like to remove ${item.productName} from the cart?`)
                    ) {
                        // if selected set our removeItem flag to true
                        removeItem = true;
                    } else {
                        // otherwise update the quantity to the new quantity or 1 if less than 1
                        newQuantity = newQuantity > 1 ? newQuantity : 1;
                    }
                    // Update the item total based off of the new quantity
                    const newTotal = calculateItemTotal(item.price, newQuantity);
                    // Assign new quantity and total for the item
                    item = { ...item, quantity: newQuantity, total: newTotal };
                }
                // Return the item with either its original quantity or an updated on based off of wether or not it
                // matches our found id
                return item;
            });

            // If we are to remove the item then call removeItemFromCart function to do so
            if (removeItem) removeItemFromCart(id);
            // Update cart items to our newly mapped array and update cart total
            else {
                setCartTotal(calculateCartTotal(newCartItems));
                setCartItems(newCartItems);
            }
        }
    };

    // Function to add an item to the cart
    const addItemToCart = (newItem) => {
        // If our item quantity is 0 dont add the item and display an alert
        if (newItem.quantity === 0) {
            alert(`Trying to add: ${newItem.productName} \nNumber of items cannot be 0`);
            return;
        }

        // If the quantity is greater than 0 we must update cart items
        // Check if the new item already exists in the array
        const foundCartItem = cartItems.find((cartItem) => cartItem.id === newItem.id);
        let newCartItems = [];
        // If the new item exists in the array of cart items
        if (foundCartItem) {
            // Update the current list of cart items by mapping over it
            newCartItems = cartItems.map((cartItem) => {
                // Check if the cart items id matches the new items id
                if (cartItem.id === newItem.id) {
                    // If it does add the quantity to the cart items quantity
                    const newQuantity = cartItem.quantity + newItem.quantity;
                    // Set up the total based off quantity and price
                    const newTotal = calculateItemTotal(cartItem.price, newQuantity);
                    // Update the quantity and price to the new values
                    return { ...cartItem, quantity: newQuantity, total: newTotal };
                }
                // Return either the updated or non updated cart item based off of if it is the one that we are
                // currently checking for
                return cartItem;
            });
        }
        // If the new item does not yet exist in the cart
        else {
            // Calculate the new total based off price and quantity
            const newTotal = calculateItemTotal(newItem.price, newItem.quantity);
            // Add the new item to the array of cart items
            newCartItems = [{ ...newItem, total: newTotal }, ...cartItems];
        }
        // Update cart total based off of our new item
        setCartTotal(calculateCartTotal(newCartItems));
        // Update cart items to be our updated array
        setCartItems(newCartItems);
    };

    // Function to remove an item from the cart
    const removeItemFromCart = (id) => {
        // Filter the items to only include items without a specified id
        const newCartItems = cartItems.filter((cartItem) => cartItem.id !== id);
        // Update cart total based of of the newly removed item
        setCartTotal(calculateCartTotal(newCartItems));
        // Update the cart items based off of the newly removed item
        setCartItems(newCartItems);
    };

    // Function to clear our the cart
    const emptyCart = () => {
        // Set the cart items to an empty array
        setCartItems([]);
        // Set the cart total back to 0
        setCartTotal(0);
    };

    return (
        <>
            {/* Set up the NavBar */}
            <NavBar cartCount={cartItems.length} />
            <div className="GroceriesApp-Container">
                {/* Set up the ProductsContainer */}
                <ProductsContainer
                    products={products}
                    productQuantities={productQuantities}
                    addItemToCart={addItemToCart}
                    updateQuantity={updateQuantity}
                />
                {/* Set up the CartContainer */}
                <CartContainer
                    cartItems={cartItems}
                    cartTotal={cartTotal}
                    emptyCart={emptyCart}
                    removeItemFromCart={removeItemFromCart}
                    updateQuantity={updateQuantity}
                />
            </div>
        </>
    );
}

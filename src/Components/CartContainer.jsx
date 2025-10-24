import CartCard from "./CartCard";

// Wrapper for all cart items within the cart, also displays the Empty Cart and checkout buttons when active
export default function CartContainer({ cartItems, cartTotal, emptyCart, removeItemFromCart, updateQuantity }) {
    return (
        <div className="CartContainer">
            {/* Dipslay the number of cart items in the cart */}
            <h3>Cart Items: {cartItems.length}</h3>
            {/* Conditional rendering, if our cart has items show them, otherwise show a message notifying that
            there are no items currently in the cart */}
            {cartItems.length > 0 ? (
                <>
                    {/* Map cart items and display a cart card for each individual item */}
                    {cartItems.map((cartItem) => (
                        <CartCard
                            key={cartItem.id}
                            {...cartItem}
                            removeItemFromCart={removeItemFromCart}
                            updateQuantity={updateQuantity}
                        />
                    ))}
                    {/* Display the empty cart and checkout buttons */}
                    <div className="CartListBtns">
                        <button className="RemoveButton" onClick={emptyCart}>
                            Empty Cart
                        </button>
                        <button id="BuyButton">
                            Checkout <br />${cartTotal.toFixed(2)}
                        </button>
                    </div>
                </>
            ) : (
                <h5>No Items In Cart</h5>
            )}
        </div>
    );
}

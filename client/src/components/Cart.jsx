import React from 'react';
const Cart = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <h2>Cart Items: {count}</h2>
            <button onClick={() => setCount(count + 1)}>Add Item</button>
        </div>
    );
};

export default Cart;
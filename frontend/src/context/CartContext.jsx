import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

// Create the cart context
const CartContext = createContext();

// Cart item types
export const CART_ITEM_TYPES = {
  ROOM: 'room',
  SERVICE: 'service',
  PACKAGE: 'package',
  MEAL: 'meal',
  UPGRADE: 'upgrade',
};

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('hotelCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('hotelCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = useCallback((item) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.id === item.id && cartItem.type === item.type
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + (item.quantity || 1)
        };
        toast.success(`${item.name} quantity updated in cart`);
        return updatedItems;
      } else {
        // Add new item with unique ID
        const newItem = {
          ...item,
          cartId: uuidv4(),
          quantity: item.quantity || 1,
          addedAt: new Date().toISOString()
        };
        toast.success(`${item.name} added to cart`);
        return [...prevItems, newItem];
      }
    });
    
    // Open cart when adding items
    setIsCartOpen(true);
  }, []);
  
  // Remove item from cart
  const removeFromCart = useCallback((cartId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.cartId === cartId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart`);
      }
      return prevItems.filter(item => item.cartId !== cartId);
    });
  }, []);
  
  // Update item quantity
  const updateItemQuantity = useCallback((cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.cartId === cartId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }, [removeFromCart]);
  
  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success('Cart cleared');
  }, []);
  
  // Toggle cart open/close
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);
  
  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );
  
  // Calculate item count
  const itemCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 1),
    0
  );
  
  // Group items by type
  const itemsByType = cartItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});
  
  // Check if a specific item is in the cart
  const isInCart = useCallback((id, type) => {
    return cartItems.some(item => item.id === id && item.type === type);
  }, [cartItems]);
  
  // Get item quantity in cart
  const getItemQuantity = useCallback((id, type) => {
    const item = cartItems.find(item => item.id === id && item.type === type);
    return item ? item.quantity || 1 : 0;
  }, [cartItems]);
  
  // Sync cart with booking (e.g., when a room is booked)
  const syncWithBooking = useCallback((bookingDetails) => {
    // Remove any existing room items when syncing with a new booking
    setCartItems(prevItems => 
      prevItems.filter(item => item.type !== CART_ITEM_TYPES.ROOM)
    );
    
    // Add the booked room to cart
    if (bookingDetails.room) {
      addToCart({
        ...bookingDetails.room,
        type: CART_ITEM_TYPES.ROOM,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        adults: bookingDetails.adults,
        children: bookingDetails.children,
        specialRequests: bookingDetails.specialRequests,
        price: bookingDetails.totalPrice,
        isBooked: true
      });
    }
  }, [addToCart]);
  
  // Value to be provided by the context
  const value = {
    cartItems,
    isCartOpen,
    isLoading,
    cartTotal,
    itemCount,
    itemsByType,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    toggleCart,
    setIsCartOpen,
    isInCart,
    getItemQuantity,
    syncWithBooking,
    CART_ITEM_TYPES
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

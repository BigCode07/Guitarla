import { useState, useEffect } from "react";
import "./App.css";
import { Guitar } from "./components/Guitar";
import { Header } from "./components/Header";
import { db } from "./data/db";

function App() {
  // Estado inicial del carrito
  const initialCart = () => {
    try {
      const localStorageCart = localStorage.getItem("cart");
      if (!localStorageCart) return []; // Si no hay datos en localStorage, devuelve un array vacío
      const parsedCart = JSON.parse(localStorageCart);
      if (!Array.isArray(parsedCart)) return []; // Validar que sea un array
      // Asegurarse de que cada objeto en el carrito tenga `quantity`
      return parsedCart.map((item) => ({
        ...item,
        quantity: item.quantity || 1, // Establecer 1 como cantidad predeterminada si falta
      }));
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return []; // Si ocurre un error, inicializar con un array vacío
    }
  };

  const [data, setData] = useState([]); // Productos disponibles
  const [cart, setCart] = useState(initialCart); // Carrito

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  // Cargar datos de productos
  useEffect(() => {
    setData(db);
  }, []);

  // Guardar carrito en `localStorage`
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (item) => {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExists >= 0) {
      // Si el producto ya está en el carrito y no supera el límite
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = cart.map((guitar, index) =>
        index === itemExists
          ? { ...guitar, quantity: guitar.quantity + 1 }
          : guitar
      );
      setCart(updatedCart);
    } else {
      // Si el producto no está en el carrito
      setCart([...cart, { ...item, quantity: 1 }]); // Asegurar inmutabilidad
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  };

  // Incrementar la cantidad de un producto
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity < MAX_ITEMS
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Reducir la cantidad de un producto
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > MIN_ITEMS
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <>
      {/* Header */}
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      {/* Main Content */}
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              addToCart={addToCart} // Sólo pasamos la función necesaria
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;

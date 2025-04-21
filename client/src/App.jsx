import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Cart from './components/Cart';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return(
    <div>
      {!loggedIn ? (
        <>
          <Register />
          <Login onLogin={() => setLoggedIn(true)} />
        </>
      ) : (
        <Cart />
      )}
    </div>
  )
}
export default App;
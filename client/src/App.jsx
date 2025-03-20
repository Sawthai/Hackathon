import { Outlet, Link } from 'react-router-dom'

function App() {
  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }


  return (
    <>
      <header>
      <nav class="navbar">
        <button onClick={logout} class="login-btn">Logout</button>
      </nav>
    </header>
      <Outlet />
    </>
  );
}

export default App;

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
        <ul class="links">
        <Link to="/">Home</Link>
        <Link to="/session_list/new/">Create new session list</Link>
        <Link to ="/view_session_lists/"> Session Lists </Link>
        <Link to="/meditation/">Meditation</Link>

        </ul>
        <button onClick={logout} class="login-btn">Logout</button>
      </nav>
    </header>
      <Outlet />
    </>
  );
}

export default App;
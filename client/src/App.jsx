import { Outlet, Link } from 'react-router'

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
      <nav>
        <button onClick={logout}>Logout</button>
        {/* Add a navigation link to the chat page */}
        <Link to="/chat" style={{ marginLeft: "10px" }}>
          Chat with Gemini
        </Link>
      </nav>
      <Outlet />
    </>
  );
}

export default App;

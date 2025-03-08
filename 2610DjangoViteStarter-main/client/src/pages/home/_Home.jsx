import { Link } from "react-router-dom"

export const Home = () => {
  return (
    <div>
      <Link to="/grocery_list/new">Create new list</Link>
      <div>
        I am on the home page, build me later!
      </div>
    </div>
  )
}
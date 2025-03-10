import { useState } from "react";
import cookie from "cookie";
import { useNavigate } from "react-router";

export const NewList = () => {
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState("");
  const navigate = useNavigate();

  function addItem() {
    if (!items.includes(currentItem)) {
      setItems([...items, currentItem]);
    };
    setCurrentItem("");
  }

  function removeItem(item) {
    setItems(items.filter(i => i != item))
  }

  async function saveList(e) {
    e.preventDefault();
    const {csrftoken} = cookie.parse(document.cookie);
    const res = await fetch("/grocery_lists/", {
      method: "post",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFTOKEN": csrftoken
      }, // include cookies!
      body: JSON.stringify({
        name,
        items
      })
    });
    navigate(-1);
  }

  return (
    <form onSubmit={saveList}>
      <div>
        Name
      </div>
      <input value={name} onChange={e => setName(e.target.value)}/>
      <div>
        {
          items.map(item => (
            <div key={item}>
              {item}
              <button type="button" onClick={() => removeItem(item)}>Delete</button>
            </div>
          ))
        }
      </div>
      <div>
        Add Item
      </div>
      <div>
        <input
          value={currentItem}
          onChange={e => setCurrentItem(e.target.value)}
        />
        <button type="button" onClick={addItem}>+Add</button>
      </div>
      <button>Save</button>
    </form>
  )
}
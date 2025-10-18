import React, { useEffect, useState } from 'react';

function App() {
  const [drinks, setDrinks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:2115/api/drinks')
      .then(res => res.json())
      .then(setDrinks);
  }, []);

  const fetchDrink = (id) => {
    setError('');
    setSelected(null);
    fetch(`http://localhost:2115/api/drinks/${id}`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        return res.json();
      })
      .then(setSelected)
      .catch(e => setError(e.message));
  };

  return (
    <div>
      <h1>Lista trunków</h1>
      <ul>
        {drinks.map(d => (
          <li key={d.id}>
            {d.name} ({d.type}) <button onClick={() => fetchDrink(d.id)}>Szczegóły</button>
          </li>
        ))}
      </ul>
      {selected && (
        <div>
          <h2>Szczegóły trunku</h2>
          <pre>{JSON.stringify(selected, null, 2)}</pre>
        </div>
      )}
      {error && <div style={{color: 'red'}}>Błąd: {error}</div>}
    </div>
  );
}

export default App;

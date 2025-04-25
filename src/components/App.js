import React, { useState, useEffect } from 'react';




function App() {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState({
    name: '',
    image: '',
    price: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  
  useEffect(() => {
    fetch('https://react-hooks-cc-plantshop-2-fh12.onrender.com/plants')
      .then(response => response.json())
      .then(data => setPlants(data))
      .catch(error => console.error('Error fetching plants:', error));
  }, []);


  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewPlant({ ...newPlant, [name]: value });
  }

  
  function handleSubmit(event) {
    event.preventDefault();

    if (!newPlant.name || !newPlant.image || !newPlant.price) {
      alert("Please fill in all fields before adding a plant.");
      return;
    }

    fetch('https://react-hooks-cc-plantshop-2-fh12.onrender.com/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newPlant.name,
        image: newPlant.image,
        price: parseFloat(newPlant.price),
        soldOut: false 
      }),
    })
      .then(response => response.json())
      .then(data => {
        setPlants([...plants, data]);
        setNewPlant({ name: '', image: '', price: '' });
      })
      .catch(error => console.error('Error adding plant:', error));
  }

  
  function handleMarkSoldOut(id) {
    const updatedPlant = plants.find(plant => plant.id === id);
    updatedPlant.soldOut = !updatedPlant.soldOut; 

    fetch(`https://react-hooks-cc-plantshop-2-fh12.onrender.com/plants/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        soldOut: updatedPlant.soldOut,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const updatedPlants = plants.map(plant =>
          plant.id === id ? data : plant
        );
        setPlants(updatedPlants);
      })
      .catch(error => console.error('Error updating plant status:', error));
  }

  
  function handleSearchChange(event) {
    setSearchQuery(event.target.value.toLowerCase()); 
  }

  
  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery) 
  );

  
  function handleDeletePlant(id) {
    fetch(`https://react-hooks-cc-plantshop-2-fh12.onrender.com/plants/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        
        const updatedPlants = plants.filter(plant => plant.id !== id);
        setPlants(updatedPlants);
      })
      .catch(error => console.error('Error deleting plant:', error));
  }

  return (
    <div>
      <h1>Plantsy Admin</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for plants..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Add Plant Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Plant Name"
          value={newPlant.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newPlant.image}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newPlant.price}
          onChange={handleInputChange}
        />
        <button type="submit">Add Plant</button>
      </form>

      {/* Display the list of plants */}
      <ul>
        {filteredPlants
          .filter(plant => plant.name && plant.image && plant.price)
          .map(plant => (
            <li key={plant.id}>
              <img src={plant.image} alt={plant.name} />
              <h2>{plant.name}</h2>
              <p>Price: ${plant.price}</p>
              <p>Status: {plant.soldOut ? "Sold Out" : "Available"}</p>
              <button onClick={() => handleMarkSoldOut(plant.id)}>
                {plant.soldOut ? "Mark as Available" : "Mark as Sold Out"}
              </button>
              {/* Delete Button */}
              <button onClick={() => handleDeletePlant(plant.id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;

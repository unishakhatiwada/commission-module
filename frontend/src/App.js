import React, { useState, useEffect } from 'react';
import './App.css';
import AirportSelect from './components/AirportSelect';

function App() {
  const [rules, setRules] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/airports')
      .then(res => {
        if (!res.ok) throw new Error("Failed to load airports");
        return res.json();
      })
      .then(data => setAirports(data))
      .catch(err => console.error("API Error:", err));

    // Fetch Existing Rules
    fetch('http://localhost:8000/api/rules')
      .then(res => {
        if (!res.ok) throw new Error("Failed to load rules");
        return res.json();
      })
      .then(data => {
        // If data is empty (first run), we can initialize with one empty rule if we want
        // or just leave it empty. Let's leave it as is.
        setRules(data);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  const addRule = () => {
    // Generate a temporary ID (we will ignore this ID when sending to backend)
    setRules([...rules, { id: Date.now(), origins: [], destinations: [], rate: 0, rate_type: 'percentage' }]);
  };

  const removeRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id, field, value) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const saveRules = () => {
    setLoading(true);
    setError(null);

    // 2. Send Data to Real Backend
    fetch('http://localhost:8000/api/rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ rules })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        // Handle validation errors from Laravel
        throw new Error(data.message || "Error saving rules");
      }
      return data;
    })
    .then(data => {
      alert("Success! Rules saved to database.");
      // Optional: Refresh rules from server to get real IDs back
      // fetch('http://localhost:8000/api/rules').then(res=>res.json()).then(setRules);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to save: " + err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="App" style={{maxWidth: '900px', margin: '0 auto', padding: '20px'}}>
      <h2 style={{marginBottom:'20px'}}>Default Commission Management</h2>

      {rules.length === 0 && <p style={{textAlign:'center', color:'#888'}}>No rules found. Add one below.</p>}

      {rules.map((rule) => (
        <div key={rule.id} className="neu-card" style={{position:'relative'}}>
          <button
            onClick={() => removeRule(rule.id)}
            style={{position:'absolute', top:'10px', right:'15px', border:'none', background:'transparent', color:'#ef4444', fontSize:'1.2rem', cursor:'pointer'}}>
            ✕
          </button>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
            <AirportSelect
              label="Origin"
              options={airports}
              selected={rule.origins || []} // Handle nulls safely
              onChange={(val) => updateRule(rule.id, 'origins', val)}
            />
            <AirportSelect
              label="Destination"
              options={airports}
              selected={rule.destinations || []} // Handle nulls safely
              onChange={(val) => updateRule(rule.id, 'destinations', val)}
            />
          </div>

          <div style={{display:'flex', gap:'20px', marginTop:'10px'}}>
            <div style={{flex:1}}>
              <label style={{fontSize:'0.8rem', fontWeight:'bold'}}>Rate</label>
              <input
                type="number"
                className="neu-input"
                value={rule.rate}
                onChange={(e) => updateRule(rule.id, 'rate', e.target.value)}
              />
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:'0.8rem', fontWeight:'bold'}}>Type</label>
              <select
                className="neu-input"
                value={rule.rate_type}
                onChange={(e) => updateRule(rule.id, 'rate_type', e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'30px'}}>
        <button onClick={addRule} className="neu-btn" style={{color:'#3b82f6'}}>
          + Add New Default Rate
        </button>

        <button onClick={saveRules} className="neu-btn" style={{background:'#3b82f6', color:'white'}}>
          {loading ? 'Saving...' : 'Save Rules'}
        </button>
      </div>
    </div>
  );
}

export default App;
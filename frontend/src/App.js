import React, { useState, useEffect } from 'react';
import './App.css';
import AirportSelect from './components/AirportSelect';
import client from './api/client';

function App() {
  const [rules, setRules] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airportRes, ruleRes] = await Promise.all([
          client.get('/airports'),
          client.get('/rules')
        ]);
        setAirports(airportRes.data.data);
        setRules(ruleRes.data.data || []);
      } catch (err) {
        setNotification({ type: 'error', message: "Failed to load initial data." });
      }
    };
    fetchData();
  }, []);

  const addRule = () => {
    setRules([...rules, {
      id: `temp-${Date.now()}`,
      origins: [],
      all_origins: false,
      destinations: [],
      all_destinations: false,
      rate: '',
      rate_type: 'percentage'
    }]);
  };

  const removeRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const updateRule = (id, field, value) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));

    if (errors[id] && errors[id][field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: null }
      }));
    }
  };

  const saveRules = async () => {
    setNotification(null);
    const newErrors = {};
    let hasError = false;
    const signatures = new Set();

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const ruleErrors = {};

      if (!rule.rate || rule.rate <= 0) {
        ruleErrors.rate = "Rate must be > 0";
        hasError = true;
      }

      if (!rule.all_origins && (!rule.origins || rule.origins.length === 0)) {
        ruleErrors.origins = "Select origin(s)";
        hasError = true;
      }

      if (!rule.all_destinations && (!rule.destinations || rule.destinations.length === 0)) {
        ruleErrors.destinations = "Select destination(s)";
        hasError = true;
      }


      if (!rule.all_origins && !rule.all_destinations) {
        const originCodes = new Set(rule.origins.map(o => o.code));
        const overlap = rule.destinations.some(d => originCodes.has(d.code));

        if (overlap) {
          ruleErrors.general = "Origin and Destination cannot be the same";
          ruleErrors.origins = "Remove overlap";
          ruleErrors.destinations = "Remove overlap";
          hasError = true;
        }
      }

      const originSig = rule.all_origins ? "ALL" : rule.origins.map(o => o.code).sort().join(',');
      const destSig = rule.all_destinations ? "ALL" : rule.destinations.map(d => d.code).sort().join(',');
      const uniqueSignature = `${originSig}|${destSig}`;

      if (signatures.has(uniqueSignature)) {
        ruleErrors.general = "Duplicate Rule Logic Detected";
        hasError = true;
      }
      signatures.add(uniqueSignature);

      if (Object.keys(ruleErrors).length > 0) {
        newErrors[rule.id] = ruleErrors;
      }
    }

    setErrors(newErrors);

    if (hasError) {
      setNotification({ type: 'error', message: "Please fix the highlighted errors." });
      return;
    }

    setLoading(true);
    try {
      const response = await client.post('/rules', { rules });

      setNotification({ type: 'success', message: response.data.message });

      const res = await client.get('/rules');
      setRules(res.data.data);
      setErrors({});

      setTimeout(() => {
        setNotification(prev => (prev?.type === 'success' ? null : prev));
      }, 3000);

    } catch (error) {
      const msg = error.response?.data?.message || "Save failed";
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="app-container">

        {notification && (
            <div className={`notification-banner ${notification.type === 'error' ? 'notification-error' : 'notification-success'}`}>
              <span>{notification.message}</span>
              <button className="notification-close" onClick={() => setNotification(null)}>✕</button>
            </div>
        )}

        <h2 className="page-title">Commission Rules</h2>

        {rules.map((rule) => {
          const ruleError = errors[rule.id] || {};

          return (
              <div
                  key={rule.id}
                  className={`neu-card ${ruleError.general ? 'card-duplicate' : ''}`}
              >
                {ruleError.general && (
                    <div className="duplicate-warning">
                      ⚠️ {ruleError.general}
                    </div>
                )}

                <button
                    onClick={() => removeRule(rule.id)}
                    className="delete-btn"
                    title="Delete this rule"
                >
                  ✕
                </button>

                <div className="form-grid">
                  <AirportSelect
                      label="Origin"
                      options={airports}
                      selected={rule.origins || []}
                      isAll={rule.all_origins}
                      onToggleAll={(checked) => updateRule(rule.id, 'all_origins', checked)}
                      onChange={(val) => updateRule(rule.id, 'origins', val)}
                      error={ruleError.origins}
                  />

                  <AirportSelect
                      label="Destination"
                      options={airports}
                      selected={rule.destinations || []}
                      isAll={rule.all_destinations}
                      onToggleAll={(checked) => updateRule(rule.id, 'all_destinations', checked)}
                      onChange={(val) => updateRule(rule.id, 'destinations', val)}
                      error={ruleError.destinations}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className={`input-label ${ruleError.rate ? 'error' : ''}`}>
                      Rate
                    </label>
                    <input
                        type="number"
                        className={`neu-input ${ruleError.rate ? 'input-error' : ''}`}
                        value={rule.rate}
                        onChange={(e) => updateRule(rule.id, 'rate', e.target.value)}
                    />
                    {ruleError.rate && <div className="error-text">{ruleError.rate}</div>}
                  </div>

                  <div className="form-group">
                    <label className="input-label">Type</label>
                    <select
                        className="neu-input"
                        value={rule.rate_type}
                        onChange={(e) => updateRule(rule.id, 'rate_type', e.target.value)}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat ()</option>
                    </select>
                  </div>
                </div>
              </div>
          )})}

        <div className="footer-buttons">
          <button onClick={addRule} className="btn-add">
            + Add New Rule
          </button>

          <button onClick={saveRules} disabled={loading} className="btn-save">
            {loading ? 'Saving...' : 'Save Rules'}
          </button>
        </div>
      </div>
  );
}

export default App;
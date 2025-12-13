import React, { useState } from 'react';

const AirportSelect = ({ label, options, selected, onChange }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const addTag = (airport) => {
    if (!selected.find(s => s.code === airport.code)) {
      onChange([...selected, airport]);
    }
    setQuery('');
    setShowDropdown(false);
  };

  const removeTag = (code) => {
    onChange(selected.filter(s => s.code !== code));
  };

  const filteredOptions = options.filter(opt =>
    opt.code.toLowerCase().includes(query.toLowerCase()) ||
    opt.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>{label}</label>

      <div className="neu-input" style={{minHeight: '45px', display:'flex', flexWrap:'wrap', gap:'5px', alignItems:'center'}}>
        {selected.map(apt => (
          <span key={apt.code} style={{background: '#dbeafe', color:'#2563eb', padding:'2px 8px', borderRadius:'4px', fontSize:'0.85rem', display:'flex', alignItems:'center'}}>
            {apt.code}
            <button onClick={() => removeTag(apt.code)} style={{background:'none', border:'none', color:'#ef4444', marginLeft:'5px', cursor:'pointer', fontWeight:'bold'}}>×</button>
          </span>
        ))}
        <input
          type="text"
          style={{background:'transparent', border:'none', outline:'none', flex:1, minWidth:'100px'}}
          placeholder={selected.length === 0 ? "Search airport..." : ""}
          value={query}
          onChange={e => {setQuery(e.target.value); setShowDropdown(true);}}
          onFocus={() => setShowDropdown(true)}
        />
      </div>

      {showDropdown && query && (
        <div style={{position:'absolute', zIndex:10, background:'#ebecf0', width:'300px', maxHeight:'200px', overflowY:'auto', boxShadow:'5px 5px 10px #babecc', borderRadius:'8px', marginTop:'5px'}}>
          {filteredOptions.length > 0 ? filteredOptions.map(opt => (
            <div
              key={opt.code}
              onClick={() => addTag(opt)}
              style={{padding:'8px', cursor:'pointer', borderBottom:'1px solid #ddd'}}
              onMouseEnter={(e) => e.target.style.background = '#d1d5db'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <strong>{opt.code}</strong> - {opt.city}, {opt.country}
            </div>
          )) : (
            <div style={{padding:'8px', color:'#888'}}>No airports found</div>
          )}
        </div>
      )}
      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:9}} onClick={() => setShowDropdown(false)}></div>}
    </div>
  );
};

export default AirportSelect;
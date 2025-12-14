import React, { useState, useEffect, useRef } from 'react';

const AirportSelect = ({ label, options, selected, onChange, isAll, onToggleAll, error }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

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
      <div className="as-container" ref={wrapperRef}>
        <div className="as-header">
          <label className={`input-label ${error ? 'error' : ''}`}>{label}</label>

          <label className={`as-checkbox-label ${isAll ? 'active' : ''}`}>
            <input
                type="checkbox"
                className="as-checkbox"
                checked={isAll || false}
                onChange={(e) => {
                  onToggleAll(e.target.checked);
                  if (e.target.checked) setShowDropdown(false);
                }}
            />
            All Airports
          </label>
        </div>

        {isAll ? (
            <div className="as-all-box">
              Applicable to <strong>&nbsp;All {label}s</strong>&nbsp;(Wildcard Active)
            </div>
        ) : (
            <div
                className={`as-input-box ${error ? 'error' : ''}`}
                onClick={() => setShowDropdown(true)}
            >
              {selected.map(apt => (
                  <span key={apt.code} className="as-tag">
                    <span className="as-tag-text">{apt.code}</span>
                    <button
                        className="as-tag-remove"
                        onClick={(e) => { e.stopPropagation(); removeTag(apt.code); }}
                    >
                        ✕
                    </button>
                </span>
              ))}

              <input
                  type="text"
                  className="as-text-input"
                  placeholder={selected.length === 0 ? "Select airports..." : ""}
                  value={query}
                  onChange={e => {setQuery(e.target.value); setShowDropdown(true);}}
                  onFocus={() => setShowDropdown(true)}
              />

              <span className="as-arrow">▼</span>

              {showDropdown && (
                  <div className="as-dropdown">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.slice(0, 50).map(opt => {
                          const isSelected = selected.find(s => s.code === opt.code);
                          return (
                              <div
                                  key={opt.code}
                                  onClick={(e) => { e.stopPropagation(); addTag(opt); }}
                                  className={`as-option ${isSelected ? 'selected' : ''}`}
                              >
                                <div className="as-option-code">{opt.code}</div>
                                <div className="as-option-city">{opt.city}, {opt.country}</div>
                              </div>
                          );
                        })
                    ) : (
                        <div className="as-no-options">No airports found</div>
                    )}
                  </div>
              )}
            </div>
        )}
        {error && <div className="error-text">{error}</div>}
      </div>
  );
};

export default AirportSelect;
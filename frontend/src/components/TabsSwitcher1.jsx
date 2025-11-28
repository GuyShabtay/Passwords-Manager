import React, { useState, useEffect,useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./TabsSwitcher.css";
import secure from '../assets/images/sheild1.jpg';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function TabsSwitcher({ accentColor = "#FF6B00" }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [credentials, setCredentials] = useState({});
  const userId = sessionStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
const [dropdownResults, setDropdownResults] = useState([]);
const inputRef = useRef(null);
const dropdownRef = useRef(null);

useEffect(() => {
  function handleClickOutside(e) {
    // If click is NOT on input AND not on dropdown → close results
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      setDropdownResults([]);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

// Flatten all websites across categories
const allWebsites = Object.entries(credentials).flatMap(([cat, creds]) =>
  creds.flatMap((cred) =>
    cred.websites.map((site) => ({
      name: site.name,
      category: cat,
      password: site.password,
      credId: cred.id
    }))
  )
);

// Update dropdown + filtered categories when typing
useEffect(() => {
  if (!searchTerm.trim()) {
    setDropdownResults([]);
    return;
  }

  const results = allWebsites
    .filter((w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 3);

  setDropdownResults(results);
}, [searchTerm, credentials]);

// Filter categories based on search term
const filteredCategories = searchTerm
  ? categories.filter((cat) =>
      allWebsites.some(
        (w) =>
          w.category === cat &&
          w.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  : categories;

// Filter items in active category
const filteredItems =
  activeCategory && Array.isArray(credentials[activeCategory])
    ? credentials[activeCategory].flatMap((cred) =>
        cred.websites
          .filter((site) =>
            site.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((site) => ({
            ...site,
            credId: cred.id
          }))
      )
    : [];


  useEffect(() => {
    if (!userId) {
      console.warn("No userId in sessionStorage, skipping fetch");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/credentials/${userId}`
        );

        console.log("RAW RESPONSE:", res);

        const data = res.data;
        console.log("DATA:", data);

        // Print full details
        Object.entries(data).forEach(([category, creds]) => {
          console.log("Category:", category);
          creds.forEach((cred) => {
            console.log("  Credential ID:", cred.id);
            cred.websites.forEach((site) => {
              console.log("    Website:", site.name);
              console.log("    Password:", site.password);
            });
          });
        });

        if (!data || Object.keys(data).length === 0) {
          setCredentials({});
          setCategories([]);
          setActiveCategory(null);
          return;
        }

        setCredentials(data);

        const cats = Object.keys(data);
        setCategories(cats);

        // Pick first category that actually has credentials
        const firstNonEmpty = cats.find(
          (cat) => Array.isArray(data[cat]) && data[cat].length > 0
        );

        setActiveCategory(firstNonEmpty || cats[0]);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setCredentials({});
        setCategories([]);
        setActiveCategory(null);
      }
    };

    fetchData();
  }, [userId]);

  const items =
    activeCategory && Array.isArray(credentials[activeCategory])
      ? credentials[activeCategory]
      : [];

  return (
    <div className="tabs-wrapper">
      <div className="tabs-container">
      <div className="sticky-header one-line">

     
      <div className="one-line tabs-title-box">
                <img src={secure} alt='secure' id='logo-icon' />
                <h1 className="tabs-title">Secure & Encrypted</h1>
                </div>

                
                {/* USERNAME INPUT - uses left-side person icon */}
                <div className="search-box">
                <form className="form-box">
            <div className="input-container username">
              <input
               ref={inputRef}
                required
                className="input"
                type="text"
                name="username"
                id="username-field"
                placeholder="Search websites"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'Search websites')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <label className="usernameLabel" htmlFor="username-field">Search websites</label>

<svg viewBox="0 0 500 512" className="userIcon" aria-hidden>
<SearchRoundedIcon/>  
              </svg>

            </div>
            </form>

            {dropdownResults.length > 0 && (
    <div className="search-dropdown" ref={dropdownRef}>
      {dropdownResults.map((site, i) => (
        <div
          key={i}
          className="dropdown-item"
          onClick={() => {
            setSearchTerm(site.name);
            setActiveCategory(site.category);
            setDropdownResults([]);
          }}
        >
          {site.name} <span className="dropdown-cat">({site.category})</span>
        </div>
      ))}
    </div>
  )}
            </div>
             </div>
            
        <div className="tabs-layout">
          {/* LEFT PANEL – CATEGORIES */}
          <div className="sections-list">
            {categories.length === 0 ? (
              <div style={{ padding: "1rem", color: "#777", textAlign: "center" }}>
                No categories available
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <motion.div
                  key={cat}
                  className={`section-item ${activeCategory === cat ? "active" : ""}`}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => setActiveCategory(cat)}
                >
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="section-indicator"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <h2 className="section-title">{cat}</h2>
                </motion.div>
              ))
            )}
          </div>

          {/* RIGHT PANEL – CREDENTIALS */}
          <div className="stocks-panel">
            <motion.div
              className="stocks-list"
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredItems.length === 0 ? (
  <div style={{ padding: "2rem", color: "#777", textAlign: "center" }}>
    {searchTerm
      ? "No matching websites found."
      : "No credentials in this category."}
  </div>
) : (
  filteredItems.map((site, index) => (
    <motion.div
      key={`${site.credId}-${site.name}-${index}`}
      layoutId={`row-${site.credId}-${site.name}`}
      className="stock-row"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="stock-left">
        <div
          className="stock-icon"
          style={{ backgroundColor: accentColor + "20" }}
        >
          🔐
        </div>
        <div>
          <div className="stock-symbol">{site.name}</div>
          <div className="stock-name" style={{ color: "#777" }}>
            {site.password}
          </div>
        </div>
      </div>
    </motion.div>
  ))
)}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

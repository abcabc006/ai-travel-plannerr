import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, ChevronLeft, ChevronRight, Rocket, X, Plus, Search, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { callGroqAPI, getAPIKey, GROQ_API_KEY, GROQ_URL, GROQ_MODEL } from "@/src/services/groqService";

// --- Types ---

interface LocationSuggestion {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    type?: string;
  };
  lat: string;
  lon: string;
  type: string;
}

// --- Components ---

interface LocationAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (val: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  label?: string;
}

const LocationAutocomplete = ({ value, onChange, onSelect, placeholder, icon }: LocationAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6&accept-language=en`,
        {
          headers: {
            "User-Agent": "AITravelPlanner/1.0",
          },
        }
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Nominatim fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (value.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 400);
    } else {
      setSuggestions([]);
    }
  }, [value, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayName = (item: LocationSuggestion) => {
    const a = item.address || {};
    const parts = [
      a.city || a.town || a.village || (item as any).name || (item as any).display_name.split(',')[0],
      a.state,
      a.country
    ].filter(Boolean);
    return parts.slice(0, 3).join(", ");
  };

  const getIcon = (type: string) => {
    if (type === "city" || type === "administrative") return "🏙️";
    if (type === "country") return "🌍";
    return "📍";
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2.5 border border-border-light rounded-input focus:ring-2 focus:ring-primary-red/15 focus:border-primary-red outline-none transition-all font-sans text-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 text-primary-red animate-spin" />}
          {value && (
            <button
              onClick={() => {
                onChange("");
                setSuggestions([]);
              }}
              className="text-muted-text hover:text-primary-red transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (suggestions.length > 0 || (value.length >= 2 && !loading)) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-border-light z-[1000] overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => {
                      const name = formatDisplayName(item);
                      onSelect(name);
                      setShowDropdown(false);
                    }}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-[#FFF5F5] hover:border-l-3 hover:border-primary-red transition-all"
                  >
                    <span className="text-lg">{getIcon(item.type)}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-deep-navy">
                        {item.address.city || item.address.town || item.address.village || item.display_name.split(',')[0]}
                      </span>
                      <span className="text-[12px] text-muted-text line-clamp-1">
                        {item.display_name}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-text">
                  No locations found
                </div>
              )}
            </div>
            <div className="p-2 border-t border-border-light bg-gray-50 text-[11px] text-muted-text text-right px-4">
              Powered by OpenStreetMap
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Component ---

const themes = [
  { id: "historical", label: "🏛️ Historical Sites" },
  { id: "adventure", label: "🧗 Adventure" },
  { id: "culture", label: "🎭 Local Culture" },
  { id: "beaches", label: "🏖️ Beaches" },
  { id: "wildlife", label: "🌿 Hills & Wildlife" },
  { id: "nightlife", label: "🌙 Nightlife" },
  { id: "gram", label: "📸 For the Gram" },
  { id: "shopping", label: "🛍️ Shopping & Relaxation" },
];

export default function CreatePlan() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Discovering top spots...");
  
  const [formData, setFormData] = useState({
    origin: "",
    destinations: [] as string[],
    destInput: "",
    startDate: "",
    endDate: "",
    themes: [] as string[],
    pace: "Balanced",
    weather: "Warm and Sunny",
    accommodation: "4 Star",
    food: "Local Cuisine",
    travelMode: "✈️ Flights",
    currency: "USD",
    budget: 2000,
    passengers: { adults: 1, children: 0 },
    additionalNotes: ""
  });

  const updateForm = (changes: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...changes }));
  };

  useEffect(() => {
    if (loading) {
      const messages = [
        "Discovering top spots...",
        "Planning optimal timing...",
        "Finding foodie gems...",
        "Calculating your budget..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  function handleStep1Continue() {
    // Auto-add destInput to destinations if user typed but did not click +
    const currentDest = formData.destInput || (formData as any).destination || "";
    const currentDestinations = Array.isArray(formData.destinations) ? formData.destinations : [];

    if (currentDestinations.length === 0 && currentDest.trim() !== "") {
      updateForm({
        destinations: [currentDest.trim()],
      });
    }

    setStep(2);
  }

  const handleSubmit = async () => {
    const hasDestinations = (Array.isArray(formData.destinations) && formData.destinations.length > 0)
      || (formData.destInput && String(formData.destInput).trim() !== "")
      || ((formData as any).destination && String((formData as any).destination).trim() !== "");

    if (!hasDestinations) {
      alert("Please add at least one destination in Step 1.");
      setStep(1);
      return;
    }

    // Debug — check what is actually being sent
    console.log('=== FORM DATA BEING SENT TO AI ===');
    console.log('Origin:', formData.origin);
    console.log('Destinations:', formData.destinations);
    console.log('Full formData:', JSON.stringify(formData, null, 2));

    setLoading(true);
    try {
      const plan = await callGroqAPI(formData);
      const recent = JSON.parse(localStorage.getItem("recentPlans") || "[]");
      localStorage.setItem("recentPlans", JSON.stringify([plan, ...recent].slice(0, 5)));
      navigate(`/plan/${plan.id}`, { state: { plan } });
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addDest = (val?: string) => {
    const target = val || formData.destInput;
    if (target.trim()) {
      updateForm({
        destinations: [...formData.destinations, target.trim()],
        destInput: ""
      });
    }
  };

  const removeDest = (idx: number) => {
    updateForm({
      destinations: formData.destinations.filter((_, i) => i !== idx)
    });
  };

  const toggleTheme = (id: string) => {
    updateForm({
      themes: formData.themes.includes(id) 
        ? formData.themes.filter(t => t !== id)
        : [...formData.themes, id]
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F9FA',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center text-center p-8"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <svg width="120" height="120" viewBox="0 0 400 400" fill="none">
                <path d="M200 40C130 40 80 90 80 160C80 230 140 280 200 320C260 280 320 230 320 160C320 90 270 40 200 40Z" fill="#E63946" />
                <rect x="180" y="330" width="40" height="30" rx="4" fill="#1D3557" />
                <path d="M100 180L180 330M300 180L220 330" stroke="#1D3557" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-deep-navy mb-4 font-display">{loadingMessage}</h2>
            <div className="flex gap-2 mb-4">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: i === 0 ? '#E63946' : i === 1 ? '#F4A261' : '#2A9D8F' }}
                />
              ))}
            </div>
            <p className="text-muted-text text-[13px]">Usually takes 10–15 seconds</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '900px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        background: 'white'
      }}>
        {/* Left Panel */}
        <div style={{
          width: '320px',
          minWidth: '320px',
          maxWidth: '320px',
          background: '#E63946',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
          <h2 style={{
            color: 'white',
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px',
            fontWeight: 700,
            margin: '0 0 32px 0',
          }}>
            Plan Your Trip
          </h2>

          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: step === 1 ? 'white' : 'transparent',
              border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step === 1 ? '#E63946' : 'white',
              fontWeight: 700, fontSize: '15px', flexShrink: 0,
            }}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span style={{
              color: 'white', fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px', fontWeight: step === 1 ? 700 : 400,
              opacity: step === 1 ? 1 : 0.7,
            }}>
              Destinations
            </span>
          </div>

          {/* Connector */}
          <div style={{
            width: '2px',
            height: '32px',
            background: 'rgba(255,255,255,0.35)',
            marginLeft: '17px',
            flexShrink: 0,
          }} />

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: step === 2 ? 'white' : 'transparent',
              border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step === 2 ? '#E63946' : 'white',
              fontWeight: 700, fontSize: '15px', flexShrink: 0,
            }}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span style={{
              color: 'white', fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px', fontWeight: step === 2 ? 700 : 400,
              opacity: step === 2 ? 1 : 0.7,
            }}>
              Style
            </span>
          </div>

          {/* Connector */}
          <div style={{
            width: '2px',
            height: '32px',
            background: 'rgba(255,255,255,0.35)',
            marginLeft: '17px',
            flexShrink: 0,
          }} />

          {/* Step 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: step === 3 ? 'white' : 'transparent',
              border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step === 3 ? '#E63946' : 'white',
              fontWeight: 700, fontSize: '15px', flexShrink: 0,
            }}>
              3
            </div>
            <span style={{
              color: 'white', fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px', fontWeight: step === 3 ? 700 : 400,
              opacity: step === 3 ? 1 : 0.7,
            }}>
              Budget
            </span>
          </div>

          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            marginTop: '40px',
            marginBottom: 0,
          }}>
            Step {step} of 3
          </p>
        </div>

        {/* Right Panel */}
        <div style={{
          flex: 1,
          background: '#ffffff',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          <div style={{ flex: 1 }}>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-deep-navy font-sans">Where are you starting from?</label>
                  <LocationAutocomplete
                    value={formData.origin}
                    onChange={(val) => updateForm({ origin: val })}
                    onSelect={(val) => updateForm({ origin: val })}
                    placeholder="Your city (e.g. Chennai, Mumbai)"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-deep-navy font-sans">Search destination(s)</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <LocationAutocomplete
                        value={formData.destInput}
                        onChange={(val) => updateForm({ destInput: val })}
                        onSelect={(val) => updateForm({ destInput: val })}
                        placeholder="e.g. Delhi, Paris, Tokyo"
                        icon={<Search className="w-4 h-4" />}
                      />
                    </div>
                    <button 
                      type="button"
                      disabled={!formData.destInput}
                      onClick={() => addDest()}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-input transition-all",
                        formData.destInput ? "bg-deep-navy text-white hover:bg-primary-red hover:scale-105" : "bg-deep-navy opacity-40 text-white cursor-not-allowed"
                      )}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.destinations.map((dest, i) => (
                      <span key={i} className="bg-[#1D3557] text-white px-3 py-1.5 rounded-pill text-xs flex items-center gap-2 font-sans font-medium">
                        📍 {dest}
                        <button 
                          type="button"
                          onClick={() => removeDest(i)}
                          className="hover:text-accent-yellow transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-deep-navy font-sans">Start Date</label>
                    <input
                      type="date"
                      min={today}
                      className="w-full px-4 py-2.5 border border-border-light rounded-input focus:ring-2 focus:ring-primary-red/15 focus:border-primary-red outline-none transition-all text-sm font-sans"
                      value={formData.startDate}
                      onChange={e => updateForm({ startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-deep-navy font-sans">End Date</label>
                    <input
                      type="date"
                      min={formData.startDate || today}
                      className="w-full px-4 py-2.5 border border-border-light rounded-input focus:ring-2 focus:ring-primary-red/15 focus:border-primary-red outline-none transition-all text-sm font-sans"
                      value={formData.endDate}
                      onChange={e => updateForm({ endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3 text-deep-navy font-sans">Travel Themes</label>
                  <div className="flex flex-wrap gap-2">
                    {themes.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTheme(t.id)}
                        className={cn(
                          "px-4 py-2 rounded-pill text-sm font-medium border transition-all font-sans",
                          formData.themes.includes(t.id) 
                            ? "bg-primary-red border-primary-red text-white" 
                            : "bg-white border-border-light text-muted-text hover:border-core-blue hover:text-core-blue"
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {[
                  { 
                    label: "Pace of travel", 
                    options: ["🐢 Slow and Easy", "⚖️ Balanced", "⚡ Fast"], 
                    field: "pace",
                    activeClass: "bg-accent-yellow border-accent-yellow text-deep-navy"
                  },
                  { 
                    label: "Weather preference", 
                    options: ["☀️ Warm and Sunny", "🌬️ Cool and Breezy", "❄️ Cold and Snowy", "🌤️ Mild and Pleasant", "🌧️ Rainy and Cozy"], 
                    field: "weather",
                    activeClass: "bg-core-blue border-core-blue text-white"
                  },
                  { 
                    label: "Accommodation type", 
                    options: ["⭐ 3 Star", "⭐⭐ 4 Star", "⭐⭐⭐ 5 Star", "🏠 Airbnb", "🏡 Homestay", "🛏️ Hostel"], 
                    field: "accommodation",
                    activeClass: "bg-fresh-green border-fresh-green text-white"
                  },
                  { 
                    label: "Food preference", 
                    options: ["🥗 Vegetarian", "🌱 Vegan", "🌾 Gluten Free", "🌙 Halal", "✡️ Kosher", "🍜 Local Cuisine"], 
                    field: "food",
                    activeClass: "bg-primary-red border-primary-red text-white"
                  },
                  { 
                    label: "Travel mode", 
                    options: ["✈️ Flights", "🚆 Trains", "🚌 Buses", "🚗 Road"], 
                    field: "travelMode",
                    activeClass: "bg-deep-navy border-deep-navy text-white"
                  }
                ].map((group) => (
                  <div key={group.label}>
                    <label className="block text-sm font-bold mb-4 text-deep-navy font-sans">{group.label}</label>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateForm({ [group.field]: opt })}
                          className={cn(
                            "px-4 py-2 rounded-pill text-sm font-medium border transition-all font-sans",
                            (formData as any)[group.field] === opt 
                              ? group.activeClass 
                              : "bg-white border-border-light text-muted-text hover:border-core-blue hover:text-core-blue"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-deep-navy font-sans">Currency</label>
                    <select
                      className="w-full px-4 py-2.5 border border-border-light rounded-input outline-none focus:border-primary-red transition-all text-sm font-sans"
                      value={formData.currency}
                      onChange={e => updateForm({ currency: e.target.value })}
                    >
                      {["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "SGD", "AED"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-deep-navy font-sans">Passengers</label>
                    <select
                      className="w-full px-4 py-2.5 border border-border-light rounded-input outline-none focus:border-primary-red transition-all text-sm font-sans"
                      value={formData.passengers.adults}
                      onChange={e => updateForm({ passengers: { ...formData.passengers, adults: parseInt(e.target.value) } })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-4 text-deep-navy font-sans">What is your estimated travel budget? (Optional)</label>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 relative h-6 flex items-center">
                      <div className="absolute w-full h-1.5 bg-gray-100 rounded-full" />
                      <div 
                        className="absolute h-1.5 bg-gradient-to-r from-primary-red to-accent-yellow rounded-full" 
                        style={{ width: `${(formData.budget / 20000) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="500"
                        max="20000"
                        step="500"
                        className="absolute w-full h-1.5 opacity-0 cursor-pointer z-10"
                        value={formData.budget}
                        onChange={e => updateForm({ budget: parseInt(e.target.value) })}
                      />
                      <motion.div 
                        className="absolute w-5 h-5 bg-primary-red rounded-full border-2 border-white shadow-md pointer-events-none flex items-center justify-center"
                        style={{ left: `calc(${(formData.budget / 20000) * 100}% - 10px)` }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </motion.div>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-border-light rounded-input font-mono font-bold text-sm text-center outline-none focus:border-primary-red"
                        value={formData.budget}
                        onChange={e => updateForm({ budget: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-deep-navy font-sans">Any additional preferences or specific places/activities? (Optional)</label>
                  <textarea
                    placeholder="e.g. Parliament, Qutub Minar, avoid crowded malls..."
                    className="w-full px-4 py-3 border border-border-light rounded-input h-32 outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/10 transition-all text-sm font-sans resize-y"
                    value={formData.additionalNotes}
                    onChange={e => updateForm({ additionalNotes: e.target.value })}
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-10 flex justify-between items-center">
            {step > 1 ? (
              <button 
                type="button"
                onClick={handleBack} 
                className="text-muted-text font-bold text-sm flex items-center gap-1 hover:text-deep-navy transition-colors font-sans"
              >
                ← Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={step === 1 ? handleStep1Continue : handleNext}
                className="bg-primary-red text-white px-8 py-3 rounded-pill font-bold text-sm flex items-center gap-2 hover:bg-[#C1121F] hover:-translate-y-0.5 transition-all shadow-md font-sans"
              >
                Continue →
              </button>
            ) : (
              <div className="w-full space-y-4">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch("https://api.groq.com/openai/v1/models", {
                        headers: {
                          "Authorization": `Bearer ${getAPIKey()}`,
                          "Content-Type": "application/json"
                        }
                      });
                      const data = await res.json();
                      if (res.ok) {
                        alert("✅ Groq Connection Successful!\nModels available: " + data.data.length);
                      } else {
                        alert("❌ Groq Error: " + (data.error?.message || "Unknown error"));
                      }
                    } catch (e: any) {
                      alert("❌ Cannot reach Groq:\n" + e.message);
                    }
                  }}
                  className="w-full bg-deep-navy/5 text-deep-navy border border-deep-navy/10 px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-deep-navy/10 transition-all font-sans"
                >
                  🔍 Test Groq API Connection
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-primary-red text-white px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#C1121F] hover:-translate-y-0.5 transition-all shadow-lg font-sans"
                >
                  🚀 Generate My Itinerary
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface TravelPlan {
  id: string;
  tripTitle: string;
  origin: string;
  destinations: string;
  dates: string;
  tripHighlights: {
    narrative: string;
    weatherSummary: string;
    bestTimeNote: string;
  };
  weatherAnalysis: {
    expectedConditions: string;
    temperatureRange: string;
    bestTimeToVisit: string;
    packingWeatherTip: string;
  };
  itinerary: {
    day: number;
    date: string;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
    foodRecommendations: string[];
    stayOptions: string[];
    optionalActivities: string[];
    tip: string;
  }[];
  topSpots: {
    name: string;
    type: string;
    description: string;
    bestTime: string;
    rating: string;
  }[];
  foodieHotspots: {
    name: string;
    cuisine: string;
    priceRange: string;
    description: string;
    nearLandmark: string;
  }[];
  budgetBreakdown: {
    currency: string;
    totalEstimatedMin: number;
    totalEstimatedMax: number;
    accommodation: { min: number; max: number; percentage: number };
    food: { min: number; max: number; percentage: number };
    activities: { min: number; max: number; percentage: number };
    transport: { min: number; max: number; percentage: number };
    contingency: { min: number; max: number; percentage: number };
  };
  packingChecklist: {
    clothing: string[];
    documents: string[];
    health: string[];
    electronics: string[];
    essentials: string[];
  };
  passengers?: any;
  bookingLinks: {
    flights: {
      route: string;
      providers: { name: string; url: string }[];
    };
    hotels: {
      providers: { name: string; url: string }[];
    };
    activities: {
      providers: { name: string; url: string }[];
    };
  };
  localGuides?: {
    name: string;
    specialization: string;
    experience: string;
    languages: string[];
    rating: string;
    reviewCount: string;
    pricePerDay: number;
    phone: string;
    email: string;
    description: string;
    topTour: string;
    verified: boolean;
    available: boolean;
  }[];
}

export let GROQ_API_KEY = "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";

// Priority: runtime override → module variable → fallback
export function getAPIKey() {
  return (window as any).__ACTIVE_GROQ_KEY__ || (window as any).__GROQ_API_KEY__ || GROQ_API_KEY || "";
}
export const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function runAPIDiagnostics() {
  const results = {
    configCheck:    {},
    connectionTest: {},
    usageCheck:     {},
  };

  // Always read the live key at call time
  const liveKey = getAPIKey();

  console.log("Diagnostics using key:", liveKey.substring(0,8) + "...");

  // ── 1. Config Check ──────────────────────────────────────
  results.configCheck = {
    apiKeyValue:  liveKey
      ? liveKey.startsWith("gsk_")
        ? `✅ Valid format — ${liveKey.substring(0,8)}...${liveKey.slice(-4)}`
        : `❌ Invalid format — should start with gsk_`
      : "❌ Not set",
    urlValue:     typeof GROQ_URL !== "undefined" && GROQ_URL.includes("groq.com")
      ? `✅ ${GROQ_URL}`
      : `❌ Wrong URL`,
    modelValue:   typeof GROQ_MODEL !== "undefined"
      ? `✅ ${GROQ_MODEL}`
      : "❌ Not defined",
    activeKey:    `${liveKey.substring(0,8)}...${liveKey.slice(-4)}`,
  };

  // ── 2. Connection Test ───────────────────────────────────
  try {
    const res  = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { "Authorization": `Bearer ${liveKey}` }
    });
    const data = await res.json();

    if (res.ok) {
      const models = (data.data || []).map((m: any) => m.id);
      results.connectionTest = {
        status:               `✅ Connected — HTTP ${res.status}`,
        availableModels:      models,
        currentModelAvailable: models.includes(GROQ_MODEL)
          ? `✅ ${GROQ_MODEL} is available`
          : `❌ ${GROQ_MODEL} not found`,
      };
    } else {
      results.connectionTest = {
        status: `❌ Failed — HTTP ${res.status}`,
        error:  data?.error?.message || JSON.stringify(data),
        reason: res.status === 401 ? "Invalid API key"
              : res.status === 429 ? "Rate limit exceeded"
              : res.status === 403 ? "Permission denied"
              : "Unknown error",
      };
    }
  } catch (e: any) {
    results.connectionTest = {
      status: `❌ Network error — ${e.message}`,
      reason: "Cannot reach Groq API. Check internet connection.",
    };
  }

  // ── 3. Generation Test ───────────────────────────────────
  try {
    const testRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${liveKey}`,
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages:    [
          { role:"system",  content:"Return only valid JSON."                                          },
          { role:"user",    content:'Return: {"test":"success","api":"groq","status":"working"}' },
        ],
        temperature: 0.1,
        max_tokens:  30,
        stream:      false,
      }),
    });
    const testData = await testRes.json();
    const content  = testData?.choices?.[0]?.message?.content || "";
    results.usageCheck = {
      generationTest: testRes.ok
        ? `✅ Working — ${content.substring(0,60)}`
        : `❌ Failed — ${testData?.error?.message || testRes.status}`,
      tokensUsed: testData?.usage
        ? `✅ ${testData.usage.total_tokens} tokens used`
        : "No token data",
    };
  } catch (e: any) {
    results.usageCheck = {
      generationTest: `❌ Test failed — ${e.message}`,
    };
  }

  return results;
}

function sanitizeTripPlan(plan: any): TravelPlan {
  if (!plan.id) {
    plan.id = `${plan.destinations?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'trip'}-${Date.now().toString(36)}`;
  }
  if (!plan.localGuides) {
    plan.localGuides = [];
  }
  return plan as TravelPlan;
}

function stripEmoji(str: any) {
  if (!str) return "";
  return String(str)
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F000}-\u{1FFFF}]|⭐|✈️|🚆|🚌|🚗|☀️|🌬️|❄️|🌤️|🌧️|🐢|⚖️|⚡|🥗|🌱|🌾|🌙|✡️|🍜/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function callGroqAPI(formData: any): Promise<TravelPlan> {

  // ── STEP 1: Normalize all inputs safely ──────────────────
  const origin = String(formData.origin || "Not specified").trim();

  // If destinations array is empty but destInput has a value, use destInput directly
  const rawDestinations = Array.isArray(formData.destinations) && formData.destinations.length > 0
    ? formData.destinations
    : formData.destInput && String(formData.destInput).trim() !== ""
    ? [String(formData.destInput).trim()]
    : formData.destination && String(formData.destination).trim() !== ""
    ? [String(formData.destination).trim()]
    : [];

  const destinations = rawDestinations.length > 0
    ? rawDestinations.join(", ")
    : null;

  if (!destinations) {
    throw new Error("No destination provided. Please type a destination and click + to add it.");
  }

  console.log("RESOLVED DESTINATIONS:", destinations);

  const startDate     = String(formData.startDate     || "").trim();
  const endDate       = String(formData.endDate       || "").trim();
  const themes        = Array.isArray(formData.themes) && formData.themes.length > 0
    ? formData.themes.join(", ")
    : "General Sightseeing";
  const pace          = stripEmoji(formData.pace)          || "Balanced";
  const weather       = stripEmoji(formData.weather)        || "Any";
  const accommodation = stripEmoji(formData.accommodation)  || "Mid-range Hotel";
  const food          = stripEmoji(formData.food)           || "Local Cuisine";
  const travelMode    = stripEmoji(formData.travelMode)     || "Flights";
  const currency      = String(formData.currency      || "INR").trim();
  const budget = formData.budget !== undefined && formData.budget !== null && formData.budget !== ""
    ? String(formData.budget)
    : "Moderate";
  const passengers = typeof formData.passengers === "object" && formData.passengers !== null
    ? `${formData.passengers.adults || 1} adult${(formData.passengers.adults || 1) > 1 ? "s" : ""}${formData.passengers.children > 0 ? `, ${formData.passengers.children} child${formData.passengers.children > 1 ? "ren" : ""}` : ""}`
    : String(formData.passengers || "1 adult").trim();
  const notes = String(
    formData.notes || formData.additionalNotes || formData.specialRequests || "None"
  ).trim();

  // ── STEP 2: Calculate number of days ─────────────────────
  let numDays = 1;
  try {
    const start = new Date(startDate);
    const end   = new Date(endDate);
    const diff  = Math.ceil((((end as any) - (start as any)) / (1000 * 60 * 60 * 24))) + 1;
    numDays = (!isNaN(diff) && diff >= 1) ? diff : 1;
  } catch (e) { numDays = 1; }

  // ── STEP 3: Log exactly what is being sent ───────────────
  console.log("════════════════════════════════════");
  console.log("SENDING TO GROQ:");
  console.log("Origin       :", origin);
  console.log("Destinations :", destinations);
  console.log("Start Date   :", startDate);
  console.log("End Date     :", endDate);
  console.log("Num Days     :", numDays);
  console.log("Themes       :", themes);
  console.log("Pace         :", pace);
  console.log("Accommodation:", accommodation);
  console.log("Food         :", food);
  console.log("Budget       :", budget, currency);
  console.log("Passengers   :", passengers);
  console.log("════════════════════════════════════");

  // ── STEP 4: Build itinerary days template ────────────────
  const itineraryDays = [];
  for (let i = 0; i < numDays; i++) {
    let dateStr = startDate;
    try {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      dateStr = d.toISOString().split("T")[0];
    } catch (e) {}
    itineraryDays.push(`Day ${i + 1} — Date: ${dateStr}`);
  }

  // ── STEP 5: Build the prompt ─────────────────────────────
  const prompt = `You are an expert travel planner. Generate a complete travel itinerary.

USER TRIP DETAILS — USE EXACTLY AS GIVEN BELOW:
================================================
Traveler is going FROM : ${origin}
Traveler is going TO   : ${destinations}
Trip Start Date        : ${startDate}
Trip End Date          : ${endDate}
Total Number of Days   : ${numDays}
Travel Themes          : ${themes}
Travel Pace            : ${pace}
Weather Preference     : ${weather}
Accommodation Type     : ${accommodation}
Food Preference        : ${food}
Transport Mode         : ${travelMode}
Total Budget           : ${budget} ${currency}
Number of Passengers   : ${passengers}
Special Requests       : ${notes}
================================================

MANDATORY RULES — FOLLOW ALL OF THESE:
1. DESTINATION IS ${destinations}. Generate the ENTIRE plan ONLY for ${destinations}.
2. Generate exactly ${numDays} day entries in the itinerary array — one for each day: ${itineraryDays.join(", ")}.
3. Every hotel must be a REAL hotel that physically exists in ${destinations} today.
4. Every restaurant must be a REAL restaurant that physically exists in ${destinations} today.
5. Every attraction must be a REAL place that physically exists in ${destinations} today.
6. Weather must reflect the ACTUAL seasonal climate of ${destinations} during ${startDate} to ${endDate}.
7. All budget numbers must be realistic for ${destinations} in ${currency}.
8. Hotels must match the ${accommodation} preference.
9. Food must match the ${food} preference.
10. Respond with ONLY the JSON object. No markdown. No code fences. No text before or after.

RETURN THIS EXACT JSON — fill every field with real specific data for ${destinations}:

{
  "tripTitle": "Exciting trip title mentioning ${destinations} specifically",
  "origin": "${origin}",
  "destinations": "${destinations}",
  "dates": "${startDate} to ${endDate}",
  "tripHighlights": {
    "narrative": "Write 3 paragraphs specifically about ${destinations}. Mention real neighborhoods, real landmarks, real food culture, real experiences unique to ${destinations}.",
    "weatherSummary": "Real weather summary for ${destinations} during ${startDate} to ${endDate} based on actual seasonal climate",
    "bestTimeNote": "Real note about whether ${startDate} to ${endDate} is a good time to visit ${destinations} and why"
  },
  "weatherAnalysis": {
    "expectedConditions": "Detailed real weather for ${destinations} during ${startDate} to ${endDate} — temperature, rain, humidity",
    "temperatureRange": "Actual temperature range in Celsius for ${destinations} in that period",
    "bestTimeToVisit": "Best season to visit ${destinations} and comparison with chosen dates",
    "packingWeatherTip": "Specific packing tip for ${destinations} weather during ${startDate} to ${endDate}"
  },
  "itinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Real Day 1 activity title in ${destinations}",
      "morning": "Specific morning activity at real named place in ${destinations}",
      "afternoon": "Specific afternoon activity at real named place in ${destinations}",
      "evening": "Specific evening activity at real named place in ${destinations}",
      "night": "Real night recommendation in ${destinations}",
      "foodRecommendations": ["Real restaurant in ${destinations} — dish it is famous for", "Real street food spot in ${destinations} — specific dish"],
      "stayOptions": ["Real ${accommodation} hotel in ${destinations} — location and feature", "Real alternative hotel in ${destinations}"],
      "optionalActivities": ["Real optional activity in ${destinations}", "Real optional experience in ${destinations}"],
      "tip": "Real practical tip for ${destinations} on this day"
    }
  ],
  "realHotels": [
    {
      "name": "Real hotel name in ${destinations}",
      "category": "${accommodation}",
      "location": "Real neighborhood in ${destinations}",
      "highlights": "Real features of this hotel",
      "priceRange": "Price per night in ${currency}",
      "bookingTip": "Real booking tip"
    },
    {
      "name": "Second real hotel in ${destinations}",
      "category": "${accommodation}",
      "location": "Real neighborhood in ${destinations}",
      "highlights": "Real features",
      "priceRange": "Price in ${currency}",
      "bookingTip": "Tip"
    },
    {
      "name": "Third real hotel in ${destinations}",
      "category": "Budget",
      "location": "Real neighborhood in ${destinations}",
      "highlights": "Real features",
      "priceRange": "Price in ${currency}",
      "bookingTip": "Tip"
    }
  ],
  "realRestaurants": [
    {
      "name": "Real restaurant in ${destinations} for ${food}",
      "cuisine": "Specific cuisine",
      "location": "Real area in ${destinations}",
      "mustOrder": "Dish it is known for",
      "priceRange": "Budget or Mid-range or Fine Dining",
      "openHours": "Real hours",
      "tip": "Walk-in or reservation tip"
    },
    {
      "name": "Second real restaurant in ${destinations}",
      "cuisine": "Cuisine",
      "location": "Real area",
      "mustOrder": "Signature dish",
      "priceRange": "Price range",
      "openHours": "Hours",
      "tip": "Tip"
    },
    {
      "name": "Third real restaurant in ${destinations}",
      "cuisine": "Cuisine",
      "location": "Real area",
      "mustOrder": "Dish",
      "priceRange": "Price range",
      "openHours": "Hours",
      "tip": "Tip"
    }
  ],
  "realAttractions": [
    {
      "name": "Real attraction in ${destinations} for ${themes}",
      "category": "Historical or Cultural or Nature or Adventure or Shopping or Religious",
      "location": "Real location in ${destinations}",
      "description": "What visitors do here",
      "entryFee": "Real fee in ${currency} or Free",
      "bestTime": "Best time of day",
      "duration": "Time to spend",
      "tip": "Real visiting tip"
    },
    {
      "name": "Second real attraction in ${destinations}",
      "category": "Category",
      "location": "Real location",
      "description": "What to do",
      "entryFee": "Fee or Free",
      "bestTime": "Best time",
      "duration": "Duration",
      "tip": "Tip"
    },
    {
      "name": "Third real attraction in ${destinations}",
      "category": "Category",
      "location": "Real location",
      "description": "What to do",
      "entryFee": "Fee or Free",
      "bestTime": "Best time",
      "duration": "Duration",
      "tip": "Tip"
    }
  ],
  "topSpots": [
    {
      "name": "Real top spot in ${destinations}",
      "type": "Type of place",
      "description": "Why this is a must-see in ${destinations}",
      "bestTime": "Best time",
      "rating": "4.5"
    },
    {
      "name": "Second top spot in ${destinations}",
      "type": "Type",
      "description": "Why visit",
      "bestTime": "Best time",
      "rating": "4.3"
    }
  ],
  "foodieHotspots": [
    {
      "name": "Real food spot in ${destinations}",
      "cuisine": "Cuisine matching ${food}",
      "priceRange": "Budget or Mid-range or Splurge",
      "description": "Why special in ${destinations}",
      "nearLandmark": "Real nearby landmark in ${destinations}"
    },
    {
      "name": "Second real food spot in ${destinations}",
      "cuisine": "Cuisine",
      "priceRange": "Price range",
      "description": "Why visit",
      "nearLandmark": "Landmark"
    }
  ],
  "localTips": [
    { "category": "Transport", "tip": "Real transport tip for ${destinations}" },
    { "category": "Culture",   "tip": "Real cultural tip for ${destinations}" },
    { "category": "Money",     "tip": "Real money tip for ${destinations}" },
    { "category": "Safety",    "tip": "Real safety tip for ${destinations}" },
    { "category": "Language",  "tip": "Real language tip for ${destinations}" }
  ],
  "localGuides": [
    {
      "name": "Real local guide name in ${destinations}",
      "specialization": "e.g. Historical Tours or Food Tours or Adventure or Cultural or Photography",
      "experience": "e.g. 8 years",
      "languages": ["English", "Hindi", "Local language"],
      "rating": "4.8",
      "reviewCount": "124 reviews",
      "pricePerDay": 50,
      "phone": "realistic local phone number format for ${destinations}",
      "email": "realistic email",
      "description": "One line about what makes this guide special in ${destinations}",
      "topTour": "Their most popular tour in ${destinations}",
      "verified": true,
      "available": true
    }
  ],
  "budgetBreakdown": {
    "currency": "${currency}",
    "totalEstimatedMin": 0,
    "totalEstimatedMax": 0,
    "accommodation": { "min": 0, "max": 0, "percentage": 35 },
    "food":          { "min": 0, "max": 0, "percentage": 20 },
    "activities":    { "min": 0, "max": 0, "percentage": 18 },
    "transport":     { "min": 0, "max": 0, "percentage": 22 },
    "contingency":   { "min": 0, "max": 0, "percentage": 5  }
  },
  "packingChecklist": {
    "clothing":    ["item1 for ${destinations} weather", "item2", "item3"],
    "documents":   ["document1 for ${origin} to ${destinations}", "item2", "item3"],
    "health":      ["health item for ${destinations}", "item2", "item3"],
    "electronics": ["item1", "item2", "item3"],
    "essentials":  ["essential for ${destinations}", "item2", "item3"]
  },
  "bookingLinks": {
    "flights": {
      "route": "${origin} to ${destinations}",
      "providers": [
        { "name": "Google Flights", "url": "https://www.google.com/flights" },
        { "name": "MakeMyTrip",     "url": "https://www.makemytrip.com/flights/" },
        { "name": "Skyscanner",     "url": "https://www.skyscanner.co.in" },
        { "name": "Cleartrip",      "url": "https://www.cleartrip.com/flights/" }
      ]
    },
    "hotels": {
      "providers": [
        { "name": "Booking.com",        "url": "https://www.booking.com" },
        { "name": "MakeMyTrip Hotels",  "url": "https://www.makemytrip.com/hotels/" },
        { "name": "Airbnb",             "url": "https://www.airbnb.com" },
        { "name": "OYO Rooms",          "url": "https://www.oyorooms.com" }
      ]
    },
    "activities": {
      "providers": [
        { "name": "Klook",         "url": "https://www.klook.com" },
        { "name": "GetYourGuide",  "url": "https://www.getyourguide.com" },
        { "name": "Viator",        "url": "https://www.viator.com" },
        { "name": "TripAdvisor",   "url": "https://www.tripadvisor.com" }
      ]
    }
  }
}`;

  // ── STEP 6: Call Groq API with model fallback ─────────────
  const MODELS_TO_TRY = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768"
  ];

  let response;
  let lastErrorMessage = "";

  for (const model of MODELS_TO_TRY) {
    console.log("Trying model:", model);
    try {
      response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAPIKey()}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are a strict travel planning assistant. Always respond with valid raw JSON only. No markdown. No code fences. No text before or after JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 8000,
          stream: false
        })
      });

      const responseClone = response.clone();
      const responseData  = await responseClone.json();
      console.log("Model:", model, "Status:", response.status);
      console.log("Groq raw response preview:", JSON.stringify(responseData).substring(0, 200));

      if (response.ok && responseData?.choices?.[0]?.message?.content) {
        console.log("Model succeeded:", model);
        const rawText = responseData.choices[0].message.content;

        const cleaned = rawText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```\s*$/i, "")
          .replace(/^[^{[]*/, "")
          .replace(/[^}\]]*$/, "")
          .trim();

        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch (e) {
          const match = cleaned.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          } else {
            throw new Error("Could not parse JSON from Groq response");
          }
        }

        console.log("Successfully parsed plan for:", parsed?.destinations);
        
        // Ensure passengers is included in the plan object
        if (!parsed.passengers) {
          parsed.passengers = formData.passengers || "1 adult";
        }

        return sanitizeTripPlan(parsed);
      }

      if (responseData?.error) {
        lastErrorMessage = responseData.error.message || "";
        console.warn("Model", model, "error:", lastErrorMessage);

        if (response.status === 401) {
          throw new Error("GROQ_AUTH: Invalid Groq API key. Go to console.groq.com/keys and generate a new key.");
        }
        if (response.status === 429 || lastErrorMessage.toLowerCase().includes("rate limit")) {
          console.warn("Rate limited on:", model, "— trying next model");
          continue;
        }
      }

    } catch (err: any) {
      if (err.message.startsWith("GROQ_AUTH")) throw err;
      lastErrorMessage = err.message;
      console.warn("Error on model:", model, err.message);
      continue;
    }
  }

  // All models failed
  if (lastErrorMessage.toLowerCase().includes("rate limit") || lastErrorMessage.toLowerCase().includes("quota")) {
    throw new Error("Groq free tier limit reached. Wait 1-2 minutes and try again. If it keeps failing, your daily limit may be exhausted — try again tomorrow.");
  }
  if (lastErrorMessage.toLowerCase().includes("invalid") || lastErrorMessage.toLowerCase().includes("auth")) {
    throw new Error("Groq API key is invalid. Get a new key at console.groq.com/keys and update GROQ_API_KEY.");
  }
  throw new Error("All Groq models failed. Last error: " + lastErrorMessage);
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Helper for rule-based analysis fallback
function performRuleBasedAnalysis(description: string, categoryHint?: string) {
  const text = (description || "").toLowerCase();

  let category = "Garbage Overflow";
  let severity: "Low" | "Medium" | "High" | "Critical" = "Medium";
  let confidence = 0.88;
  let explanation = "Visual waste accumulation detected requiring standard municipal sanitation intervention.";
  let recommendedAction = "Dispatch municipal cleaning team with pickup vehicle within 12 hours.";

  if (text.includes("fire") || text.includes("burn") || text.includes("smoke") || text.includes("flame")) {
    category = "Open Garbage Burning";
    severity = "Critical";
    confidence = 0.95;
    explanation = "Combustion of municipal solid waste releases toxic dioxins and particulate matter. Immediate public hazard.";
    recommendedAction = "Alert fire department / emergency sanitation team immediately and extinguish open burn.";
  } else if (text.includes("drain") || text.includes("sewage") || text.includes("clog") || text.includes("waterlog") || text.includes("gutter") || text.includes("stagnant")) {
    category = "Blocked Storm Drain & Sewage";
    severity = "High";
    confidence = 0.92;
    explanation = "Severe blockage in drainage network causing sewage overflow and potential disease vector breeding.";
    recommendedAction = "Deploy desilting suction truck and clearance crew to clear obstruction.";
  } else if (text.includes("debris") || text.includes("construction") || text.includes("concrete") || text.includes("rubble") || text.includes("malba") || text.includes("brick")) {
    category = "Construction & Demolition Waste";
    severity = "Medium";
    confidence = 0.90;
    explanation = "Illegal dumping of construction malba blocking pedestrian footpath and road shoulder.";
    recommendedAction = "Issue notice to contractor and dispatch hydraulic dumper for heavy debris removal.";
  } else if (text.includes("illegal") || text.includes("night") || text.includes("truck") || text.includes("toxic") || text.includes("hazard") || text.includes("hospital") || text.includes("chemical")) {
    category = "Illegal Hazardous Dumping";
    severity = "Critical";
    confidence = 0.96;
    explanation = "Unauthorized dumping of restricted industrial/bio-medical or mass illegal commercial waste.";
    recommendedAction = "Escalate to GVMC Enforcement Wing and local Police Station for CCTV inspection and FIR.";
  } else if (text.includes("park") || text.includes("beach") || text.includes("plastic") || text.includes("litter") || text.includes("bottle") || text.includes("wrapper")) {
    category = "Unclean Public Space";
    severity = "Low";
    confidence = 0.89;
    explanation = "Scattered non-biodegradable plastics and dry litter in a public recreational space.";
    recommendedAction = "Assign designated sweepers for manual collection and segregated bin placement.";
  } else if (text.includes("dead animal") || text.includes("carcass") || text.includes("stench") || text.includes("smell")) {
    category = "Biohazard / Animal Carcass";
    severity = "Critical";
    confidence = 0.97;
    explanation = "Biological hazard creating acute public health emergency and severe foul odor.";
    recommendedAction = "Deploy specialized veterinary bio-containment vehicle within 2 hours.";
  } else {
    // Default garbage overflow
    if (text.includes("overflow") || text.includes("spill") || text.includes("huge") || text.includes("pile") || text.includes("mountain")) {
      severity = "High";
      confidence = 0.94;
      explanation = "Massive overflow exceeding bin capacity, encroaching onto public thoroughfare.";
      recommendedAction = "Dispatch compactor truck for urgent bulk container clearance.";
    }
  }

  // Priority formula
  let priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  if (severity === "Critical") priority = "CRITICAL";
  else if (severity === "High") priority = "HIGH";
  else if (severity === "Low") priority = "LOW";

  return {
    category,
    severity,
    confidence,
    explanation,
    recommendedAction,
    priority,
    isAiGenerated: false,
    engine: "CleanCity Intelligent Rule-Based Engine v2.4 (GVMC Civic Rules)"
  };
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "CleanCity Civic AI API",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// AI Complaint Analysis endpoint
app.post("/api/analyze-complaint", async (req, res) => {
  const { imageBase64, mimeType, description, location } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful fallback to rule-based analysis
    const result = performRuleBasedAnalysis(description || "");
    return res.json({
      ...result,
      note: "Analyzed using CleanCity Intelligent Civic Rule Engine (Gemini API key not configured in environment)."
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are the AI Sanitation Inspector for CleanCity, a platform operating in Greater Visakhapatnam Municipal Corporation (GVMC) in partnership with SITAM.
Analyze this sanitation complaint.
Location provided: "${location || "Not specified"}"
Citizen complaint text: "${description || "No description provided"}"

Respond with ONLY a valid JSON object (no markdown, no backticks, no extra text) with these exact keys:
{
  "category": "One of: Garbage Overflow, Illegal Dumping, Open Garbage Burning, Blocked Storm Drain & Sewage, Construction & Demolition Waste, Unclean Public Space, Biohazard / Animal Carcass",
  "severity": "One of: Low, Medium, High, Critical",
  "confidence": 0.85 to 0.99,
  "explanation": "2-3 concise sentences detailing what sanitation issue is identified and its environmental/public health impact",
  "recommendedAction": "1-2 actionable instructions for the GVMC field worker and sanitation supervisor",
  "priority": "One of: LOW, MEDIUM, HIGH, CRITICAL",
  "wardSuggestion": "Suggested GVMC Ward/Zone (e.g. Zone 2 - MVP Colony or Zone 1 - Dwaraka Nagar)",
  "hazardousEscalationRequired": true or false
}`;

    const contents: any[] = [];

    if (imageBase64) {
      // Remove data url header if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: cleanBase64
        }
      });
    }

    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    const rawText = response.text || "";
    // Clean potential markdown blocks
    const cleanedJsonText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanedJsonText);

    return res.json({
      category: parsed.category || "Garbage Overflow",
      severity: parsed.severity || "High",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.94,
      explanation: parsed.explanation || "Identified waste accumulation requiring prompt municipal action.",
      recommendedAction: parsed.recommendedAction || "Dispatch sanitation field crew for collection.",
      priority: parsed.priority || (parsed.severity === "Critical" ? "CRITICAL" : parsed.severity === "High" ? "HIGH" : "MEDIUM"),
      wardSuggestion: parsed.wardSuggestion,
      hazardousEscalationRequired: Boolean(parsed.hazardousEscalationRequired),
      isAiGenerated: true,
      engine: "Google Gemini 2.5 Flash Multimodal Vision"
    });
  } catch (error: any) {
    console.error("Gemini API analysis failed, falling back to rule-based engine:", error?.message);
    const fallback = performRuleBasedAnalysis(description || "");
    return res.json({
      ...fallback,
      note: "Analyzed using CleanCity Intelligent Civic Rule Engine (Gemini fallback)."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CleanCity server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Helper for rule-based analysis fallback
function performRuleBasedAnalysis(description: string, locationHint?: string) {
  const text = (description || "").toLowerCase();

  let category = "Garbage Overflow";
  let severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  let confidence = 0.88;
  let explanation = "Visual municipal waste accumulation detected requiring prompt civic sanitation intervention.";
  let recommendedAction = "Dispatch municipal cleaning team with pickup vehicle within 12 hours.";
  let priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  let hazardousEscalationRequired = false;

  if (text.includes("fire") || text.includes("burn") || text.includes("smoke") || text.includes("flame")) {
    category = "Open Garbage Burning";
    severity = "CRITICAL";
    priority = "CRITICAL";
    confidence = 0.95;
    hazardousEscalationRequired = true;
    explanation = "Combustion of municipal solid waste releases toxic dioxins and particulate matter. Immediate public respiratory hazard.";
    recommendedAction = "Alert fire department / emergency sanitation team immediately and extinguish open burn.";
  } else if (text.includes("drain") || text.includes("sewage") || text.includes("clog") || text.includes("waterlog") || text.includes("gutter") || text.includes("stagnant") || text.includes("manhole")) {
    category = "Blocked Storm Drain & Sewage";
    severity = "HIGH";
    priority = "HIGH";
    confidence = 0.93;
    explanation = "Severe blockage in stormwater drainage network causing sewage overflow and potential disease vector breeding.";
    recommendedAction = "Deploy desilting suction truck and clearance crew to clear obstruction.";
  } else if (text.includes("debris") || text.includes("construction") || text.includes("concrete") || text.includes("rubble") || text.includes("malba") || text.includes("brick")) {
    category = "Construction & Demolition Waste";
    severity = "HIGH";
    priority = "HIGH";
    confidence = 0.91;
    explanation = "Illegal dumping of construction malba blocking pedestrian footpath and vehicular road shoulder.";
    recommendedAction = "Issue notice to contractor and dispatch hydraulic dumper for heavy debris removal.";
  } else if (text.includes("illegal") || text.includes("chemical") || text.includes("toxic") || text.includes("hazard") || text.includes("hospital") || text.includes("sludge") || text.includes("drums")) {
    category = "Illegal Hazardous Dumping";
    severity = "CRITICAL";
    priority = "CRITICAL";
    confidence = 0.96;
    hazardousEscalationRequired = true;
    explanation = "Unauthorized dumping of restricted industrial, bio-medical, or mass hazardous commercial waste.";
    recommendedAction = "Escalate to GVMC Enforcement Wing and local Police Station for CCTV inspection and vehicle seizure.";
  } else if (text.includes("park") || text.includes("beach") || text.includes("plastic") || text.includes("litter") || text.includes("bottle") || text.includes("wrapper")) {
    category = "Unclean Public Space";
    severity = "LOW";
    priority = "LOW";
    confidence = 0.89;
    explanation = "Scattered non-biodegradable plastics and dry litter in a public recreational space.";
    recommendedAction = "Assign designated sweepers for manual collection and segregated bin placement.";
  } else if (text.includes("dead animal") || text.includes("carcass") || text.includes("stench") || text.includes("dog died")) {
    category = "Biohazard / Animal Carcass";
    severity = "CRITICAL";
    priority = "CRITICAL";
    confidence = 0.98;
    hazardousEscalationRequired = true;
    explanation = "Biological hazard creating acute public health emergency, disease vectors, and severe foul odor.";
    recommendedAction = "Deploy specialized veterinary bio-containment vehicle within 2 hours.";
  } else {
    // Default garbage overflow
    if (text.includes("overflow") || text.includes("spill") || text.includes("huge") || text.includes("pile") || text.includes("mountain") || text.includes("days")) {
      severity = "HIGH";
      priority = "HIGH";
      confidence = 0.94;
      explanation = "Massive overflow exceeding bin capacity, encroaching onto public thoroughfare.";
      recommendedAction = "Dispatch compactor truck for urgent bulk container clearance.";
    }
  }

  return {
    category,
    severity,
    confidence,
    explanation,
    recommendedAction,
    priority,
    isAiGenerated: false,
    engine: "CleanCity Intelligent Rule-Based Civic Engine v2.5",
    hazardousEscalationRequired,
  };
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "CleanCity Civic AI API",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Complaint Analysis endpoint
app.post("/api/analyze-complaint", async (req, res) => {
  const { imageBase64, mimeType, description, location } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const result = performRuleBasedAnalysis(description || "", location);
    return res.json({
      ...result,
      note: "AI analysis completed via CleanCity Intelligent Civic Rule Engine (Gemini API key not configured in environment).",
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const promptText = `You are the Lead AI Municipal Sanitation Inspector for CleanCity, operating for Greater Visakhapatnam Municipal Corporation (GVMC) in partnership with SITAM.
Analyze this civic sanitation report.
Location reported: "${location || "Unspecified Visakhapatnam"}"
Citizen text description: "${description || "Visual complaint image attached"}"

Perform a thorough sanitation audit:
1. Identify the exact civic category.
2. Determine severity level: LOW, MEDIUM, HIGH, or CRITICAL.
3. Determine priority level: LOW, MEDIUM, HIGH, or CRITICAL.
4. Estimate diagnostic confidence score between 0.85 and 0.99.
5. Provide a 2-3 sentence objective explanation of the civic issue, public hazard, or environmental impact.
6. Provide specific, actionable recommendation for GVMC sanitary field workers and zonal dispatchers.
7. Flag if hazardous escalation (police/fire/health vigilance) is required.
8. Suggest appropriate GVMC ward/zone if determinable.`;

    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "Sanitation category, e.g., Garbage Overflow, Illegal Hazardous Dumping, Open Garbage Burning, Blocked Storm Drain & Sewage, Construction & Demolition Waste, Unclean Public Space, Biohazard / Animal Carcass",
            },
            severity: {
              type: Type.STRING,
              description: "One of: LOW, MEDIUM, HIGH, CRITICAL",
            },
            priority: {
              type: Type.STRING,
              description: "One of: LOW, MEDIUM, HIGH, CRITICAL",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence rating between 0.85 and 0.99",
            },
            explanation: {
              type: Type.STRING,
              description: "2-3 concise sentences detailing what sanitation issue is identified and its environmental/public health impact",
            },
            recommendedAction: {
              type: Type.STRING,
              description: "Actionable instructions for the GVMC field worker and sanitation supervisor",
            },
            wardSuggestion: {
              type: Type.STRING,
              description: "Suggested GVMC Ward/Zone",
            },
            hazardousEscalationRequired: {
              type: Type.BOOLEAN,
              description: "Whether immediate police, fire, or veterinary escalation is needed",
            },
          },
          required: ["category", "severity", "confidence", "explanation", "recommendedAction", "priority"],
        },
      },
    });

    const rawText = response.text || "";
    const parsed = JSON.parse(rawText.trim());

    // Normalize severity & priority to uppercase
    const severity = (parsed.severity || "MEDIUM").toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    const priority = (parsed.priority || severity).toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

    return res.json({
      category: parsed.category || "Garbage Overflow",
      severity,
      priority,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.94,
      explanation: parsed.explanation || "Municipal waste accumulation identified requiring prompt civic sanitation intervention.",
      recommendedAction: parsed.recommendedAction || "Dispatch sanitation field crew for collection.",
      wardSuggestion: parsed.wardSuggestion,
      hazardousEscalationRequired: Boolean(parsed.hazardousEscalationRequired),
      isAiGenerated: true,
      engine: "Google Gemini 3.8 Flash Vision",
    });
  } catch (error: any) {
    console.error("Gemini API call failed, switching to intelligent civic rule engine fallback:", error?.message);
    const fallback = performRuleBasedAnalysis(description || "", location);
    return res.json({
      ...fallback,
      note: "AI analysis completed via CleanCity Intelligent Civic Rule Engine (Gemini fallback).",
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

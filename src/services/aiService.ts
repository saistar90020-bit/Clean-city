import { AIAnalysisResult, ComplaintPriority, ComplaintSeverity } from "../types";

export interface AnalyzeComplaintParams {
  imageBase64?: string;
  mimeType?: string;
  description: string;
  location?: string;
}

/**
 * Intelligent Client-Side Civic Rule Engine.
 * Formulated under GVMC Solid Waste Bylaws and AP Municipal Sanitation Guidelines.
 * Used when backend AI endpoint is unavailable, network is offline,
 * or when Gemini API key is not configured.
 */
export function performClientRuleAnalysis(description: string, location?: string): AIAnalysisResult {
  const text = (description || "").toLowerCase();

  let category = "Garbage Overflow";
  let severity: ComplaintSeverity = "MEDIUM";
  let confidence = 0.88;
  let explanation = "Visual municipal waste accumulation identified requiring prompt civic sanitation intervention.";
  let recommendedAction = "Dispatch municipal collection vehicle with 2 sanitary workers within 12 hours.";
  let priority: ComplaintPriority = "MEDIUM";
  let hazardousEscalationRequired = false;

  if (text.includes("fire") || text.includes("burn") || text.includes("smoke") || text.includes("flame")) {
    category = "Open Garbage Burning";
    severity = "CRITICAL";
    priority = "CRITICAL";
    confidence = 0.96;
    hazardousEscalationRequired = true;
    explanation = "Illegal combustion of solid waste releasing toxic chlorinated compounds and fine particulate matter. Direct hazard to public respiratory health.";
    recommendedAction = "Deploy municipal water bowser immediately to extinguish flames, notify local police beat for environmental violation challan.";
  } else if (text.includes("chemical") || text.includes("toxic") || text.includes("hospital") || text.includes("industrial") || text.includes("drum") || text.includes("sludge")) {
    category = "Illegal Hazardous Dumping";
    severity = "CRITICAL";
    priority = "CRITICAL";
    confidence = 0.95;
    hazardousEscalationRequired = true;
    explanation = "Suspected hazardous or unauthorized industrial waste dumping encroaching on public terrain. High risk of groundwater poisoning.";
    recommendedAction = "Escalate to GVMC Industrial Vigilance and notify Local Police Station for forensic inspection and vehicle seizure.";
  } else if (text.includes("drain") || text.includes("sewage") || text.includes("clog") || text.includes("waterlog") || text.includes("gutter") || text.includes("manhole") || text.includes("stagnant")) {
    category = "Blocked Storm Drain & Sewage";
    severity = "HIGH";
    priority = "HIGH";
    confidence = 0.93;
    explanation = "Severe stormwater drainage constriction with sewage backflow. Poses acute risk of urban waterlogging and mosquito-borne vector transmission.";
    recommendedAction = "Mobilize mechanical jetting-cum-suction tanker to de-silt drain line and apply anti-larval chemical spray.";
  } else if (text.includes("debris") || text.includes("construction") || text.includes("concrete") || text.includes("rubble") || text.includes("malba") || text.includes("brick") || text.includes("tiles")) {
    category = "Construction & Demolition Waste";
    severity = "HIGH";
    priority = "HIGH";
    confidence = 0.91;
    explanation = "Heavy construction debris dumped on public thoroughfare obstructing pedestrian walking and vehicular traffic flow.";
    recommendedAction = "Issue notice to contractor under GVMC Solid Waste Bylaws and assign hydraulic tipper truck for rubble lifting.";
  } else if (text.includes("dead animal") || text.includes("carcass") || text.includes("corpse") || text.includes("dog died")) {
    category = "Biohazard / Animal Carcass";
    severity = "CRITICAL";
    priority = "CRITICAL";
    confidence = 0.98;
    hazardousEscalationRequired = true;
    explanation = "Biological decaying matter creating imminent infectious disease vectors and intense sanitary nuisance.";
    recommendedAction = "Urgent dispatch of GVMC Veterinary dead-animal van with bio-protective containment and lime disinfectant.";
  } else if (text.includes("park") || text.includes("beach") || text.includes("wrapper") || text.includes("plastic") || text.includes("cup") || text.includes("litter")) {
    category = "Unclean Public Space";
    severity = "LOW";
    priority = "LOW";
    confidence = 0.90;
    explanation = "Scattered non-biodegradable tourist/recreational litter along civic leisure amenity.";
    recommendedAction = "Schedule routine sweep with manual litter-pickers and install additional twin-bin segregators.";
  } else {
    // Check overflow severity
    if (text.includes("overflow") || text.includes("huge") || text.includes("spill") || text.includes("dump") || text.includes("mountain") || text.includes("days")) {
      severity = "HIGH";
      priority = "HIGH";
      confidence = 0.94;
      explanation = "Overflowing community garbage container spilling across the roadway with high odor and stray animal scavenging.";
      recommendedAction = "Deploy GVMC hydraulic compactor dumper for urgent container clearance and surrounding sanitization.";
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
    engine: "CleanCity Intelligent Civic Rule Engine v2.5",
    note: "Civic audit calculated using offline intelligent rule engine (deterministic fallback).",
    hazardousEscalationRequired,
  };
}

/**
 * Main AI Complaint Analysis function.
 * Tries server-side Gemini 3.8 Flash Vision API first, then gracefully falls back
 * to the intelligent civic rule-based analysis.
 */
export async function analyzeComplaint(params: AnalyzeComplaintParams): Promise<AIAnalysisResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000); // 14s timeout

    const response = await fetch("/api/analyze-complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const severity = ((data.severity || "MEDIUM") as string).toUpperCase() as ComplaintSeverity;
      const priority = ((data.priority || severity) as string).toUpperCase() as ComplaintPriority;

      return {
        category: data.category || "Garbage Overflow",
        severity,
        priority,
        confidence: typeof data.confidence === "number" ? data.confidence : 0.94,
        explanation: data.explanation || "Sanitation problem identified from image and description.",
        recommendedAction: data.recommendedAction || "Dispatch field worker for inspection and cleaning.",
        isAiGenerated: Boolean(data.isAiGenerated),
        engine: data.engine || (data.isAiGenerated ? "Google Gemini 3.8 Flash Vision" : "CleanCity Civic Engine"),
        note: data.note,
        wardSuggestion: data.wardSuggestion,
        hazardousEscalationRequired: Boolean(data.hazardousEscalationRequired),
      };
    }
  } catch (err) {
    console.warn("Server AI analysis call timed out or failed, switching to intelligent client engine fallback:", err);
  }

  // Client-side intelligent fallback
  return performClientRuleAnalysis(params.description, params.location);
}

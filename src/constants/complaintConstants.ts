export const COMPLAINT_CATEGORIES = [
  "Garbage Overflow",
  "Illegal Hazardous Dumping",
  "Open Garbage Burning",
  "Blocked Storm Drain & Sewage",
  "Construction & Demolition Waste",
  "Unclean Public Space",
  "Biohazard / Animal Carcass",
] as const;

export type ComplaintCategory = typeof COMPLAINT_CATEGORIES[number];

export const COMPLAINT_SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const COMPLAINT_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export const OFFICIAL_LIFECYCLE_STEPS = [
  { status: "REPORTED", label: "Reported", description: "Citizen logged issue with geo-tagged photo evidence" },
  { status: "AI_ANALYZED", label: "AI Analyzed", description: "Multi-modal vision audit classified severity & category" },
  { status: "ASSIGNED", label: "Assigned", description: "Dispatched to GVMC zonal sanitary worker" },
  { status: "IN_PROGRESS", label: "In Progress", description: "Field crew active on site with cleaning equipment" },
  { status: "RESOLUTION_SUBMITTED", label: "Resolution Submitted", description: "Worker uploaded photographic proof of cleanup" },
  { status: "VERIFIED", label: "Verified", description: "Municipal inspector verified sanitation standards" },
  { status: "RESOLVED", label: "Resolved", description: "Complaint closed and citizen notified" },
] as const;

export const GVMC_ZONES_DATA = [
  { id: "zone-1", name: "Zone 1 (Dwaraka Nagar / Jagadamba)", wards: ["Ward 24", "Ward 28", "Ward 29"], leadWorker: "Priya Sharma" },
  { id: "zone-2", name: "Zone 2 (MVP Colony / Siripuram / RK Beach)", wards: ["Ward 18", "Ward 21", "Ward 22"], leadWorker: "Ramesh Kumar" },
  { id: "zone-3", name: "Zone 3 (Gajuwaka / Industrial Corridor)", wards: ["Ward 65", "Ward 66", "Ward 67"], leadWorker: "Suresh Babu" },
  { id: "zone-4", name: "Zone 4 (Madhurawada / Rushikonda)", wards: ["Ward 07", "Ward 08", "Ward 09"], leadWorker: "Lakshmi K." },
  { id: "zone-5", name: "Zone 5 (Pendurthi / Simhachalam)", wards: ["Ward 72", "Ward 73", "Ward 74"], leadWorker: "K. Venkatesh" },
];

export const INSTITUTIONAL_INFO = {
  sitam: {
    fullName: "Satya Institute of Technology and Management",
    location: "Vizianagaram / Visakhapatnam",
    role: "Academic Innovation & AI Research Partner",
    established: "Since 1996",
  },
  gvmc: {
    fullName: "Greater Visakhapatnam Municipal Corporation",
    location: "Visakhapatnam, Andhra Pradesh",
    role: "Municipal Governance & Sanitation Authority",
    tagline: "Clean, Green & Smart Vizag",
  },
  police: {
    fullName: "Andhra Pradesh Police",
    location: "Visakhapatnam City Police Commissionerate",
    role: "Public Safety & Environmental Enforcement Partner",
    tagline: "Duty, Honor, Courage",
  },
};

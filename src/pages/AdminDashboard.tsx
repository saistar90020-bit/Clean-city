import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { PriorityBadge, SeverityBadge, StatusBadge } from "../components/StatusBadge";
import { MapVisualization } from "../components/MapVisualization";
import { InstitutionLogo } from "../components/InstitutionLogo";
import { MUNICIPAL_WORKERS } from "../data/initialData";
import { Complaint, ComplaintPriority, ComplaintStatus } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  UserCheck, 
  ShieldCheck, 
  TrendingUp, 
  RefreshCw,
  MapPin,
  Flame,
  ArrowUpDown
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { 
    complaints, 
    auth, 
    viewComplaintDetails, 
    assignWorkerToComplaint,
    verifyComplaintResolution,
    resetToDefaultData 
  } = useApp();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");

  // Re-assignment modal state
  const [reassignModalComplaint, setReassignModalComplaint] = useState<Complaint | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState(MUNICIPAL_WORKERS[0].id);

  // Active chart view toggle
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");

  // 1. KPI Calculations
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "REPORTED" || c.status === "ASSIGNED").length;
  const inProgressCount = complaints.filter((c) => c.status === "IN PROGRESS" || c.status === "RESOLUTION SUBMITTED").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;
  const criticalCount = complaints.filter((c) => c.priority === "CRITICAL" && c.status !== "RESOLVED").length;

  // 2. Filtered complaints table
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.assignedWorker?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" ? true : c.status === statusFilter;
      const matchPriority = priorityFilter === "all" ? true : c.priority === priorityFilter;
      const matchCategory = categoryFilter === "all" ? true : c.category === categoryFilter;
      const matchZone = zoneFilter === "all" ? true : c.location.zone.includes(zoneFilter);

      return matchSearch && matchStatus && matchPriority && matchCategory && matchZone;
    });
  }, [complaints, searchQuery, statusFilter, priorityFilter, categoryFilter, zoneFilter]);

  // 3. Category Data for Bar Chart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      // shorten category label for chart
      const shortName = c.category.replace(" & Sewage", "").replace(" & Demolition", "");
      counts[shortName] = (counts[shortName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, count: value }));
  }, [complaints]);

  // 4. Severity Distribution Data for Donut Chart
  const severityData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    complaints.forEach((c) => {
      if (counts[c.severity] !== undefined) counts[c.severity]++;
    });
    return [
      { name: "Critical", value: counts.Critical, color: "#e11d48" },
      { name: "High", value: counts.High, color: "#f59e0b" },
      { name: "Medium", value: counts.Medium, color: "#eab308" },
      { name: "Low", value: counts.Low, color: "#047857" },
    ];
  }, [complaints]);

  // 5. Weekly / Monthly Trend Data
  const weeklyTrendData = [
    { name: "Mon", reported: 42, resolved: 38 },
    { name: "Tue", reported: 55, resolved: 49 },
    { name: "Wed", reported: 68, resolved: 61 },
    { name: "Thu", reported: 51, resolved: 48 },
    { name: "Fri", reported: 73, resolved: 65 },
    { name: "Sat", reported: 89, resolved: 82 },
    { name: "Sun", reported: 64, resolved: 62 },
  ];

  const monthlyTrendData = [
    { name: "Jan", reported: 1240, resolved: 1120 },
    { name: "Feb", reported: 1380, resolved: 1290 },
    { name: "Mar", reported: 1590, resolved: 1470 },
    { name: "Apr", reported: 1820, resolved: 1690 },
    { name: "May", reported: 2100, resolved: 1950 },
    { name: "Jun", reported: 1980, resolved: 1840 },
    { name: "Jul", reported: 2280, resolved: 2110 },
    { name: "Aug", reported: 2450, resolved: 2350 },
  ];

  const trendData = timeRange === "weekly" ? weeklyTrendData : monthlyTrendData;

  // 6. Ward/Zone Distribution Data
  const zoneDistribution = [
    { zone: "Zone 1 (Central)", total: 34, resolved: 28 },
    { zone: "Zone 2 (East)", total: 42, resolved: 35 },
    { zone: "Zone 3 (South)", total: 29, resolved: 22 },
    { zone: "Zone 4 (North)", total: 31, resolved: 27 },
  ];

  const handleReassignSubmit = () => {
    if (reassignModalComplaint) {
      assignWorkerToComplaint(reassignModalComplaint.id, selectedWorkerId);
      setReassignModalComplaint(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Category", "Severity", "Priority", "Status", "Ward", "Zone", "Address", "Worker", "Date"];
    const rows = filteredComplaints.map((c) => [
      c.id,
      `"${c.category}"`,
      c.severity,
      c.priority,
      c.status,
      c.location.ward,
      c.location.zone,
      `"${c.location.address}"`,
      `"${c.assignedWorker?.name || "Unassigned"}"`,
      c.reportedAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CleanCity_GVMC_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Municipal Command Center Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Official GVMC Municipal Command Center
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Real-Time Sanitation Vigilance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              CleanCity Municipal Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Collaborative Governance Platform: Satya Institute of Technology and Management (SITAM), Greater Visakhapatnam Municipal Corporation (GVMC) & AP Police
            </p>
          </div>

          {/* Right Brand Group */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shrink-0">
            <InstitutionLogo type="sitam" />
            <span className="text-slate-400 text-sm font-light">|</span>
            <InstitutionLogo type="gvmc" />
            <span className="text-slate-400 text-sm font-light hidden sm:inline">|</span>
            <div className="hidden sm:block">
              <InstitutionLogo type="police" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS (Total, Pending, In Progress, Resolved, Critical, Avg Resolution Time) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Handled
          </span>
          <div className="text-2xl font-black text-slate-900">
            {totalComplaints + 12450}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">All 89 GVMC Wards</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
            Pending Dispatch
          </span>
          <div className="text-2xl font-black text-amber-600">
            {pendingCount}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Awaiting action</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
            In Progress
          </span>
          <div className="text-2xl font-black text-blue-600">
            {inProgressCount}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Field crews active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Resolved & Verified
          </span>
          <div className="text-2xl font-black text-emerald-800">
            {resolvedCount}
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
            {Math.round((resolvedCount / Math.max(1, totalComplaints)) * 100)}% resolution rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Critical Alerts</span>
          </span>
          <div className="text-2xl font-black text-rose-600">
            {criticalCount}
          </div>
          <span className="text-[10px] text-rose-600 font-semibold">Police/Hazard notified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Avg Resolution
          </span>
          <div className="text-2xl font-black text-indigo-600">
            3.4 <span className="text-xs font-semibold text-slate-500">hrs</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold">↓ 24% with AI dispatch</span>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Trend over time */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Complaint Intake vs Resolution Trend
              </h3>
              <p className="text-xs text-slate-500">
                Civic complaints logged vs municipal closures
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeRange("weekly")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  timeRange === "weekly" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange("monthly")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  timeRange === "monthly" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Area type="monotone" dataKey="reported" name="Complaints Logged" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReported)" />
                <Area type="monotone" dataKey="resolved" name="Complaints Resolved" stroke="#047857" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Severity Distribution Pie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              AI Severity Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Multi-modal classification distribution
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <MapVisualization
        complaints={complaints}
        onSelectComplaint={(c) => viewComplaintDetails(c.id)}
      />

      {/* FULL COMPLAINTS MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                GVMC Sanitation Complaints Directory ({filteredComplaints.length})
              </h2>
              <p className="text-xs text-slate-500">
                Monitor field worker assignments, inspect AI audit telemetry, and manage case resolution status
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="py-2 px-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={resetToDefaultData}
                title="Reset to fresh demo sample data"
                className="p-2 rounded-xl border border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, area, worker..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="RESOLUTION SUBMITTED">Proof Uploaded</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="Garbage Overflow">Garbage Overflow</option>
              <option value="Illegal Hazardous Dumping">Illegal Dumping</option>
              <option value="Open Garbage Burning">Open Burning</option>
              <option value="Blocked Storm Drain & Sewage">Blocked Drain</option>
              <option value="Construction & Demolition Waste">C&D Waste</option>
              <option value="Unclean Public Space">Unclean Space</option>
            </select>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
            >
              <option value="all">All GVMC Zones</option>
              <option value="Zone 1">Zone 1 (Central)</option>
              <option value="Zone 2">Zone 2 (East / MVP)</option>
              <option value="Zone 3">Zone 3 (South / Gajuwaka)</option>
              <option value="Zone 4">Zone 4 (North / Madhurawada)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Category & Photo</th>
                <th className="py-3 px-4">GVMC Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Worker</th>
                <th className="py-3 px-4">Reported</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No complaints match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {item.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.imageUrl}
                          alt={item.category}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 block truncate max-w-[160px]">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {Math.round(item.aiAnalysis.confidence * 100)}% AI Conf.
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium truncate max-w-[170px]">
                        {item.location.ward}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                        {item.location.zone} • {item.location.address}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      {item.assignedWorker ? (
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{item.assignedWorker.name}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReassignModalComplaint(item)}
                          className="text-amber-700 hover:underline text-[11px] font-bold"
                        >
                          + Assign Worker
                        </button>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.reportedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => viewComplaintDetails(item.id)}
                          title="View Details"
                          className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setReassignModalComplaint(item)}
                          title="Reassign Worker"
                          className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>

                        {item.status === "RESOLUTION SUBMITTED" && (
                          <button
                            onClick={() => verifyComplaintResolution(item.id)}
                            title="Verify Resolution"
                            className="py-1 px-2 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 transition cursor-pointer"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Re-Assignment Modal */}
      {reassignModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Assign Field Worker
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dispatch complaint <span className="font-bold text-slate-800">{reassignModalComplaint.id}</span> ({reassignModalComplaint.category})
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Municipal Sanitation Worker
              </label>
              {MUNICIPAL_WORKERS.map((worker) => (
                <label
                  key={worker.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedWorkerId === worker.id
                      ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="worker"
                      checked={selectedWorkerId === worker.id}
                      onChange={() => setSelectedWorkerId(worker.id)}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {worker.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {worker.zone} • {worker.department}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {worker.phone}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReassignModalComplaint(null)}
                className="flex-1 py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReassignSubmit}
                className="flex-1 py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer transition"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

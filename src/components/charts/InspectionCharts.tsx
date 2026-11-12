import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { groupRecords, formatDate } from "../../lib/inspectionData";
import type { InspectionRecord } from "../../types/inspection";
const palette = ["#38bdf8", "#818cf8", "#34d399"];
const tooltip = {
  background: "#151f30",
  border: "1px solid #34445b",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "12px",
};

function ChartCard({
  title,
  subtitle,
  children,
  label,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <section className="panel chart-card">
      <div className="chart-heading">
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </div>
      <div role="img" aria-label={label} className="chart-body">
        {children}
      </div>
    </section>
  );
}
export default function InspectionCharts({
  records,
  compact = false,
}: {
  records: InspectionRecord[];
  compact?: boolean;
}) {
  const types = groupRecords(records, "type");
  const severity = groupRecords(records, "severity").map((d) => ({
    ...d,
    color:
      d.name === "High"
        ? "#fb7185"
        : d.name === "Medium"
          ? "#fbbf24"
          : "#34d399",
  }));
  const status = groupRecords(records, "status");
  const daily = Object.entries(
    records.reduce<Record<string, number>>((acc, r) => {
      const date = r.timestamp.slice(0, 10);
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      name: formatDate(`${date}T00:00:00Z`).replace(", 2026", ""),
      value,
    }));
  const describe = (data: { name: string; value: number }[]) =>
    data.map((d) => `${d.name}: ${d.value}`).join("; ");
  if (!records.length)
    return (
      <div className="panel empty-state">
        <h3>No analytics to display</h3>
        <p>Adjust your filters to include sample records.</p>
      </div>
    );
  return (
    <div className={`charts-grid ${compact ? "compact" : ""}`}>
      <ChartCard
        title="Defects by category"
        subtitle="Synthetic findings"
        label={describe(types)}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={types}
            margin={{ top: 15, right: 10, left: -25, bottom: 10 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#253247"
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickFormatter={(v) =>
                v === "Surface deterioration"
                  ? "Surface wear"
                  : v === "Pavement crack"
                    ? "Cracks"
                    : v
              }
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltip} cursor={{ fill: "#ffffff08" }} />
            <Bar
              dataKey="value"
              name="Example findings"
              radius={[4, 4, 0, 0]}
              maxBarSize={42}
              isAnimationActive={false}
            >
              {types.map((d, i) => (
                <Cell key={d.name} fill={palette[i % 3]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard
        title="Severity distribution"
        subtitle="Illustrative estimates"
        label={describe(severity)}
      >
        <div className="donut-layout">
          <ResponsiveContainer width="58%" height={220}>
            <PieChart>
              <Pie
                data={severity}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="83%"
                paddingAngle={5}
                stroke="none"
                isAnimationActive={false}
              >
                {severity.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {severity.map((d) => (
              <span key={d.name}>
                <i style={{ background: d.color }} />
                {d.name}
                <strong>{d.value}</strong>
              </span>
            ))}
          </div>
        </div>
      </ChartCard>
      {!compact && (
        <>
          <ChartCard
            title="Findings over time"
            subtitle="Illustrative timestamps · UTC"
            label={describe(daily)}
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={daily}
                margin={{ top: 15, right: 15, left: -25, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="1" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#253247"
                  strokeDasharray="3 4"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltip} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Example findings"
                  stroke="#38bdf8"
                  fill="url(#chart-fill)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Review status"
            subtitle="Demonstration workflow"
            label={describe(status)}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={status}
                layout="vertical"
                margin={{ left: 0, right: 25, top: 15, bottom: 10 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="#253247"
                  strokeDasharray="3 4"
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  width={90}
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltip}
                  cursor={{ fill: "#ffffff08" }}
                />
                <Bar
                  dataKey="value"
                  name="Example records"
                  fill="#818cf8"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={25}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}
    </div>
  );
}

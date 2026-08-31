import { Link } from "react-router";
import { api } from "~/lib/api.server";
import { ApplicationStatusBadge, IpStatusBadge } from "~/components/StatusBadge";
import type { ApplicationOverview, Statistics } from "~/lib/types";
import type { Route } from "./+types/dashboard";

export async function loader() {
  const [statistics, overview] = await Promise.all([
    api.get<Statistics>("/api/statistics"),
    api.get<ApplicationOverview[]>("/api/applications/overview"),
  ]);
  return { statistics, overview };
}

interface FlatRow {
  appId: number;
  appCode: string;
  appName: string;
  appStatus: ApplicationOverview["status"];
  appRowSpan: number;
  isFirstOfApp: boolean;
  groupId: number | null;
  groupName: string | null;
  groupRowSpan: number;
  isFirstOfGroup: boolean;
  ipId: number | null;
  ipAddress: string | null;
  ipStatus: ApplicationOverview["groups"][number]["ips"][number]["status"] | null;
}

function flattenOverview(overview: ApplicationOverview[]): FlatRow[] {
  const rows: FlatRow[] = [];

  for (const app of overview) {
    const appIpCount = app.groups.reduce((sum, g) => sum + Math.max(g.ips.length, 1), 0);
    const appRowSpan = Math.max(appIpCount, 1);
    let firstOfApp = true;

    if (app.groups.length === 0) {
      rows.push({
        appId: app.id,
        appCode: app.code,
        appName: app.name,
        appStatus: app.status,
        appRowSpan,
        isFirstOfApp: true,
        groupId: null,
        groupName: null,
        groupRowSpan: 1,
        isFirstOfGroup: true,
        ipId: null,
        ipAddress: null,
        ipStatus: null,
      });
      continue;
    }

    for (const group of app.groups) {
      const groupRowSpan = Math.max(group.ips.length, 1);
      let firstOfGroup = true;

      if (group.ips.length === 0) {
        rows.push({
          appId: app.id,
          appCode: app.code,
          appName: app.name,
          appStatus: app.status,
          appRowSpan,
          isFirstOfApp: firstOfApp,
          groupId: group.id,
          groupName: group.name,
          groupRowSpan,
          isFirstOfGroup: true,
          ipId: null,
          ipAddress: null,
          ipStatus: null,
        });
        firstOfApp = false;
        continue;
      }

      for (const ip of group.ips) {
        rows.push({
          appId: app.id,
          appCode: app.code,
          appName: app.name,
          appStatus: app.status,
          appRowSpan,
          isFirstOfApp: firstOfApp,
          groupId: group.id,
          groupName: group.name,
          groupRowSpan,
          isFirstOfGroup: firstOfGroup,
          ipId: ip.id,
          ipAddress: ip.address,
          ipStatus: ip.status,
        });
        firstOfApp = false;
        firstOfGroup = false;
      }
    }
  }

  return rows;
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { statistics, overview } = loaderData;
  const rows = flattenOverview(overview);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">
        Ringkasan data infrastruktur dan aplikasi yang terdaftar di CMDB.
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="value">{statistics.totalApplications}</div>
          <div className="label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="value">{statistics.totalGroups}</div>
          <div className="label">Total Groups</div>
        </div>
        <div className="stat-card">
          <div className="value">{statistics.totalIps}</div>
          <div className="label">Total IP Address</div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <strong>Data Gabungan Application, Group &amp; IP</strong>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{rows.length} baris</span>
        </div>
        {rows.length === 0 ? (
          <div className="empty-state">Belum ada data untuk ditampilkan.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Application</th>
                <th>Status App</th>
                <th>Group</th>
                <th>IP Address</th>
                <th>Status IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.appId}-${row.groupId ?? "none"}-${row.ipId ?? index}`}>
                  {row.isFirstOfApp && (
                    <td rowSpan={row.appRowSpan}>
                      <Link to={`/applications/${row.appId}`}>{row.appName}</Link>
                      <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{row.appCode}</div>
                    </td>
                  )}
                  {row.isFirstOfApp && (
                    <td rowSpan={row.appRowSpan}>
                      <ApplicationStatusBadge status={row.appStatus} />
                    </td>
                  )}
                  {row.isFirstOfGroup && (
                    <td rowSpan={row.groupRowSpan}>
                      {row.groupId ? (
                        <Link to={`/groups/${row.groupId}`}>{row.groupName}</Link>
                      ) : (
                        <span className="empty-state" style={{ padding: 0 }}>
                          Belum ada Group
                        </span>
                      )}
                    </td>
                  )}
                  <td>
                    {row.ipAddress ?? (
                      <span className="empty-state" style={{ padding: 0 }}>
                        Belum ada IP
                      </span>
                    )}
                  </td>
                  <td>{row.ipStatus && <IpStatusBadge status={row.ipStatus} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { Form, Link, redirect, useFetcher, useNavigation } from "react-router";
import { api, ApiError } from "~/lib/api.server";
import { IpStatusBadge } from "~/components/StatusBadge";
import type { GroupDetail, IpSummary } from "~/lib/types";
import type { Route } from "./+types/group-detail";

export async function loader({ params }: Route.LoaderArgs) {
  const [group, allIps] = await Promise.all([
    api.get<GroupDetail>(`/api/groups/${params.groupId}`),
    api.get<IpSummary[]>("/api/ips"),
  ]);
  const assignedIds = new Set(group.ips.map((ip) => ip.id));
  const availableIps = allIps.filter((ip) => !assignedIds.has(ip.id));
  return { group, availableIps };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "update-group") {
      await api.put(`/api/groups/${params.groupId}`, {
        name: formData.get("name"),
        description: formData.get("description") || null,
        applicationId: Number(formData.get("applicationId")),
      });
      return { ok: true };
    }

    if (intent === "delete-group") {
      const appId = formData.get("applicationId");
      await api.delete(`/api/groups/${params.groupId}`);
      return redirect(`/applications/${appId}`);
    }

    if (intent === "assign-ip") {
      const ipId = formData.get("ipId");
      await api.post(`/api/groups/${params.groupId}/ips/${ipId}`);
      return { ok: true };
    }

    if (intent === "remove-ip") {
      const ipId = formData.get("ipId");
      await api.delete(`/api/groups/${params.groupId}/ips/${ipId}`);
      return { ok: true };
    }

    return { ok: false, error: "Aksi tidak dikenali" };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Terjadi kesalahan tak terduga" };
  }
}

export default function GroupDetailPage({ loaderData, actionData }: Route.ComponentProps) {
  const { group, availableIps } = loaderData;
  const navigation = useNavigation();
  const assignFetcher = useFetcher();
  const removeFetcher = useFetcher();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <p style={{ marginBottom: 4 }}>
        <Link to={`/applications/${group.applicationId}`}>&larr; Kembali ke {group.applicationName}</Link>
      </p>
      <h2 className="page-title">{group.name}</h2>
      <p className="page-subtitle">Bagian dari Application: {group.applicationName}</p>

      {actionData && !actionData.ok && <div className="alert">{actionData.error}</div>}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <strong>Edit Data Group</strong>
        </div>
        <Form method="post" className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <input type="hidden" name="intent" value="update-group" />
          <input type="hidden" name="applicationId" value={group.applicationId} />
          <div>
            <label htmlFor="name">Nama Group</label>
            <input id="name" name="name" defaultValue={group.name} required />
          </div>
          <div>
            <label htmlFor="description">Deskripsi</label>
            <input id="description" name="description" defaultValue={group.description ?? ""} />
          </div>
          <div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              Simpan Perubahan
            </button>
          </div>
        </Form>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Form
          method="post"
          onSubmit={(e) => {
            if (!confirm(`Hapus group "${group.name}"?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="intent" value="delete-group" />
          <input type="hidden" name="applicationId" value={group.applicationId} />
          <button className="btn danger" type="submit">
            Hapus Group Ini
          </button>
        </Form>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <strong>Assign IP ke Group Ini</strong>
        </div>
        {availableIps.length === 0 ? (
          <div className="empty-state">
            Semua IP terdaftar sudah masuk ke group ini. Tambah IP baru di menu IP Address.
          </div>
        ) : (
          <assignFetcher.Form method="post" style={{ display: "flex", gap: 8 }}>
            <input type="hidden" name="intent" value="assign-ip" />
            <select name="ipId" required style={{ flex: 1 }}>
              <option value="">Pilih IP untuk ditambahkan</option>
              {availableIps.map((ip) => (
                <option key={ip.id} value={ip.id}>
                  {ip.address} ({ip.status === "ACTIVE" ? "Aktif" : ip.status === "RESERVED" ? "Cadangan" : "Nonaktif"})
                  {ip.description ? ` - ${ip.description}` : ""}
                </option>
              ))}
            </select>
            <button className="btn" type="submit" disabled={assignFetcher.state !== "idle"}>
              {assignFetcher.state !== "idle" ? "Menambahkan..." : "Assign IP"}
            </button>
          </assignFetcher.Form>
        )}
      </div>

      <div className="card">
        <div className="section-header">
          <strong>IP dalam Group Ini ({group.ips.length})</strong>
        </div>
        {group.ips.length === 0 ? (
          <div className="empty-state">Belum ada IP yang di-assign ke group ini.</div>
        ) : (
          <div className="chip-list">
            {group.ips.map((ip) => (
              <div className="chip" key={ip.id}>
                <span>{ip.address}</span>
                <IpStatusBadge status={ip.status} />
                <removeFetcher.Form method="post">
                  <input type="hidden" name="intent" value="remove-ip" />
                  <input type="hidden" name="ipId" value={ip.id} />
                  <button type="submit" title="Hapus dari group" disabled={removeFetcher.state !== "idle"}>
                    &times;
                  </button>
                </removeFetcher.Form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

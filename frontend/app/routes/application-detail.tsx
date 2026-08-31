import { Form, Link, redirect, useNavigation } from "react-router";
import { api, ApiError } from "~/lib/api.server";
import { APPLICATION_STATUS_OPTIONS, ApplicationStatusBadge } from "~/components/StatusBadge";
import type { ApplicationDetail } from "~/lib/types";
import type { Route } from "./+types/application-detail";

export async function loader({ params }: Route.LoaderArgs) {
  const application = await api.get<ApplicationDetail>(`/api/applications/${params.appId}`);
  return { application };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "update-app") {
      await api.put(`/api/applications/${params.appId}`, {
        code: formData.get("code"),
        name: formData.get("name"),
        description: formData.get("description") || null,
        status: formData.get("status"),
      });
      return { ok: true };
    }

    if (intent === "delete-app") {
      await api.delete(`/api/applications/${params.appId}`);
      return redirect("/applications");
    }

    if (intent === "create-group") {
      await api.post("/api/groups", {
        name: formData.get("name"),
        description: formData.get("description") || null,
        applicationId: Number(params.appId),
      });
      return { ok: true };
    }

    if (intent === "delete-group") {
      const groupId = formData.get("groupId");
      await api.delete(`/api/groups/${groupId}`);
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

export default function ApplicationDetailPage({ loaderData, actionData }: Route.ComponentProps) {
  const { application } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <p style={{ marginBottom: 4 }}>
        <Link to="/applications">&larr; Kembali ke daftar Application</Link>
      </p>
      <h2 className="page-title">{application.name}</h2>
      <p className="page-subtitle" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        Kode: {application.code}
        <ApplicationStatusBadge status={application.status} />
      </p>

      {actionData && !actionData.ok && <div className="alert">{actionData.error}</div>}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <strong>Edit Data Application</strong>
        </div>
        <Form method="post" className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <input type="hidden" name="intent" value="update-app" />
          <div>
            <label htmlFor="code">Kode Aplikasi</label>
            <input id="code" name="code" defaultValue={application.code} required />
          </div>
          <div>
            <label htmlFor="name">Nama Aplikasi</label>
            <input id="name" name="name" defaultValue={application.name} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="description">Deskripsi</label>
            <textarea id="description" name="description" rows={2} defaultValue={application.description ?? ""} />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={application.status}>
              {APPLICATION_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="row-actions">
            <button className="btn" type="submit" disabled={isSubmitting}>
              Simpan Perubahan
            </button>
          </div>
        </Form>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Form
          method="post"
          onSubmit={(e) => {
            if (!confirm("Hapus aplikasi ini beserta seluruh group di dalamnya?")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="intent" value="delete-app" />
          <button className="btn danger" type="submit">
            Hapus Application Ini
          </button>
        </Form>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <strong>Tambah Group Baru</strong>
        </div>
        <Form method="post" className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <input type="hidden" name="intent" value="create-group" />
          <div>
            <label htmlFor="groupName">Nama Group</label>
            <input id="groupName" name="name" placeholder="contoh: App Server" required />
          </div>
          <div>
            <label htmlFor="groupDescription">Deskripsi</label>
            <input id="groupDescription" name="description" placeholder="Deskripsi singkat (opsional)" />
          </div>
          <div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              Tambah Group
            </button>
          </div>
        </Form>
      </div>

      <div className="card">
        <div className="section-header">
          <strong>Daftar Group ({application.groups.length})</strong>
        </div>
        {application.groups.length === 0 ? (
          <div className="empty-state">Belum ada Group pada aplikasi ini.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nama Group</th>
                <th>Jumlah IP</th>
                <th style={{ width: 180 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {application.groups.map((group) => (
                <tr key={group.id}>
                  <td>
                    <Link to={`/groups/${group.id}`}>{group.name}</Link>
                  </td>
                  <td>
                    <span className="badge">{group.totalIps} IP</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/groups/${group.id}`} className="btn secondary">
                        Kelola IP
                      </Link>
                      <Form
                        method="post"
                        onSubmit={(e) => {
                          if (!confirm(`Hapus group "${group.name}"?`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="intent" value="delete-group" />
                        <input type="hidden" name="groupId" value={group.id} />
                        <button className="btn danger" type="submit">
                          Hapus
                        </button>
                      </Form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

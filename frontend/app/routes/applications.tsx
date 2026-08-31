import { Form, Link, useNavigation } from "react-router";
import { api, ApiError } from "~/lib/api.server";
import { APPLICATION_STATUS_OPTIONS, ApplicationStatusBadge } from "~/components/StatusBadge";
import type { ApplicationSummary } from "~/lib/types";
import type { Route } from "./+types/applications";

export async function loader() {
  const applications = await api.get<ApplicationSummary[]>("/api/applications");
  return { applications };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      await api.post("/api/applications", {
        code: formData.get("code"),
        name: formData.get("name"),
        description: formData.get("description") || null,
        status: formData.get("status"),
      });
      return { ok: true };
    }

    if (intent === "delete") {
      const id = formData.get("id");
      await api.delete(`/api/applications/${id}`);
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

export default function Applications({ loaderData, actionData }: Route.ComponentProps) {
  const { applications } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h2 className="page-title">Applications</h2>
      <p className="page-subtitle">
        Kelola data aplikasi. Setiap aplikasi dapat memiliki beberapa Group.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <strong>Tambah Application Baru</strong>
        </div>
        {actionData && !actionData.ok && <div className="alert">{actionData.error}</div>}
        <Form method="post" className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <input type="hidden" name="intent" value="create" />
          <div>
            <label htmlFor="code">Kode Aplikasi</label>
            <input id="code" name="code" placeholder="contoh: CORE-BANKING" required />
          </div>
          <div>
            <label htmlFor="name">Nama Aplikasi</label>
            <input id="name" name="name" placeholder="contoh: Core Banking System" required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="description">Deskripsi</label>
            <textarea id="description" name="description" rows={2} placeholder="Deskripsi singkat (opsional)" />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue="ACTIVE">
              {APPLICATION_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Application"}
            </button>
          </div>
        </Form>
      </div>

      <div className="card">
        {applications.length === 0 ? (
          <div className="empty-state">Belum ada data Application.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Status</th>
                <th>Jumlah Group</th>
                <th style={{ width: 180 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.code}</td>
                  <td>
                    <Link to={`/applications/${app.id}`}>{app.name}</Link>
                  </td>
                  <td>
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td>
                    <span className="badge">{app.totalGroups} group</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/applications/${app.id}`} className="btn secondary">
                        Kelola
                      </Link>
                      <Form
                        method="post"
                        onSubmit={(e) => {
                          if (!confirm(`Hapus aplikasi "${app.name}"? Semua group di dalamnya juga akan terhapus.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={app.id} />
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

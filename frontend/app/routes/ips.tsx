import { Form, useNavigation } from "react-router";
import { api, ApiError } from "~/lib/api.server";
import { IP_STATUS_OPTIONS, IpStatusBadge } from "~/components/StatusBadge";
import type { IpSummary } from "~/lib/types";
import type { Route } from "./+types/ips";

export async function loader() {
  const ips = await api.get<IpSummary[]>("/api/ips");
  return { ips };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      await api.post("/api/ips", {
        address: formData.get("address"),
        description: formData.get("description") || null,
        status: formData.get("status"),
      });
      return { ok: true };
    }

    if (intent === "update") {
      const id = formData.get("id");
      await api.put(`/api/ips/${id}`, {
        address: formData.get("address"),
        description: formData.get("description") || null,
        status: formData.get("status"),
      });
      return { ok: true };
    }

    if (intent === "delete") {
      const id = formData.get("id");
      await api.delete(`/api/ips/${id}`);
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

export default function Ips({ loaderData, actionData }: Route.ComponentProps) {
  const { ips } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h2 className="page-title">IP Address</h2>
      <p className="page-subtitle">
        Kelola data IP. Satu IP bisa di-assign ke beberapa Group sekaligus.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <strong>Tambah IP Baru</strong>
        </div>
        {actionData && !actionData.ok && <div className="alert">{actionData.error}</div>}
        <Form method="post" className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <input type="hidden" name="intent" value="create" />
          <div>
            <label htmlFor="address">Alamat IP</label>
            <input id="address" name="address" placeholder="contoh: 10.10.1.25" required />
          </div>
          <div>
            <label htmlFor="description">Deskripsi</label>
            <input id="description" name="description" placeholder="Deskripsi singkat (opsional)" />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue="ACTIVE">
              {IP_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              Simpan IP
            </button>
          </div>
        </Form>
      </div>

      <div className="card">
        {ips.length === 0 ? (
          <div className="empty-state">Belum ada data IP.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Alamat IP</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th style={{ width: 260 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ips.map((ip) => (
                <tr key={ip.id}>
                  <td>{ip.address}</td>
                  <td>{ip.description || "-"}</td>
                  <td>
                    <IpStatusBadge status={ip.status} />
                  </td>
                  <td>
                    <details>
                      <summary className="btn secondary" style={{ display: "inline-block", cursor: "pointer" }}>
                        Edit
                      </summary>
                      <Form method="post" className="form-grid" style={{ marginTop: 10 }}>
                        <input type="hidden" name="intent" value="update" />
                        <input type="hidden" name="id" value={ip.id} />
                        <input name="address" defaultValue={ip.address} required />
                        <input name="description" defaultValue={ip.description ?? ""} placeholder="Deskripsi" />
                        <select name="status" defaultValue={ip.status}>
                          {IP_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button className="btn" type="submit">
                          Simpan
                        </button>
                      </Form>
                    </details>
                    <Form
                      method="post"
                      style={{ display: "inline-block", marginTop: 8 }}
                      onSubmit={(e) => {
                        if (!confirm(`Hapus IP "${ip.address}"?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={ip.id} />
                      <button className="btn danger" type="submit">
                        Hapus
                      </button>
                    </Form>
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

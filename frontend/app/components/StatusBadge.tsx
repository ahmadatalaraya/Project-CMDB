import type { ApplicationStatus, IpStatus } from "~/lib/types";

const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  ACTIVE: "Aktif",
  MAINTENANCE: "Maintenance",
  DECOMMISSIONED: "Nonaktif",
};

const IP_STATUS_LABEL: Record<IpStatus, string> = {
  ACTIVE: "Aktif",
  RESERVED: "Cadangan",
  INACTIVE: "Nonaktif",
};

const STATUS_TONE: Record<string, string> = {
  ACTIVE: "status-active",
  RESERVED: "status-reserved",
  MAINTENANCE: "status-maintenance",
  INACTIVE: "status-inactive",
  DECOMMISSIONED: "status-inactive",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`status-badge ${STATUS_TONE[status]}`}>
      {APPLICATION_STATUS_LABEL[status]}
    </span>
  );
}

export function IpStatusBadge({ status }: { status: IpStatus }) {
  return <span className={`status-badge ${STATUS_TONE[status]}`}>{IP_STATUS_LABEL[status]}</span>;
}

export const APPLICATION_STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "DECOMMISSIONED", label: "Nonaktif" },
];

export const IP_STATUS_OPTIONS: { value: IpStatus; label: string }[] = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "RESERVED", label: "Cadangan" },
  { value: "INACTIVE", label: "Nonaktif" },
];

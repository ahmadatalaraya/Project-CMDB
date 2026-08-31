export type ApplicationStatus = "ACTIVE" | "MAINTENANCE" | "DECOMMISSIONED";
export type IpStatus = "ACTIVE" | "RESERVED" | "INACTIVE";

export interface ApplicationSummary {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: ApplicationStatus;
  totalGroups: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupSummary {
  id: number;
  name: string;
  description: string | null;
  applicationId: number;
  applicationName: string;
  totalIps: number;
  createdAt: string;
  updatedAt: string;
}

export interface IpSummary {
  id: number;
  address: string;
  description: string | null;
  status: IpStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDetail {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: ApplicationStatus;
  groups: GroupSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupDetail {
  id: number;
  name: string;
  description: string | null;
  applicationId: number;
  applicationName: string;
  ips: IpSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalApplications: number;
  totalGroups: number;
  totalIps: number;
}

export interface OverviewIp {
  id: number;
  address: string;
  status: IpStatus;
}

export interface OverviewGroup {
  id: number;
  name: string;
  ips: OverviewIp[];
}

export interface ApplicationOverview {
  id: number;
  code: string;
  name: string;
  status: ApplicationStatus;
  groups: OverviewGroup[];
}

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("applications", "routes/applications.tsx"),
  route("applications/:appId", "routes/application-detail.tsx"),
  route("groups/:groupId", "routes/group-detail.tsx"),
  route("ips", "routes/ips.tsx"),
] satisfies RouteConfig;

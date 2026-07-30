import { Outlet } from "react-router";
import { SectionTabs } from "~/components/layout/section-tabs";

export default function TeamLayout() {
  return (
    <>
      <SectionTabs
        items={[
          { to: "/app/team", label: "Players", end: true },
          { to: "/app/team/players", label: "Roster" },
          { to: "/app/team/depth-charts", label: "Depth Charts" },
          { to: "/app/team/packages", label: "Packages" },
          { to: "/app/team/captains", label: "Captains" },
          { to: "/app/team/coaches", label: "Coaches" },
        ]}
      />
      <Outlet />
    </>
  );
}

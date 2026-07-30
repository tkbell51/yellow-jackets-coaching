import { Outlet } from "react-router";
import { SectionTabs } from "~/components/layout/section-tabs";

export default function PracticeLayout() {
  return (
    <>
      <SectionTabs
        items={[
          { to: "/app/practice", label: "Today", end: true },
          { to: "/app/practice/plans", label: "Plans" },
          { to: "/app/practice/groups", label: "Groups" },
          { to: "/app/practice/competition", label: "Competition" },
        ]}
      />
      <Outlet />
    </>
  );
}

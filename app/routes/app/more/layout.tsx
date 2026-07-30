import { Outlet } from "react-router";
import { SectionTabs } from "~/components/layout/section-tabs";

export default function MoreLayout() {
  return (
    <>
      <SectionTabs
        items={[
          { to: "/app/more", label: "Notes", end: true },
          { to: "/app/more/notes", label: "Notes" },
          { to: "/app/more/reports", label: "Reports" },
          { to: "/app/more/equipment", label: "Equipment" },
          { to: "/app/more/fields", label: "Fields" },
          { to: "/app/more/roles", label: "Roles" },
          { to: "/app/more/settings", label: "Settings" },
          { to: "/app/more/sync", label: "Sync" },
        ]}
      />
      <Outlet />
    </>
  );
}

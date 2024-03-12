import type { Metadata } from "next";

import AdminNav from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "E~Shop Admin",
  description: "E~shop Admin Dashboard.",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />

      {children}
    </div>
  );
};

export default AdminLayout;

import CreateUser from "./components/CreateUser";
import AdminAnnouncements from "./AdminAnnouncements";

const AdminPlayground = () => {
  return (
    <div className="flex flex-col gap-6 min-h-full md:p-4">
      <AdminAnnouncements />
      <CreateUser />
    </div>
  );
};

export default AdminPlayground;

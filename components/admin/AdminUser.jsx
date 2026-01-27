import { Users, FileText, BookOpen, TrendingUp } from "lucide-react";
import useUsers from "@/libs/hooks/useUsers";
import { usePost } from "@/libs/hooks/usePost";
import { useSubject } from "@/libs/hooks/useSubject";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300 flex items-center justify-between">
    <div>
      <p className="text-base-content/60 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
    </div>
  </div>
);

const AdminUser = () => {
  const { data: users } = useUsers();
  const { data: posts } = usePost();
  const { data: subjects } = useSubject();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users?.length || 0}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Documents"
          value={posts?.length || 0}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Total Subjects"
          value={subjects?.length || 0}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Active Sessions"
          value="12"
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-base-200 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-base-content/60">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300">
          <h3 className="text-lg font-bold mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Server Uptime</span>
              <span className="text-sm font-medium text-success">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <span className="text-sm font-medium text-success">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Storage</span>
              <span className="text-sm font-medium">45% Used</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;

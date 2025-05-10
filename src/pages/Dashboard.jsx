import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Shield, User, UserCheck, Users } from "lucide-react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const groupIdExample = 1;
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <h2 className="font-medium text-lg">Dashboard Menu</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="groups"
                  className={cn(
                    location.pathname.endsWith("/groups") &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Groups</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to={`groups/${groupIdExample}/roles`}
                  className={cn(
                    location.pathname.includes("/roles") &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Roles</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="users"
                  className={cn(
                    location.pathname.endsWith("/users") &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="roles/1/permissions"
                  className={cn(
                    location.pathname.includes("/permissions") &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Permissions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;

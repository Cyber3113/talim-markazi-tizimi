
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from './StatCard';
import GroupList from '../groups/GroupList';
import { MOCK_GROUPS } from '@/lib/authUtils';

interface AdminDashboardProps {
  stats: Array<{
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
  onTabChange: (tab: string) => void;
}

const AdminDashboard = ({ stats, onTabChange }: AdminDashboardProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Groups</CardTitle>
              <CardDescription>Active learning groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_GROUPS.slice(0, 3).map(group => (
                  <div key={group.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{group.schedule}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{group.students.length} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Today's attendance statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <div className="w-32 h-32 rounded-full border-8 border-edu-primary relative flex items-center justify-center">
                  <span className="text-3xl font-bold">88%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="groups">
        <GroupList />
      </TabsContent>
      <TabsContent value="reports">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>Generate and view attendance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This section allows administrators to generate and view attendance reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>Generate and view student performance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This section allows administrators to generate and view student performance reports</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboard;

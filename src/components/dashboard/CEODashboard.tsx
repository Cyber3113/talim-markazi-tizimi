
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import StatCard from './StatCard';
import TopStudents from './TopStudents';
import MentorList from '../mentors/MentorList';
import GroupList from '../groups/GroupList';
import { MOCK_GROUPS } from '@/lib/authUtils';

interface CEODashboardProps {
  stats: Array<{
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
  onTabChange: (tab: string) => void;
}

const CEODashboard = ({ stats, onTabChange }: CEODashboardProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="mentors">Mentors</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
        <TabsTrigger value="top-students">Top Students</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Groups Overview</CardTitle>
              <CardDescription>Active learning groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_GROUPS.slice(0, 3).map(group => (
                  <div key={group.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{group.students.length} students</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {group.price ? `${group.price}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <TopStudents />
        </div>
      </TabsContent>
      <TabsContent value="mentors">
        <MentorList />
      </TabsContent>
      <TabsContent value="groups" className="space-y-4">
        <GroupList />
      </TabsContent>
      <TabsContent value="top-students">
        <TopStudents />
      </TabsContent>
      <TabsContent value="analytics">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Educational Center Analytics</CardTitle>
              <CardDescription>Performance and attendance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-60">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Analytics charts and reports will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CEODashboard;

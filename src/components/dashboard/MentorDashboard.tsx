
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Award } from 'lucide-react';
import StatCard from './StatCard';
import GroupList from '../groups/GroupList';
import { getGroupsByMentorId } from '@/lib/authUtils';

interface MentorDashboardProps {
  stats: Array<{
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
  userId: string;
  onTabChange: (tab: string) => void;
}

const MentorDashboard = ({ stats, userId, onTabChange }: MentorDashboardProps) => {
  const mentorGroups = getGroupsByMentorId(userId);

  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="groups">My Groups</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="scores">Scores</TabsTrigger>
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
              <CardTitle>My Groups</CardTitle>
              <CardDescription>Groups you are teaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentorGroups.map(group => (
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
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <CalendarCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Attendance taken</p>
                    <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Scores updated</p>
                    <p className="text-sm text-muted-foreground">Yesterday at 04:15 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="groups">
        <GroupList />
      </TabsContent>
      <TabsContent value="attendance">
        <GroupList />
      </TabsContent>
      <TabsContent value="scores">
        <GroupList />
      </TabsContent>
    </Tabs>
  );
};

export default MentorDashboard;

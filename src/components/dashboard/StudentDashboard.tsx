
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import StatCard from './StatCard';
import StudentDetail from '../students/StudentDetail';
import { Student } from '@/lib/types';
import { getStudentByUserId, getTopStudents } from '@/lib/authUtils';

interface StudentDashboardProps {
  stats: Array<{
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
  userId: string;
  onTabChange: (tab: string) => void;
}

const StudentDashboard = ({ stats, userId, onTabChange }: StudentDashboardProps) => {
  const student = getStudentByUserId(userId);
  
  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your student record is not found. Please contact an administrator.</p>
      </div>
    );
  }
  
  const topStudents = getTopStudents();
  const studentRank = topStudents.find(s => s.id === student.id)?.rank || 'N/A';
  
  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="attendance">My Attendance</TabsTrigger>
        <TabsTrigger value="scores">My Scores</TabsTrigger>
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
              <CardTitle>My Attendance</CardTitle>
              <CardDescription>Recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.attendance.slice(-4).map((record) => (
                  <div key={record.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.present 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.present ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>My Performance</CardTitle>
              <CardDescription>Your latest achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Coins</p>
                    <p className="text-xs text-muted-foreground">Your total earned coins</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-yellow-50">
                      <Award className="inline-block mr-1 h-3 w-3 text-yellow-500" />
                      {student.coins || 0}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Ranking</p>
                    <p className="text-xs text-muted-foreground">Your position among all students</p>
                  </div>
                  <div>
                    <Badge variant="outline">
                      #{studentRank}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Average Score</p>
                    <p className="text-xs text-muted-foreground">Your average test score</p>
                  </div>
                  <div>
                    <Badge variant={
                      student.scores.length > 0 
                        ? (Math.round(student.scores.reduce((sum, score) => sum + score.value, 0) / student.scores.length) >= 90 
                          ? 'default' 
                          : Math.round(student.scores.reduce((sum, score) => sum + score.value, 0) / student.scores.length) >= 70 
                            ? 'secondary' 
                            : 'destructive')
                        : 'secondary'
                    }>
                      {student.scores.length > 0
                        ? Math.round(student.scores.reduce((sum, score) => sum + score.value, 0) / student.scores.length)
                        : 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="attendance">
        <StudentDetail student={student} onBack={() => {}} />
      </TabsContent>
      <TabsContent value="scores">
        <Card>
          <CardHeader>
            <CardTitle>My Academic Scores</CardTitle>
            <CardDescription>Full history of your academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {student.scores.map((score) => (
                      <tr key={score.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {score.description || 'Score'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(score.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium px-2 py-1 rounded ${
                            score.value >= 90 ? 'bg-green-100 text-green-800' :
                            score.value >= 80 ? 'bg-blue-100 text-blue-800' :
                            score.value >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {score.value}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StudentDashboard;


import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersRound, Book, CalendarCheck, Award, Layers, BookOpen, BarChart, User2 } from 'lucide-react';

// Mock data
const mockStats = {
  CEO: [
    { title: 'Total Students', value: '124', icon: UsersRound, color: 'text-blue-500' },
    { title: 'Active Groups', value: '8', icon: Layers, color: 'text-green-500' },
    { title: 'Mentors', value: '6', icon: User2, color: 'text-purple-500' },
    { title: 'Courses', value: '12', icon: BookOpen, color: 'text-orange-500' },
  ],
  Admin: [
    { title: 'Active Groups', value: '8', icon: Layers, color: 'text-green-500' },
    { title: 'Today\'s Attendance', value: '88%', icon: CalendarCheck, color: 'text-blue-500' },
    { title: 'Upcoming Exams', value: '3', icon: Book, color: 'text-red-500' },
  ],
  Mentor: [
    { title: 'My Groups', value: '2', icon: Layers, color: 'text-green-500' },
    { title: 'My Students', value: '37', icon: UsersRound, color: 'text-blue-500' },
    { title: 'Assignments', value: '5', icon: Book, color: 'text-orange-500' },
  ],
  Student: [
    { title: 'Average Score', value: '85%', icon: Award, color: 'text-yellow-500' },
    { title: 'Attendance', value: '92%', icon: CalendarCheck, color: 'text-green-500' },
    { title: 'Upcoming Tests', value: '2', icon: Book, color: 'text-red-500' },
  ]
};

const mockGroups = [
  { id: '1', name: 'English Beginners', studentCount: 15, schedule: 'Mon, Wed 15:00-16:30', progress: 65 },
  { id: '2', name: 'Math Advanced', studentCount: 12, schedule: 'Tue, Thu 17:00-18:30', progress: 78 },
  { id: '3', name: 'Programming Basics', studentCount: 18, schedule: 'Mon, Fri 16:00-17:30', progress: 45 },
  { id: '4', name: 'Science Group', studentCount: 14, schedule: 'Wed, Fri 14:30-16:00', progress: 82 },
];

const mockAttendance = [
  { date: '2025-04-01', status: 'present' },
  { date: '2025-04-02', status: 'absent' },
  { date: '2025-04-03', status: 'present' },
  { date: '2025-04-04', status: 'present' },
];

const mockScores = [
  { subject: 'Math', score: 92, date: '2025-03-15' },
  { subject: 'English', score: 88, date: '2025-03-18' },
  { subject: 'Programming', score: 95, date: '2025-03-22' },
  { subject: 'Science', score: 78, date: '2025-03-25' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return <div>Loading...</div>;
  }

  // Get role-specific data
  const stats = mockStats[user.role] || [];

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'CEO':
        return (
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="mentors">Mentors</TabsTrigger>
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
                      {mockGroups.slice(0, 3).map(group => (
                        <div key={group.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.studentCount} students</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">{group.progress}%</span>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-edu-primary rounded-full" 
                                style={{ width: `${group.progress}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Activity</CardTitle>
                    <CardDescription>Recent actions in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">New student registered</p>
                          <p className="text-sm text-muted-foreground">Today at 09:42 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Layers className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">New group created</p>
                          <p className="text-sm text-muted-foreground">Yesterday at 03:15 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <CalendarCheck className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Attendance records updated</p>
                          <p className="text-sm text-muted-foreground">Yesterday at 02:30 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="groups" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {mockGroups.map(group => (
                  <Card key={group.id}>
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>{group.schedule}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Students:</span>
                          <span className="font-medium">{group.studentCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Progress:</span>
                          <span className="font-medium">{group.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className="h-full bg-edu-primary rounded-full" 
                            style={{ width: `${group.progress}%` }} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="mentors">
              {/* Mentor management content */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mentors Management</CardTitle>
                    <CardDescription>Add, remove or edit mentors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">This section allows CEO to manage mentors</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              {/* Analytics content */}
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
      case 'Mentor':
        return (
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
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
                      {mockGroups.slice(0, 2).map(group => (
                        <div key={group.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.schedule}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{group.studentCount} students</p>
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
            <TabsContent value="attendance">
              {/* Attendance management content */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Management</CardTitle>
                  <CardDescription>Track student attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">This section allows mentors to record and manage student attendance</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scores">
              {/* Scores management content */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Management</CardTitle>
                  <CardDescription>Assign and manage student scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">This section allows mentors to record and manage student scores</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
      case 'Admin':
        return (
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
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
                      {mockGroups.slice(0, 3).map(group => (
                        <div key={group.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.schedule}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{group.studentCount} students</p>
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
              {/* Groups management content */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Groups Management</CardTitle>
                    <CardDescription>View and manage groups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockGroups.map(group => (
                        <div key={group.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-base">{group.name}</p>
                              <p className="text-sm text-muted-foreground">{group.schedule}</p>
                            </div>
                            <div className="text-sm text-right">
                              <p className="font-medium">{group.studentCount} students</p>
                              <p className="text-muted-foreground">Progress: {group.progress}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reports">
              {/* Reports content */}
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
      case 'Student':
        return (
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
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
                      {mockAttendance.map((record, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.status === 'present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Scores</CardTitle>
                    <CardDescription>Your latest test scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockScores.map((score, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{score.subject}</p>
                            <p className="text-xs text-muted-foreground">{new Date(score.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className={`text-sm font-medium px-2 py-1 rounded ${
                              score.score >= 90 ? 'bg-green-100 text-green-800' :
                              score.score >= 80 ? 'bg-blue-100 text-blue-800' :
                              score.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {score.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="attendance">
              {/* Attendance details */}
              <Card>
                <CardHeader>
                  <CardTitle>My Attendance Records</CardTitle>
                  <CardDescription>Full history of your attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[...mockAttendance, 
                            { date: '2025-03-31', status: 'present' },
                            { date: '2025-03-30', status: 'present' },
                            { date: '2025-03-29', status: 'absent' },
                            { date: '2025-03-28', status: 'present' },
                          ].map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  record.status === 'present' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {record.status}
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
            <TabsContent value="scores">
              {/* Scores details */}
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
                          {[...mockScores,
                            { subject: 'History', score: 82, date: '2025-03-10' },
                            { subject: 'Physics', score: 88, date: '2025-03-05' },
                            { subject: 'Chemistry', score: 76, date: '2025-02-28' },
                            { subject: 'Literature', score: 90, date: '2025-02-21' },
                          ].map((score, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {score.subject}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(score.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`text-sm font-medium px-2 py-1 rounded ${
                                  score.score >= 90 ? 'bg-green-100 text-green-800' :
                                  score.score >= 80 ? 'bg-blue-100 text-blue-800' :
                                  score.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {score.score}%
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
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <UserProfile />
        </div>
        <div className="md:col-span-3">
          {renderRoleSpecificContent()}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 rounded-full bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;

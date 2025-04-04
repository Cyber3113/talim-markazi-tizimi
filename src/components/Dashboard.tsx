
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UsersRound, Book, CalendarCheck, Award, 
  Layers, BookOpen, BarChart, User2 
} from 'lucide-react';
import GroupList from './groups/GroupList';
import { 
  getGroupsByMentorId, 
  getStudentByUserId, 
  MOCK_GROUPS 
} from '@/lib/authUtils';
import StudentDetail from './students/StudentDetail';

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
                      {MOCK_GROUPS.slice(0, 3).map(group => (
                        <div key={group.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.studentCount || group.students.length} students</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">65%</span>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-edu-primary rounded-full" 
                                style={{ width: '65%' }} 
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
              <GroupList />
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
        const mentorGroups = getGroupsByMentorId(user.id);
        return (
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
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
              {/* Attendance management content */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Management</CardTitle>
                  <CardDescription>Record and track student attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Select a group to manage attendance:</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mentorGroups.map(group => (
                      <Card key={group.id} className="cursor-pointer hover:bg-muted transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle>{group.name}</CardTitle>
                          <CardDescription>{group.schedule}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between">
                            <span className="text-sm">Students:</span>
                            <span className="text-sm font-medium">{group.students.length}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                  <p className="text-muted-foreground mb-4">Select a group to manage student scores:</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mentorGroups.map(group => (
                      <Card key={group.id} className="cursor-pointer hover:bg-muted transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle>{group.name}</CardTitle>
                          <CardDescription>{group.schedule}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between">
                            <span className="text-sm">Students:</span>
                            <span className="text-sm font-medium">{group.students.length}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
        const student = getStudentByUserId(user.id);
        
        if (!student) {
          return (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your student record is not found. Please contact an administrator.</p>
            </div>
          );
        }
        
        // Calculate stats
        const averageScore = student.scores.length > 0
          ? Math.round(student.scores.reduce((sum, score) => sum + score.value, 0) / student.scores.length)
          : 0;
        
        const attendanceRate = student.attendance.length > 0
          ? Math.round((student.attendance.filter(a => a.present).length / student.attendance.length) * 100)
          : 0;
        
        // Override default stats with actual data
        stats[0].value = `${averageScore}%`;
        stats[1].value = `${attendanceRate}%`;
        
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
                      {student.attendance.slice(-4).map((record, index) => (
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
                    <CardTitle>Recent Scores</CardTitle>
                    <CardDescription>Your latest test scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {student.scores.slice(-4).map((score, index) => (
                        <div key={score.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{score.description || 'Score'}</p>
                            <p className="text-xs text-muted-foreground">{new Date(score.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className={`text-sm font-medium px-2 py-1 rounded ${
                              score.value >= 90 ? 'bg-green-100 text-green-800' :
                              score.value >= 80 ? 'bg-blue-100 text-blue-800' :
                              score.value >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {score.value}%
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
              <StudentDetail student={student} onBack={() => {}} />
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

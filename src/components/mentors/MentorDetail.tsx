
import React from 'react';
import { User } from '@/lib/types';
import { MOCK_GROUPS } from '@/lib/authUtils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Users, Award, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

interface MentorDetailProps {
  mentor: User;
  onBack: () => void;
  onEdit: () => void;
}

const MentorDetail: React.FC<MentorDetailProps> = ({ mentor, onBack, onEdit }) => {
  const { user } = useAuth();
  const mentorGroups = MOCK_GROUPS.filter(group => group.mentorId === mentor.id);
  
  // Calculate total students
  const totalStudents = mentorGroups.reduce((sum, group) => sum + group.students.length, 0);
  
  // Calculate average attendance
  const allAttendance = mentorGroups.flatMap(group => 
    group.students.flatMap(student => student.attendance)
  );
  
  const attendanceRate = allAttendance.length > 0
    ? Math.round((allAttendance.filter(a => a.present).length / allAttendance.length) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{mentor.name}</h2>
        </div>
        {user?.role === 'CEO' && (
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Mentor
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Groups</p>
                <p className="text-2xl font-bold">{mentorGroups.length}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold">{attendanceRate}%</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mentor Information</CardTitle>
            <CardDescription>Personal and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Name:</span>
              <span>{mentor.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Username:</span>
              <span>{mentor.username}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Role:</span>
              <span>{mentor.role}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Groups</CardTitle>
            <CardDescription>Groups this mentor is teaching</CardDescription>
          </CardHeader>
          <CardContent>
            {mentorGroups.length > 0 ? (
              <div className="space-y-4">
                {mentorGroups.map(group => (
                  <div key={group.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{group.schedule}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {group.students.length} students
                      </span>
                      {group.price && (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {group.price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No groups assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
          <CardDescription>Overall performance of students in all groups</CardDescription>
        </CardHeader>
        <CardContent>
          {totalStudents > 0 ? (
            <div className="space-y-4">
              {mentorGroups.map(group => (
                <div key={group.id} className="space-y-2">
                  <h3 className="font-medium">{group.name}</h3>
                  {group.students.length > 0 ? (
                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                      {group.students.map(student => (
                        <div key={student.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <div className="flex space-x-2 text-xs text-muted-foreground">
                              <span>Coins: {student.coins || 0}</span>
                              <span>•</span>
                              <span>Att: {student.attendance.filter(a => a.present).length}/{student.attendance.length}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-yellow-50">
                            <Award className="inline-block mr-1 h-3 w-3 text-yellow-500" />
                            {student.coins || 0}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No students in this group</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No student data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDetail;

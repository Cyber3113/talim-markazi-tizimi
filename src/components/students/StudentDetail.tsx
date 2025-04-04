
import React from 'react';
import { Student } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CalendarCheck, ArrowLeft, User, Home, Phone, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { getTopStudents } from '@/lib/authUtils';

interface StudentDetailProps {
  student: Student;
  onBack: () => void;
  onAddScore?: (student: Student) => void;
  canAddScore?: boolean;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ 
  student, 
  onBack,
  onAddScore,
  canAddScore = false
}) => {
  // Calculate average score
  const averageScore = student.scores.length > 0
    ? Math.round(student.scores.reduce((sum, score) => sum + score.value, 0) / student.scores.length)
    : 0;
  
  // Calculate attendance rate
  const attendanceRate = student.attendance.length > 0
    ? Math.round((student.attendance.filter(a => a.present).length / student.attendance.length) * 100)
    : 0;

  // Get student rank if available
  const topStudents = getTopStudents();
  const studentRank = topStudents.find(s => s.id === student.id)?.rank || 'Not ranked';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {student.name}
        </h2>
        {canAddScore && (
          <Button onClick={() => onAddScore && onAddScore(student)}>
            <Award className="mr-2 h-4 w-4" />
            Add Score
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium">Student ID:</dt>
                <dd>{student.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Age:</dt>
                <dd>{student.age || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Phone:</dt>
                <dd>{student.phone || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Parent's Phone:</dt>
                <dd>{student.parentPhone || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Address:</dt>
                <dd>{student.address || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Group ID:</dt>
                <dd>{student.groupId || 'Not assigned'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium">Average Score:</dt>
                <dd>
                  <Badge variant={
                    averageScore >= 90 ? 'default' :
                    averageScore >= 70 ? 'secondary' :
                    'destructive'
                  }>
                    {averageScore}%
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Attendance Rate:</dt>
                <dd>
                  <Badge variant={
                    attendanceRate >= 90 ? 'default' :
                    attendanceRate >= 70 ? 'secondary' :
                    'destructive'
                  }>
                    {attendanceRate}%
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Coins:</dt>
                <dd>
                  <Badge variant="outline" className="bg-yellow-50">
                    <Award className="inline-block mr-1 h-3 w-3 text-yellow-500" />
                    {student.coins || 0}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Ranking:</dt>
                <dd>
                  <Badge variant="outline">
                    #{studentRank}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Recent Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.scores.length > 0 ? (
            <div className="space-y-3">
              {student.scores.slice(0, 5).map(score => (
                <div key={score.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{score.description || 'Score'}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(score.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant={
                    score.value >= 90 ? 'default' :
                    score.value >= 70 ? 'secondary' :
                    'destructive'
                  }>
                    {score.value}%
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No scores yet</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarCheck className="mr-2 h-5 w-5" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.attendance.length > 0 ? (
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {student.attendance.map((record, index) => (
                <div key={record.id} className="border rounded-md p-3 flex justify-between">
                  <span>{format(new Date(record.date), 'MMM d, yyyy')}</span>
                  <Badge variant={record.present ? 'default' : 'destructive'}>
                    {record.present ? 'Present' : 'Absent'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No attendance records yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetail;

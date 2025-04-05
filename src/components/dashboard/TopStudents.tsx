
import React, { useState, useEffect } from 'react';
import { apiGetTopStudents } from '@/lib/api';
import { Student } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, Users, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TopStudents = () => {
  const [topStudents, setTopStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        setIsLoading(true);
        const students = await apiGetTopStudents(10);
        setTopStudents(students);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch top students:', err);
        setError('Failed to load top students data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopStudents();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-yellow-500" />
          Top 10 Students
        </CardTitle>
        <CardDescription>Students ranked by performance and attendance</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edu-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : topStudents.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      <Coins className="h-4 w-4 mr-1" />
                      Coins
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <Badge variant={
                        index === 0 ? 'default' : 
                        index <= 2 ? 'secondary' : 
                        'outline'
                      }>
                        {index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.groupId}</TableCell>
                    <TableCell className="text-right">{student.coins || 0}</TableCell>
                    <TableCell className="text-right">
                      {student.attendance && student.attendance.length > 0
                        ? Math.round((student.attendance.filter(a => a.present).length / student.attendance.length) * 100)
                        : 0}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No student data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopStudents;

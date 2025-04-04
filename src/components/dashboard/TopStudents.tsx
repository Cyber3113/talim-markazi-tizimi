
import React from 'react';
import { getTopStudents } from '@/lib/authUtils';
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
import { Award, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TopStudents = () => {
  const topStudents = getTopStudents(10);

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
        {topStudents.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-right">Coins</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <Badge variant={
                        student.rank === 1 ? 'default' : 
                        student.rank <= 3 ? 'secondary' : 
                        'outline'
                      }>
                        {student.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.groupId}</TableCell>
                    <TableCell className="text-right">{student.coins || 0}</TableCell>
                    <TableCell className="text-right">
                      {Math.round(student.attendanceRate)}%
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

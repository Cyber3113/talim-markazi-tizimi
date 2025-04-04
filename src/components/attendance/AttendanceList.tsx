
import React from 'react';
import { Group, Student, Attendance } from '@/lib/types';
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
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X, CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceListProps {
  group: Group;
  onAddAttendance: () => void;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ group, onAddAttendance }) => {
  // Get unique dates from all attendance records
  const allAttendances = group.students.flatMap(student => student.attendance);
  const uniqueDates = [...new Set(allAttendances.map(a => a.date))].sort().reverse();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>{group.name}</CardDescription>
          </div>
          <Button onClick={onAddAttendance}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Record Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {uniqueDates.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  {group.students.map(student => (
                    <TableHead key={student.id}>
                      {student.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueDates.map(date => (
                  <TableRow key={date}>
                    <TableCell className="font-medium">
                      {format(new Date(date), 'MMM d, yyyy')}
                    </TableCell>
                    {group.students.map(student => {
                      const attendanceRecord = student.attendance.find(a => a.date === date);
                      return (
                        <TableCell key={student.id}>
                          {attendanceRecord ? (
                            attendanceRecord.present ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <Check className="h-4 w-4" /> Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <X className="h-4 w-4" /> Absent
                              </span>
                            )
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No attendance records yet</p>
            <Button className="mt-4" onClick={onAddAttendance}>Record First Attendance</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceList;

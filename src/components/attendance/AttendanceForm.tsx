
import React, { useState } from 'react';
import { Group, Student, AttendanceFormData } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

interface AttendanceFormProps {
  group: Group;
  onSubmit: (data: AttendanceFormData) => void;
  onCancel: () => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ group, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>(
    // Initialize with all students marked as absent
    group.students.reduce((acc, student) => {
      acc[student.id] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      date: today,
      studentIds: attendanceData,
    });
    
    toast({
      title: "Attendance recorded",
      description: `Attendance for ${format(new Date(today), 'MMMM d, yyyy')} has been saved.`,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Record Attendance</CardTitle>
          <CardDescription>
            {format(new Date(today), 'MMMM d, yyyy')} - {group.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {group.students.length > 0 ? (
            <div className="space-y-4">
              {group.students.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`student-${student.id}`} 
                      checked={attendanceData[student.id]} 
                      onCheckedChange={(checked) => handleAttendanceChange(student.id, checked === true)}
                    />
                    <label htmlFor={`student-${student.id}`} className="font-medium">
                      {student.name}
                    </label>
                  </div>
                  <div>
                    {attendanceData[student.id] ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <X className="h-4 w-4" /> Absent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students in this group</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={group.students.length === 0}>
            Save Attendance
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AttendanceForm;

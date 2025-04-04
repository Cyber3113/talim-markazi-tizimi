
import React, { useState } from 'react';
import { Group, Student, Attendance, AttendanceFormData } from '@/lib/types';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface AttendanceFormProps {
  group: Group;
  onSubmit: (data: AttendanceFormData) => void;
  onBack: () => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ group, onSubmit, onBack }) => {
  const { toast } = useToast();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [studentAttendance, setStudentAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(group.students.map(student => [student.id, false]))
  );
  const [coins, setCoins] = useState<Record<string, number>>(
    Object.fromEntries(group.students.map(student => [student.id, 0]))
  );

  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: checked
    }));
  };

  const handleCoinChange = (studentId: string, value: string) => {
    const coinValue = parseInt(value) || 0;
    setCoins(prev => ({
      ...prev,
      [studentId]: coinValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare attendance data
    const attendanceData: AttendanceFormData = {
      date,
      studentIds: studentAttendance
    };
    
    // Update each student's attendance and coins
    const studentsWithAttendance = group.students.map(student => {
      // Only add coins if the student is present
      const coinsToAdd = studentAttendance[student.id] ? coins[student.id] : 0;
      
      const newAttendance: Attendance = {
        id: Date.now().toString() + student.id,
        date,
        present: studentAttendance[student.id],
        studentId: student.id
      };
      
      return {
        ...student,
        attendance: [...student.attendance, newAttendance],
        coins: (student.coins || 0) + coinsToAdd
      };
    });
    
    onSubmit(attendanceData);
    
    toast({
      title: "Attendance recorded",
      description: `Attendance for ${format(new Date(date), 'MMMM d, yyyy')} has been saved`,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Record Attendance</CardTitle>
              <CardDescription>{group.name} - {group.schedule}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          {group.students.length > 0 ? (
            <div className="space-y-4">
              {group.students.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`attendance-${student.id}`}
                      checked={studentAttendance[student.id]}
                      onCheckedChange={(checked) => handleCheckboxChange(student.id, checked as boolean)}
                    />
                    <Label htmlFor={`attendance-${student.id}`} className="font-medium">
                      {student.name}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`coins-${student.id}`} className="text-sm">Coins:</Label>
                    <Input
                      id={`coins-${student.id}`}
                      type="number"
                      min="0"
                      className="w-20"
                      value={coins[student.id]}
                      onChange={(e) => handleCoinChange(student.id, e.target.value)}
                      disabled={!studentAttendance[student.id]}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No students in this group yet</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={group.students.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            Save Attendance
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AttendanceForm;


import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_GROUPS } from '@/lib/authUtils';
import { Group, Student } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Edit, Trash2, Eye, Award, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GroupForm from './GroupForm';
import StudentForm from '../students/StudentForm';
import StudentDetail from '../students/StudentDetail';
import AttendanceForm from '../attendance/AttendanceForm';
import AttendanceList from '../attendance/AttendanceList';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

const GroupList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewType, setViewType] = useState<'details' | 'attendance' | 'scores'>('details');
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [quickAttendance, setQuickAttendance] = useState<Record<string, boolean>>({});
  const [quickCoins, setQuickCoins] = useState<Record<string, number>>({});

  // Initialize quick attendance and coins when group is selected
  React.useEffect(() => {
    if (selectedGroup) {
      const initialAttendance = Object.fromEntries(
        selectedGroup.students.map(student => [student.id, false])
      );
      const initialCoins = Object.fromEntries(
        selectedGroup.students.map(student => [student.id, 0])
      );
      
      setQuickAttendance(initialAttendance);
      setQuickCoins(initialCoins);
    }
  }, [selectedGroup]);

  const handleAddGroup = (newGroup: Group) => {
    setGroups([...groups, { ...newGroup, id: Date.now().toString(), students: [] }]);
    setIsAddingGroup(false);
    toast({
      title: "Group added",
      description: `Group "${newGroup.name}" has been added successfully`,
    });
  };

  const handleEditGroup = (updatedGroup: Group) => {
    setGroups(groups.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
    setEditingGroup(null);
    toast({
      title: "Group updated",
      description: `Group "${updatedGroup.name}" has been updated successfully`,
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    toast({
      title: "Group deleted",
      description: "The group has been deleted successfully",
    });
  };

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    setViewType('details');
  };

  const handleAddStudent = (groupId: string) => {
    setSelectedGroup(groups.find(group => group.id === groupId) || null);
    setIsAddingStudent(true);
  };

  const handleSubmitNewStudent = (studentData) => {
    if (!selectedGroup) return;
    
    const newStudent: Student = {
      id: Date.now().toString(),
      name: studentData.name,
      userId: studentData.userId,
      address: studentData.address,
      phone: studentData.phone,
      parentPhone: studentData.parentPhone,
      age: studentData.age,
      groupId: selectedGroup.id,
      attendance: [],
      scores: [],
      coins: 0,
      username: studentData.username,
      password: studentData.password,
    };
    
    const updatedGroup = {
      ...selectedGroup,
      students: [...selectedGroup.students, newStudent],
    };
    
    setGroups(groups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    ));
    
    setSelectedGroup(updatedGroup);
    setIsAddingStudent(false);
    
    toast({
      title: "Student added",
      description: `${studentData.name} has been added to ${selectedGroup.name}`,
    });
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditingStudent(true);
  };

  const handleUpdateStudent = (studentData) => {
    if (!selectedGroup || !selectedStudent) return;
    
    const updatedStudent = {
      ...selectedStudent,
      name: studentData.name,
      userId: studentData.userId,
      address: studentData.address,
      phone: studentData.phone,
      parentPhone: studentData.parentPhone,
      age: studentData.age,
      username: studentData.username,
      password: studentData.password || selectedStudent.password,
    };
    
    const updatedGroup = {
      ...selectedGroup,
      students: selectedGroup.students.map(student => 
        student.id === selectedStudent.id ? updatedStudent : student
      ),
    };
    
    setGroups(groups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    ));
    
    setSelectedGroup(updatedGroup);
    setSelectedStudent(null);
    setIsEditingStudent(false);
    
    toast({
      title: "Student updated",
      description: `${studentData.name} has been updated successfully`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!selectedGroup) return;
    
    const updatedGroup = {
      ...selectedGroup,
      students: selectedGroup.students.filter(student => student.id !== studentId),
    };
    
    setGroups(groups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    ));
    
    setSelectedGroup(updatedGroup);
    
    toast({
      title: "Student removed",
      description: "Student has been removed from the group",
    });
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBackFromStudent = () => {
    setSelectedStudent(null);
  };

  const handleRecordAttendance = () => {
    setViewType('attendance');
  };

  const handleBackToGroupList = () => {
    setSelectedGroup(null);
    setSelectedStudent(null);
    setViewType('details');
  };

  const handleQuickAttendanceChange = (studentId: string, isPresent: boolean) => {
    setQuickAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
    
    // Show toast notification
    toast({
      title: isPresent ? "Marked as present" : "Marked as absent",
      description: `Student attendance updated for today (${format(new Date(), 'MMM d, yyyy')})`,
    });
    
    // Create a new attendance record for today
    if (!selectedGroup) return;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const student = selectedGroup.students.find(s => s.id === studentId);
    
    if (student) {
      // Check if there's already an attendance record for today
      const existingRecord = student.attendance.find(a => a.date === today);
      
      if (existingRecord) {
        // Update existing record
        const updatedStudent = {
          ...student,
          attendance: student.attendance.map(a => 
            a.date === today ? { ...a, present: isPresent } : a
          )
        };
        
        const updatedGroup = {
          ...selectedGroup,
          students: selectedGroup.students.map(s => 
            s.id === studentId ? updatedStudent : s
          )
        };
        
        setSelectedGroup(updatedGroup);
        setGroups(groups.map(group => 
          group.id === updatedGroup.id ? updatedGroup : group
        ));
      } else {
        // Create new record
        const newAttendance = {
          id: Date.now().toString(),
          date: today,
          present: isPresent,
          studentId
        };
        
        const updatedStudent = {
          ...student,
          attendance: [...student.attendance, newAttendance]
        };
        
        const updatedGroup = {
          ...selectedGroup,
          students: selectedGroup.students.map(s => 
            s.id === studentId ? updatedStudent : s
          )
        };
        
        setSelectedGroup(updatedGroup);
        setGroups(groups.map(group => 
          group.id === updatedGroup.id ? updatedGroup : group
        ));
      }
    }
  };

  const handleQuickCoinsChange = (studentId: string, coinsValue: string) => {
    const coins = parseInt(coinsValue) || 0;
    setQuickCoins(prev => ({
      ...prev,
      [studentId]: coins
    }));
  };

  const handleSaveQuickCoins = (studentId: string) => {
    if (!selectedGroup) return;
    
    const student = selectedGroup.students.find(s => s.id === studentId);
    if (student) {
      const coins = quickCoins[studentId] || 0;
      
      if (coins > 0) {
        const updatedStudent = {
          ...student,
          coins: (student.coins || 0) + coins
        };
        
        const updatedGroup = {
          ...selectedGroup,
          students: selectedGroup.students.map(s => 
            s.id === studentId ? updatedStudent : s
          )
        };
        
        setSelectedGroup(updatedGroup);
        setGroups(groups.map(group => 
          group.id === updatedGroup.id ? updatedGroup : group
        ));
        
        // Reset the input after adding
        setQuickCoins(prev => ({
          ...prev,
          [studentId]: 0
        }));
        
        toast({
          title: "Coins added",
          description: `${coins} coins added to ${student.name}`,
        });
      }
    }
  };

  const handleSubmitAttendance = (attendanceData) => {
    if (!selectedGroup) return;
    
    const { date, studentIds } = attendanceData;
    
    // Create attendance records for each student
    const updatedStudents = selectedGroup.students.map(student => {
      const isPresent = studentIds[student.id] || false;
      const coinsToAdd = isPresent ? (quickCoins[student.id] || 0) : 0;
      
      // Check if there's already an attendance record for this date
      const existingRecord = student.attendance.find(a => a.date === date);
      
      let newAttendance;
      if (existingRecord) {
        // Update existing record
        newAttendance = student.attendance.map(a => 
          a.date === date ? { ...a, present: isPresent } : a
        );
      } else {
        // Create new record
        const newRecord = {
          id: Date.now().toString() + student.id,
          date,
          present: isPresent,
          studentId: student.id
        };
        newAttendance = [...student.attendance, newRecord];
      }
      
      return {
        ...student,
        attendance: newAttendance,
        coins: (student.coins || 0) + coinsToAdd
      };
    });
    
    const updatedGroup = {
      ...selectedGroup,
      students: updatedStudents
    };
    
    setGroups(groups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    ));
    
    setSelectedGroup(updatedGroup);
    setViewType('details');
    
    toast({
      title: "Attendance recorded",
      description: `Attendance for ${format(new Date(date), 'MMMM d, yyyy')} has been saved`,
    });
  };

  if (isAddingGroup) {
    return <GroupForm onSubmit={handleAddGroup} onCancel={() => setIsAddingGroup(false)} />;
  }

  if (editingGroup) {
    return <GroupForm group={editingGroup} onSubmit={handleEditGroup} onCancel={() => setEditingGroup(null)} />;
  }

  if (isAddingStudent) {
    return <StudentForm 
      onSubmit={handleSubmitNewStudent} 
      onCancel={() => setIsAddingStudent(false)} 
      groupId={selectedGroup?.id}
    />;
  }

  if (isEditingStudent && selectedStudent) {
    return <StudentForm 
      student={selectedStudent}
      onSubmit={handleUpdateStudent} 
      onCancel={() => setIsEditingStudent(false)} 
      groupId={selectedStudent.groupId}
    />;
  }

  if (selectedStudent) {
    return (
      <StudentDetail 
        student={selectedStudent} 
        onBack={handleBackFromStudent}
        canAddScore={user?.role === 'Mentor' || user?.role === 'CEO'} 
      />
    );
  }

  if (selectedGroup) {
    // Return the group detail component
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
            <p className="text-muted-foreground">{selectedGroup.schedule}</p>
          </div>
          <div className="flex gap-2">
            {(user?.role === 'Mentor' || user?.role === 'CEO') && viewType === 'details' && (
              <Button onClick={handleRecordAttendance}>
                Record Attendance
              </Button>
            )}
            <Button variant="outline" onClick={handleBackToGroupList}>Back to Groups</Button>
          </div>
        </div>

        {viewType === 'details' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Group Details</CardTitle>
                <CardDescription>{selectedGroup.schedule}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Mentor:</span>
                    <span>{MOCK_GROUPS.find(g => g.id === selectedGroup.id)?.mentorId}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Students:</span>
                    <span>{selectedGroup.students.length}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Price:</span>
                    <span>{selectedGroup.price ? `${selectedGroup.price}` : 'Not set'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Students</CardTitle>
                  {(user?.role === 'CEO' || user?.role === 'Mentor' || user?.role === 'Admin') && (
                    <Button size="sm" onClick={() => handleAddStudent(selectedGroup.id)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Student
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedGroup.students.length > 0 ? (
                  <div className="space-y-4">
                    {selectedGroup.students.map(student => (
                      <div key={student.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border rounded-md gap-2">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <span>Age: {student.age || 'N/A'}</span>
                            <span>Coins: {student.coins || 0}</span>
                          </div>
                        </div>
                        
                        {(user?.role === 'Mentor' || user?.role === 'CEO') && (
                          <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`quick-attendance-${student.id}`}
                                checked={quickAttendance[student.id] || false}
                                onCheckedChange={(checked) => 
                                  handleQuickAttendanceChange(student.id, checked as boolean)
                                }
                              />
                              <label 
                                htmlFor={`quick-attendance-${student.id}`}
                                className="text-sm cursor-pointer"
                              >
                                Present
                              </label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                className="w-16 h-8"
                                value={quickCoins[student.id] || ''}
                                onChange={(e) => handleQuickCoinsChange(student.id, e.target.value)}
                                placeholder="Coins"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleSaveQuickCoins(student.id)}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-2 mt-2 md:mt-0">
                          <Button variant="outline" size="icon" onClick={() => handleViewStudent(student)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(user?.role === 'CEO' || user?.role === 'Mentor' || user?.role === 'Admin') && (
                            <>
                              <Button variant="outline" size="icon" onClick={() => handleEditStudent(student)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {user?.role === 'Mentor' && (
                                <Button variant="outline" size="icon">
                                  <Award className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No students in this group yet</p>
                    <Button className="mt-4" variant="outline" onClick={() => handleAddStudent(selectedGroup.id)}>
                      Add First Student
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {viewType === 'attendance' && (
          <AttendanceForm 
            group={selectedGroup} 
            onBack={() => setViewType('details')}
            onSubmit={handleSubmitAttendance}
          />
        )}
      </div>
    );
  }

  const filteredGroups = user?.role === 'Mentor' 
    ? groups.filter(group => group.mentorId === user.id)
    : groups;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Groups</h2>
        {user?.role === 'CEO' && (
          <Button onClick={() => setIsAddingGroup(true)}>
            <Users className="mr-2 h-4 w-4" />
            Add New Group
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map(group => (
          <Card key={group.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.schedule}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Students:</span>
                  <span className="font-medium">{group.students.length}</span>
                </div>
                {group.price && (
                  <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span className="font-medium">{group.price}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="flex border-t p-3 gap-2 justify-end bg-muted/30">
              <Button variant="outline" size="sm" onClick={() => handleViewGroup(group)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {user?.role === 'CEO' && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setEditingGroup(group)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteGroup(group.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupList;

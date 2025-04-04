
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
import { Users, UserPlus, Edit, Trash2, Eye, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GroupForm from './GroupForm';
import StudentForm from '../students/StudentForm';
import StudentDetail from '../students/StudentDetail';
import AttendanceList from '../attendance/AttendanceList';
import { format } from 'date-fns';

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
                      <div key={student.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <span>Age: {student.age || 'N/A'}</span>
                            <span>Coins: {student.coins || 0}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewStudent(student)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(user?.role === 'CEO' || user?.role === 'Mentor' || user?.role === 'Admin') && (
                            <>
                              <Button variant="outline" size="icon">
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
            onSubmit={(attendanceData) => {
              // Handle attendance submission
              setViewType('details');
            }} 
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

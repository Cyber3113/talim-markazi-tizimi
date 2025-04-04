
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_GROUPS } from '@/lib/authUtils';
import { Group } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GroupForm from './GroupForm';

const GroupList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

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
  };

  if (isAddingGroup) {
    return <GroupForm onSubmit={handleAddGroup} onCancel={() => setIsAddingGroup(false)} />;
  }

  if (editingGroup) {
    return <GroupForm group={editingGroup} onSubmit={handleEditGroup} onCancel={() => setEditingGroup(null)} />;
  }

  if (selectedGroup) {
    // Return the group detail component
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
          <Button variant="outline" onClick={() => setSelectedGroup(null)}>Back to Groups</Button>
        </div>
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
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Students</CardTitle>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedGroup.students.length > 0 ? (
              <div className="space-y-4">
                {selectedGroup.students.map(student => (
                  <div key={student.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No students in this group yet</p>
                <Button className="mt-4" variant="outline">Add First Student</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {groups.map(group => (
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


import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_USERS, MOCK_GROUPS } from '@/lib/authUtils';
import { User, UserRole } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Edit, Trash2, Eye, Users, Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MentorForm from './MentorForm';
import MentorDetail from './MentorDetail';

const MentorList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<User[]>(
    MOCK_USERS.filter(user => user.role === 'Mentor')
  );
  const [isAddingMentor, setIsAddingMentor] = useState(false);
  const [editingMentor, setEditingMentor] = useState<User | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  const [isAssigningGroup, setIsAssigningGroup] = useState(false);

  const handleAddMentor = (newMentor: User) => {
    setMentors([...mentors, { ...newMentor, id: Date.now().toString() }]);
    setIsAddingMentor(false);
    toast({
      title: "Mentor added",
      description: `Mentor "${newMentor.name}" has been added successfully`,
    });
  };

  const handleEditMentor = (updatedMentor: User) => {
    setMentors(mentors.map(mentor => 
      mentor.id === updatedMentor.id ? updatedMentor : mentor
    ));
    setEditingMentor(null);
    toast({
      title: "Mentor updated",
      description: `Mentor "${updatedMentor.name}" has been updated successfully`,
    });
  };

  const handleDeleteMentor = (mentorId: string) => {
    setMentors(mentors.filter(mentor => mentor.id !== mentorId));
    toast({
      title: "Mentor deleted",
      description: "The mentor has been deleted successfully",
    });
  };

  const handleViewMentor = (mentor: User) => {
    setSelectedMentor(mentor);
  };

  const getMentorGroups = (mentorId: string) => {
    return MOCK_GROUPS.filter(group => group.mentorId === mentorId);
  };

  if (isAddingMentor) {
    return <MentorForm onSubmit={handleAddMentor} onCancel={() => setIsAddingMentor(false)} />;
  }

  if (editingMentor) {
    return <MentorForm mentor={editingMentor} onSubmit={handleEditMentor} onCancel={() => setEditingMentor(null)} />;
  }

  if (selectedMentor) {
    return <MentorDetail 
      mentor={selectedMentor} 
      onBack={() => setSelectedMentor(null)} 
      onEdit={() => {
        setEditingMentor(selectedMentor);
        setSelectedMentor(null);
      }}
    />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mentors</h2>
        {user?.role === 'CEO' && (
          <Button onClick={() => setIsAddingMentor(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Mentor
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map(mentor => {
          const mentorGroups = getMentorGroups(mentor.id);
          
          return (
            <Card key={mentor.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{mentor.name}</CardTitle>
                <CardDescription>Username: {mentor.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Groups:</span>
                    <span className="font-medium">{mentorGroups.length}</span>
                  </div>
                  
                  {mentorGroups.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Assigned Groups:</p>
                      <div className="text-sm space-y-1">
                        {mentorGroups.map(group => (
                          <div key={group.id} className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{group.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="flex border-t p-3 gap-2 justify-end bg-muted/30">
                <Button variant="outline" size="sm" onClick={() => handleViewMentor(mentor)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {user?.role === 'CEO' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setEditingMentor(mentor)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteMentor(mentor.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MentorList;

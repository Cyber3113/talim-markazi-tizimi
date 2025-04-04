
import React from 'react';
import { User } from '@/lib/types';
import { MOCK_GROUPS } from '@/lib/authUtils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MentorDetailProps {
  mentor: User;
  onBack: () => void;
  onEdit: () => void;
}

const MentorDetail: React.FC<MentorDetailProps> = ({ mentor, onBack, onEdit }) => {
  const { user } = useAuth();
  const mentorGroups = MOCK_GROUPS.filter(group => group.mentorId === mentor.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{mentor.name}</h2>
        </div>
        {user?.role === 'CEO' && (
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Mentor
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mentor Information</CardTitle>
            <CardDescription>Personal and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Name:</span>
              <span>{mentor.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Username:</span>
              <span>{mentor.username}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Role:</span>
              <span>{mentor.role}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Groups</CardTitle>
            <CardDescription>Groups this mentor is teaching</CardDescription>
          </CardHeader>
          <CardContent>
            {mentorGroups.length > 0 ? (
              <div className="space-y-4">
                {mentorGroups.map(group => (
                  <div key={group.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{group.schedule}</p>
                    </div>
                    <div>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {group.students.length} students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No groups assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDetail;

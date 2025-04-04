
import React, { useState, useEffect } from 'react';
import { Group, GroupFormData } from '@/lib/types';
import { MOCK_USERS } from '@/lib/authUtils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GroupFormProps {
  group?: Group;
  onSubmit: (group: Group) => void;
  onCancel: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: group?.name || '',
    mentorId: group?.mentorId || '',
    schedule: group?.schedule || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    mentorId: '',
    schedule: '',
  });

  const mentors = MOCK_USERS.filter(user => user.role === 'Mentor');

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? '' : 'Group name is required',
      mentorId: formData.mentorId ? '' : 'Mentor selection is required',
      schedule: formData.schedule ? '' : 'Schedule is required',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMentorChange = (value: string) => {
    setFormData(prev => ({ ...prev, mentorId: value }));
    if (errors.mentorId) {
      setErrors(prev => ({ ...prev, mentorId: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        id: group?.id || '',
        ...formData,
        students: group?.students || [],
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{group ? 'Edit Group' : 'Create New Group'}</CardTitle>
          <CardDescription>
            {group 
              ? 'Update the group information below' 
              : 'Fill in the details to create a new group'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter group name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mentorId">Mentor</Label>
            <Select 
              value={formData.mentorId} 
              onValueChange={handleMentorChange}
            >
              <SelectTrigger className={errors.mentorId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map(mentor => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mentorId && <p className="text-sm text-red-500">{errors.mentorId}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="E.g., Mon, Wed 15:00-16:30"
              className={errors.schedule ? 'border-red-500' : ''}
            />
            {errors.schedule && <p className="text-sm text-red-500">{errors.schedule}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {group ? 'Update Group' : 'Create Group'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GroupForm;


import React, { useState } from 'react';
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
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface GroupFormProps {
  group?: Group;
  onSubmit: (data: GroupFormData) => void;
  onCancel: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const mentors = MOCK_USERS.filter(user => user.role === 'Mentor');
  
  const [formData, setFormData] = useState<GroupFormData>({
    name: group?.name || '',
    mentorId: group?.mentorId || '',
    schedule: group?.schedule || '',
    price: group?.price || undefined,
  });

  const [errors, setErrors] = useState({
    name: '',
    mentorId: '',
    schedule: '',
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? '' : 'Group name is required',
      mentorId: formData.mentorId ? '' : 'Please select a mentor',
      schedule: formData.schedule ? '' : 'Schedule is required',
      price: '',
    };
    
    if (formData.price !== undefined) {
      const price = Number(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert price to number
      const submissionData = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
      };
      
      onSubmit(submissionData);
      
      toast({
        title: group ? "Group updated" : "Group created",
        description: `Group "${formData.name}" has been ${group ? 'updated' : 'created'} successfully.`,
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{group ? 'Edit Group' : 'Create New Group'}</CardTitle>
          <CardDescription>
            {group 
              ? 'Update the group information' 
              : 'Enter the details of the new group'}
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
              onValueChange={(value) => handleSelectChange(value, 'mentorId')}
            >
              <SelectTrigger className={errors.mentorId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((mentor) => (
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
              placeholder="e.g., Mon, Wed 15:00-16:30"
              className={errors.schedule ? 'border-red-500' : ''}
            />
            {errors.schedule && <p className="text-sm text-red-500">{errors.schedule}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="Enter group price"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
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

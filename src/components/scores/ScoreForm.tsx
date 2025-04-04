
import React, { useState } from 'react';
import { Group, Student, ScoreFormData } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface ScoreFormProps {
  group: Group;
  student: Student;
  onSubmit: (data: ScoreFormData) => void;
  onCancel: () => void;
}

const ScoreForm: React.FC<ScoreFormProps> = ({ group, student, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState<{
    value: number;
    description: string;
  }>({
    value: 0,
    description: '',
  });

  const [errors, setErrors] = useState({
    value: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'value' ? Number(value) : value 
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      value: (formData.value < 0 || formData.value > 100) 
        ? 'Score must be between 0 and 100' 
        : '',
      description: formData.description ? '' : 'Description is required',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        date: today,
        studentId: student.id,
        value: formData.value,
        description: formData.description,
      });
      
      toast({
        title: "Score added",
        description: `A score of ${formData.value} has been added for ${student.name}.`,
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add Score</CardTitle>
          <CardDescription>
            {format(new Date(today), 'MMMM d, yyyy')} - {student.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">Score (0-100)</Label>
            <Input
              id="value"
              name="value"
              type="number"
              min="0"
              max="100"
              value={formData.value}
              onChange={handleChange}
              className={errors.value ? 'border-red-500' : ''}
            />
            {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this score for?"
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Score
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ScoreForm;

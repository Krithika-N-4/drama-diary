'use client';

import {useState, useEffect} from 'react';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';

interface DramaFormProps {
  onSubmit: (drama: {
    title: string;
    language: string;
    year: number;
    status: string;
    favorite: boolean;
  }) => void;
  setOpen: (open: boolean) => void;
  initialDrama?: {
    title: string;
    language: string;
    year: number;
    status: string;
    favorite: boolean;
  };
}

const DramaForm: React.FC<DramaFormProps> = ({
  onSubmit,
  setOpen,
  initialDrama,
}) => {
  const [title, setTitle] = useState(initialDrama?.title || '');
  const [language, setLanguage] = useState(initialDrama?.language || '');
  const [year, setYear] = useState<number | undefined>(initialDrama?.year);
  const [status, setStatus] = useState(initialDrama?.status || '');
  const [favorite, setFavorite] = useState(initialDrama?.favorite || false);

  useEffect(() => {
    if (initialDrama) {
      setTitle(initialDrama.title);
      setLanguage(initialDrama.language);
      setYear(initialDrama.year);
      setStatus(initialDrama.status);
      setFavorite(initialDrama.favorite);
    } else {
      // Reset to empty form
      setTitle('');
      setLanguage('');
      setYear('');
      setStatus('Watchlist');
      setFavorite(false);
    }
  }, [initialDrama]);
 

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title && language && year && status) {
      onSubmit({title, language, year, status, favorite});
      setOpen(false); // Close the dialog after submitting
    } else {
      alert('Please fill in all fields.');
    }
    setTitle('');
    setLanguage('');
    setYear(new Date().getFullYear());
    setStatus('Watchlist');
    setFavorite(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="language">Language</Label>
        <Select onValueChange={setLanguage} defaultValue={language}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Korean">Korean</SelectItem>
            <SelectItem value="Thai">Thai</SelectItem>
            <SelectItem value="Japanese">Japanese</SelectItem>
            <SelectItem value="Chinese">Chinese</SelectItem>
            <SelectItem value="Taiwanese">Taiwanese</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="year">Year</Label>
        <Input
          type="number"
          id="year"
          value={year !== undefined ? year.toString() : ''}
          onChange={e =>
            setYear(e.target.value ? parseInt(e.target.value, 10) : undefined)
          }
          placeholder="Enter year"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={setStatus} defaultValue={status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Watchlist">Watchlist</SelectItem>
            <SelectItem value="Watching">Watching</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On-Hold">On-Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="favorite">Favorite</Label>
        <Switch
          id="favorite"
          checked={favorite}
          onCheckedChange={setFavorite}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default DramaForm;

    

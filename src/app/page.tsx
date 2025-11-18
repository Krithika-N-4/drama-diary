'use client';

import {useState, useEffect} from 'react';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {Button} from '@/components/ui/button';
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {Edit, Trash} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import DramaForm from '@/components/drama-form';
import {useToast} from '@/hooks/use-toast';
import {Separator} from '@/components/ui/separator';
import {Input} from '@/components/ui/input';
import {ThemeToggle} from '@/components/theme-toggle';
import {Switch} from '@/components/ui/switch';
import {ScrollArea} from '@/components/ui/scroll-area';

interface Drama {
  id: string;
  title: string;
  language: string;
  year: number;
  status: 'Watchlist' | 'Watching' | 'Completed' | 'Recommended';
  favorite: boolean;
}

  const DramaList = ({ dramas, onDelete, onEdit }) => {
    return (
      <div className="space-y-3">
        {dramas.length === 0 ? (
          <p>No dramas found.</p>
        ) : (
          dramas.map((drama) => {
            // Determine border color based on status
            let statusColor = '';
            if (drama.status === 'Watchlist') {
              statusColor = 'border-red-500';
            } else if (drama.status === 'Watching') {
              statusColor = 'border-blue-500';
            } else if (drama.status === 'Completed') {
              statusColor = 'border-green-500';
            } else if (drama.status === 'On-Hold') {
              statusColor = 'border-yellow-500';
            }
  
            return (
              <Card 
                key={drama.id} 
                className={`overflow-hidden border-l-4 ${statusColor}`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">
                        {drama.title} {drama.favorite && <span className="text-red-500">❤️</span>}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {drama.language}, {drama.year}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground text-sm">
                        {drama.status}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="p-2 h-8 w-8"
                          onClick={() => {
                            // Properly call the onEdit function with the drama object
                            onEdit(drama);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="p-2 h-8 w-8"
                          onClick={() => onDelete(drama.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    );
  };

const Sidebar = ({
  dramas,
  onLanguageChange,
  onYearChange,
  onToggleFavorite,
  selectedLanguage,
  selectedYear,
  isFavorite,
}: {
  dramas: Drama[];
  onLanguageChange: (language: string | null) => void;
  onYearChange: (year: number | null) => void;
  onToggleFavorite: (favorite: boolean) => void;
  selectedLanguage: string | null;
  selectedYear: number | null;
  isFavorite: boolean;
}) => {
  const languages = [...new Set(dramas.map(drama => drama.language))];
  const years = [...new Set(dramas.map(drama => drama.year))].sort((a, b) => b - a);

  return (
    <div className="w-full p-4 bg-card rounded-lg shadow-sm border border-border">
      {/* Favorites toggle with better alignment */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">
            <span className="mr-1">❤️</span> Favorites Only
          </h4>
          <Switch 
            checked={isFavorite} 
            onCheckedChange={onToggleFavorite}
            className="ml-2 data-[state=checked]:bg-red-500" 
          />
        </div>
      </div>
      <Separator className="mb-4" />
      
      {/* Languages section with improved spacing */}
      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2">Languages</h4>
        <div className="space-y-1">
          {languages.map(language => (
            <Button
              key={language}
              variant={selectedLanguage === language ? 'secondary' : 'ghost'}
              className="w-full justify-start text-sm h-8"
              onClick={() =>
                onLanguageChange(selectedLanguage === language ? null : language)
              }
            >
              {language}
            </Button>
          ))}
        </div>
      </div>
      <Separator className="mb-4" />
      
      {/* Years section with improved spacing */}
      <div>
        <h4 className="font-medium text-sm mb-2">Years</h4>
        <div className="space-y-1">
          {years.map(year => (
            <Button
              key={year}
              variant={selectedYear === year ? 'secondary' : 'ghost'}
              className="w-full justify-start text-sm h-8"
              onClick={() =>
                onYearChange(selectedYear === year ? null : year)
              }
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function Home() {
  const [open, setOpen] = useState(false);
  const [dramas, setDramas] = useState<Drama[]>([]);
  const {toast} = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drama[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Add a new state for filtered dramas
  const [filteredDramas, setFilteredDramas] = useState<Drama[]>([]);
  const [activeTab, setActiveTab] = useState("watchlist");
  const [editOpen, setEditOpen] = useState(false);
  const [currentDrama, setCurrentDrama] = useState<Drama | null>(null);

  useEffect(() => {
    // Load data from local storage on initial load
    const storedDramas = localStorage.getItem('dramas');
    if (storedDramas) {
      const parsedDramas = JSON.parse(storedDramas);
      setDramas(parsedDramas);
      setFilteredDramas(parsedDramas); // Initialize filtered dramas with all dramas
    }
  }, []);

  useEffect(() => {
    // Save dramas to local storage whenever it changes
    localStorage.setItem('dramas', JSON.stringify(dramas));
  }, [dramas]);

  const addDrama = (drama: Omit<Drama, 'id'>) => {
    const newDrama = {...drama, id: Math.random().toString()};
    const updatedDramas = [newDrama, ...dramas];
    setDramas(updatedDramas);
    // Update filtered dramas as well when adding a new drama
    applyFilters(updatedDramas, searchQuery, selectedLanguage, selectedYear, isFavorite);
    toast({
      title: 'Drama added!',
      description: `Successfully added ${drama.title} to your list.`,
    });
    setOpen(false);
  };

  const handleEdit = (drama: Drama) => {
    setCurrentDrama(drama);
    setEditOpen(true);
  };

  const editDrama = (updatedDramaData: Omit<Drama, 'id'>) => {
    if (!currentDrama) return;
    
    const updatedDrama = { ...updatedDramaData, id: currentDrama.id };
    const updatedDramas = dramas.map(drama => 
      drama.id === updatedDrama.id ? updatedDrama : drama
    );
    
    setDramas(updatedDramas);
    applyFilters(updatedDramas, searchQuery, selectedLanguage, selectedYear, isFavorite);
    
    toast({
      title: 'Drama edited!',
      description: `Successfully edited ${updatedDrama.title} in your list.`,
    });
    
    setEditOpen(false);
    setCurrentDrama(null);
  };


  const deleteDrama = (id: string) => {
    const updatedDramas = dramas.filter(drama => drama.id !== id);
    setDramas(updatedDramas);
    // Update filtered dramas as well when deleting a drama
    applyFilters(updatedDramas, searchQuery, selectedLanguage, selectedYear, isFavorite);
    toast({
      title: 'Drama deleted!',
      description: `Successfully deleted from your list.`,
    });
  };  

  // Function to apply all filters
  const applyFilters = (
    dramaList: Drama[],
    query: string,
    language: string | null,
    year: number | null,
    favorite: boolean
  ) => {
    let results = dramaList;

    // Apply search query filter
    if (query) {
      if (query === "❤️") {
        results = results.filter(drama => drama.favorite);
      } else {
        const searchTerm = query.toLowerCase();
        results = results.filter(drama => 
          drama.title.toLowerCase().includes(searchTerm) ||
          drama.language.toLowerCase().includes(searchTerm) ||
          drama.year.toString().includes(searchTerm)
        );
      }
    }

    // Apply language filter
    if (language) {
      results = results.filter(drama => drama.language === language);
    }

    // Apply year filter
    if (year) {
      results = results.filter(drama => drama.year === year);
    }

    // Apply favorite filter
    if (favorite) {
      results = results.filter(drama => drama.favorite);
    }

    setFilteredDramas(results);
    setSearchResults(results);
  };

  // Update filtered dramas whenever filters change
  useEffect(() => {
    applyFilters(dramas, searchQuery, selectedLanguage, selectedYear, isFavorite);
  }, [searchQuery, dramas, selectedLanguage, selectedYear, isFavorite]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
    }
  };

  const handleLanguageChange = (language: string | null) => {
    setSelectedLanguage(language);
    setSearchQuery(''); // Clear search query when a filter is applied
  };

  const handleYearChange = (year: number | null) => {
    setSelectedYear(year);
    setSearchQuery(''); // Clear search query when a filter is applied
  };

  const handleToggleFavorite = (favorite: boolean) => {
    setIsFavorite(favorite);
    setSearchQuery(''); // Clear search query when a filter is applied
  };

  // Get filtered dramas by status
  const filteredWatchlist = filteredDramas.filter(drama => drama.status === 'Watchlist');
  const filteredWatching = filteredDramas.filter(drama => drama.status === 'Watching');
  const filteredCompleted = filteredDramas.filter(drama => drama.status === 'Completed');
  const filteredOnHold = filteredDramas.filter(drama => drama.status === 'On-Hold');

  const noDramasFound = filteredDramas.length === 0;
  
  const hasFilter = selectedLanguage || selectedYear || isFavorite;

  let filterText = [];
  if (selectedLanguage) {
    filterText.push(selectedLanguage);
  }
  if (selectedYear) {
    filterText.push(selectedYear.toString());
  }
  if (isFavorite) {
    filterText.push('❤️ Favorites');
  }

  // Join all filters with a separator
  const displayFilterText = filterText.join(' | ');

  const clearFilters = () => {
    setSelectedLanguage(null);
    setSelectedYear(null);
    setIsFavorite(false);
    setSearchQuery('');
  };


// Main component return statement with fixes for mobile UI
return (
  <div className="flex flex-col md:flex-row">
    {/* Mobile Header with Hamburger */}
    <div className="flex justify-between items-center px-4 py-4 md:hidden sticky top-0 z-10 bg-background shadow-sm">
      <h1 className="text-xl font-bold">Drama-Diary</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <button className="p-1">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 max-w-xs p-0 shadow-lg rounded-r-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Filter Options</h2>
              <Sidebar
                dramas={dramas}
                onLanguageChange={handleLanguageChange}
                onYearChange={handleYearChange}
                onToggleFavorite={handleToggleFavorite}
                selectedLanguage={selectedLanguage}
                selectedYear={selectedYear}
                isFavorite={isFavorite}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    {/* Sidebar for Desktop */}
    <div className="hidden md:block py-[107px] pr-[30px] pl-[60px]">
      <Sidebar
        dramas={dramas}
        onLanguageChange={handleLanguageChange}
        onYearChange={handleYearChange}
        onToggleFavorite={handleToggleFavorite}
        selectedLanguage={selectedLanguage}
        selectedYear={selectedYear}
        isFavorite={isFavorite}
      />
    </div>

    {/* Main content */}
    <div className="flex-1 px-4 py-4 md:pl-[40px] md:pr-[100px] md:py-[50px]">
      {/* Header and Theme toggle (for desktop) */}
      <div className="hidden md:flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Drama-Diary</h1>
        <ThemeToggle />
      </div>

      {/* Search bar - Added more padding to top for status bar */}
      <div className="sticky top-16 md:static z-10 bg-background pt-4 pb-3">
        <Input
          type="search"
          placeholder="Search dramas..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="mb-4"
        />
      </div>

      {noDramasFound && <p className="pb-5">No dramas found.</p>}

      {searchQuery && searchResults.length > 0 && (
        <div>
          {searchResults.map((drama) => (
            <Card key={drama.id} className="mb-3">
              <CardContent className="p-3">
                <CardTitle className="text-base">
                  {drama.title}{" "}
                  {drama.favorite && <span className="text-red-500">❤️</span>} ({drama.year})
                </CardTitle>
                <CardDescription className="pt-1">Status: {drama.status}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasFilter && (
        <div className="mb-4 p-3 bg-secondary rounded-md flex justify-between items-center">
          <span className="text-sm pr-2">Filtering by: {displayFilterText}</span>
          <button
            onClick={clearFilters}
            className="text-red-500 hover:text-red-700 flex-shrink-0"
            title="Clear filters"
          >
            ❌
          </button>
        </div>
      )}

      {/* Fixed Tabs with consistent styling and improved spacing */}
      <div className="bg-background pt-1 pb-6 sticky top-[98px] md:static z-10">
        {/* First row: Watchlist and Watching */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`py-2.5 px-2 rounded-md text-sm font-medium shadow-sm text-center ${
              activeTab === "watchlist" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Watchlist ({filteredWatchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("watching")}
            className={`py-2.5 px-2 rounded-md text-sm font-medium shadow-sm text-center ${
              activeTab === "watching" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Watching ({filteredWatching.length})
          </button>
        </div>
        
        {/* Second row: Completed and Recommended */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-2.5 px-2 rounded-md text-sm font-medium shadow-sm text-center ${
              activeTab === "completed" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Completed ({filteredCompleted.length})
          </button>
          <button
            onClick={() => setActiveTab("on-hold")}
            className={`py-2.5 px-2 rounded-md text-sm font-medium shadow-sm text-center ${
              activeTab === "on-hold" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            On-Hold ({filteredOnHold.length})
          </button>
        </div>
        
        {/* Content area */}
        <div className="mt-4">
          {activeTab === "watchlist" && (
            <DramaList dramas={filteredWatchlist} onDelete={deleteDrama} onEdit={handleEdit} />
          )}
          {activeTab === "watching" && (
            <DramaList dramas={filteredWatching} onDelete={deleteDrama} onEdit={handleEdit} />
          )}
          {activeTab === "completed" && (
            <DramaList dramas={filteredCompleted} onDelete={deleteDrama} onEdit={handleEdit} />
          )}
          {activeTab === "on-hold" && (
            <DramaList dramas={filteredOnHold} onDelete={deleteDrama} onEdit={handleEdit} />
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="primary"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white bg-black hover:bg-gray-800 p-0 z-20"
            aria-label="Add Drama"
          >
            <Edit className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Drama</DialogTitle>
          </DialogHeader>
          <DramaForm onSubmit={addDrama} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={editOpen} 
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) {
              // Reset currentDrama when closing the dialog
              setCurrentDrama(null);
            }
          }}
        >
        <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Drama</DialogTitle>
          </DialogHeader>
          <DramaForm 
        onSubmit={editDrama} 
        setOpen={setEditOpen}
        initialDrama={currentDrama || undefined} 
        />
        </DialogContent>
      </Dialog>

      
    </div>
  </div>
);
}

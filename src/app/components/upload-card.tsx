'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Link as LinkIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useData } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';

export function UploadCard() {
  const router = useRouter();
  const { setDataset, setFileName, setDatasetDescription } = useData();
  const [file, setFile] = useState<File | null>(null);
  const [kaggleUrl, setKaggleUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !description) {
      toast({
        title: "Missing Information",
        description: "Please select a file and provide a description.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDataset(text);
      setFileName(file.name);
      setDatasetDescription(description);
      toast({
        title: "Success!",
        description: "Your dataset has been loaded.",
      });
      router.push('/dashboard');
    };
    reader.onerror = () => {
       toast({
        title: "Error",
        description: "Failed to read the file.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    reader.readAsText(file);
  };
  
  const handleKaggleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!kaggleUrl || !description) {
      toast({
        title: "Missing Information",
        description: "Please provide a Kaggle URL and a description.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      const mockCsv = `sepal_length,sepal_width,petal_length,petal_width,species\n5.1,3.5,1.4,0.2,setosa\n4.9,3.0,1.4,0.2,setosa\n7.0,3.2,4.7,1.4,versicolor\n6.4,3.2,4.5,1.5,versicolor\n6.3,3.3,6.0,2.5,virginica\n5.8,2.7,5.1,1.9,virginica`;
      setDataset(mockCsv);
      setFileName(`kaggle_iris_dataset.csv`);
      setDatasetDescription(description);
      toast({
        title: "Success!",
        description: "Kaggle dataset imported successfully.",
      });
      router.push('/dashboard');
    }, 1500);
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Get Started</CardTitle>
        <CardDescription>Upload your dataset or import from Kaggle to begin analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <Label htmlFor="description">1. Describe Your Dataset</Label>
          <Textarea 
            id="description" 
            placeholder="e.g., Iris flower dataset with measurements for three species." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="h-24"
          />
          <p className="text-sm text-muted-foreground">A brief description helps the AI understand your data's context.</p>
        </div>
        
        <Label>2. Provide Your Data</Label>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={isLoading}><UploadCloud className="mr-2 h-4 w-4" /> Upload File</TabsTrigger>
            <TabsTrigger value="kaggle" disabled={isLoading}><LinkIcon className="mr-2 h-4 w-4" /> Import from Kaggle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <form onSubmit={handleFileUploadSubmit} className="space-y-4 pt-4">
              <div>
                <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !file || !description}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRight className="mr-2 h-4 w-4" />}
                {isLoading ? 'Processing...' : 'Analyze Dataset'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="kaggle">
            <form onSubmit={handleKaggleSubmit} className="space-y-4 pt-4">
              <div>
                <Input 
                  id="kaggle-url" 
                  placeholder="https://www.kaggle.com/datasets/..."
                  value={kaggleUrl}
                  onChange={(e) => setKaggleUrl(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !kaggleUrl || !description}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRight className="mr-2 h-4 w-4" />}
                {isLoading ? 'Importing...' : 'Import & Analyze'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

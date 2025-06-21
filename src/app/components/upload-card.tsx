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

    // Using a more realistic, larger mock dataset for demonstration
    setTimeout(() => {
      const mockCsv = `Year,Industry_aggregation_NZSIOC,Industry_code_NZSIOC,Industry_name_NZSIOC,Units,Variable_code,Variable_name,Variable_category,Value,Industry_code_ANZSIC06
2021,Level 1,99999,All industries,Dollars (millions),H01,Total income,Financial,"29,355",ANZSIC06 divisions A-S (excluding classes K6330, L6711, O7552, O760, O771, O772, S9540, S9601, S9602, and S9603)
2021,Level 1,99999,All industries,Dollars (millions),H04,"Sales, goods and services",Financial,"26,591",ANZSIC06 divisions A-S (excluding classes K6330, L6711, O7552, O760, O771, O772, S9540, S9601, S9602, and S9603)
2021,Level 1,99999,All industries,Dollars (millions),H05,"Interest, dividends and donations",Financial,"2,544",ANZSIC06 divisions A-S (excluding classes K6330, L6711, O7552, O760, O771, O772, S9540, S9601, S9602, and S9603)
2021,Level 1,99999,All industries,Dollars (millions),H07,Non-operating income,Financial,"220",ANZSIC06 divisions A-S (excluding classes K6330, L6711, O7552, O760, O771, O772, S9540, S9601, S9602, and S9603)
2021,Level 1,99999,All industries,Dollars (millions),H08,Total expenditure,Financial,"23,622",ANZSIC06 divisions A-S (excluding classes K6330, L6711, O7552, O760, O771, O772, S9540, S9601, S9602, and S9603)
2020,Level 1,A,"Agriculture, Forestry and Fishing",Dollars (millions),H01,Total income,Financial,"52,559",ANZSIC06 division A
2020,Level 1,A,"Agriculture, Forestry and Fishing",Dollars (millions),H04,"Sales, goods and services",Financial,"49,963",ANZSIC06 division A
2019,Level 1,B,Mining,Dollars (millions),H01,Total income,Financial,"3,333",ANZSIC06 division B
2019,Level 1,B,Mining,Dollars (millions),H04,"Sales, goods and services",Financial,"3,212",ANZSIC06 division B
2018,Level 1,C,Manufacturing,Dollars (millions),H01,Total income,Financial,"130,500",ANZSIC06 division C
2018,Level 1,C,Manufacturing,Dollars (millions),H04,"Sales, goods and services",Financial,"128,546",ANZSIC06 division C
2017,Level 1,D,"Electricity, Gas, Water and Waste Services",Dollars (millions),H01,Total income,Financial,"24,333",ANZSIC06 division D
2017,Level 1,D,"Electricity, Gas, Water and Waste Services",Dollars (millions),H04,"Sales, goods and services",Financial,"23,630",ANZSIC06 division D
2016,Level 1,E,Construction,Dollars (millions),H01,Total income,Financial,"62,441",ANZSIC06 division E
2016,Level 1,E,Construction,Dollars (millions),H04,"Sales, goods and services",Financial,"61,438",ANZSIC06 division E`;
      setDataset(mockCsv);
      setFileName(`kaggle_financial_data.csv`);
      setDatasetDescription(description);
      toast({
        title: "Success!",
        description: "Kaggle dataset imported successfully.",
      });
      router.push('/dashboard');
    }, 1500);
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl bg-card z-10">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>Upload your dataset or import from Kaggle to begin analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <Label htmlFor="description" className="text-base font-semibold">1. Describe Your Dataset</Label>
          <Textarea 
            id="description" 
            placeholder="e.g., Iris flower dataset with measurements for three species." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="h-24 text-base"
          />
          <p className="text-sm text-muted-foreground">A brief description helps the AI understand your data's context.</p>
        </div>
        
        <Label className="text-base font-semibold">2. Provide Your Data</Label>
        <Tabs defaultValue="upload" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={isLoading}><UploadCloud className="mr-2 h-4 w-4" /> Upload File</TabsTrigger>
            <TabsTrigger value="kaggle" disabled={isLoading}><LinkIcon className="mr-2 h-4 w-4" /> Import from Kaggle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <form onSubmit={handleFileUploadSubmit} className="space-y-4 pt-4">
              <div>
                <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} required />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isLoading || !file || !description}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRight className="mr-2 h-4 w-4" />}
                {isLoading ? 'Processing...' : 'Analyze Dataset'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="kaggle">
            <form onSubmit={handleKaggleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input 
                  id="kaggle-url" 
                  placeholder="https://www.kaggle.com/datasets/..."
                  value={kaggleUrl}
                  onChange={(e) => setKaggleUrl(e.target.value)}
                  required
                />
                 <p className="text-xs text-muted-foreground px-1">
                  Note: For demonstration, this will import a sample financial dataset instead of fetching from the URL.
                </p>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isLoading || !kaggleUrl || !description}>
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

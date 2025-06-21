'use client';

import { useData } from '@/context/data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { recommendMlModels } from '@/ai/flows/ml-model-suggestion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Cpu, Sparkles, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
    </Card>
)

export default function MlModelsPage() {
    const { 
        dataset, 
        datasetDescription, 
        mlModelsResult, 
        setMlModelsResult, 
        isLoading, 
        setIsLoading,
        problemType,
        setProblemType
    } = useData();
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!dataset) {
            toast({ title: "No Dataset", description: "Please upload a dataset first.", variant: "destructive" });
            return;
        }

        setIsLoading(prev => ({ ...prev, mlModels: true }));
        setMlModelsResult(null);

        try {
            const result = await recommendMlModels({ datasetDescription, problemType });
            setMlModelsResult(result);
            toast({ title: "Recommendations Ready", description: "AI-powered ML model suggestions are here." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to get recommendations.", variant: "destructive" });
        } finally {
            setIsLoading(prev => ({ ...prev, mlModels: false }));
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">ML Model Suggestions</CardTitle>
                    <CardDescription>Based on your data, the AI will recommend suitable machine learning tasks and model families to explore.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="problem-type">What type of problem are you trying to solve?</Label>
                        <Select value={problemType} onValueChange={setProblemType}>
                            <SelectTrigger id="problem-type" className="w-full md:w-[280px]">
                                <SelectValue placeholder="Select a problem type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="classification">Classification</SelectItem>
                                <SelectItem value="regression">Regression</SelectItem>
                                <SelectItem value="clustering">Clustering</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading.mlModels || !dataset}>
                        {isLoading.mlModels && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading.mlModels ? "Thinking..." : "Get Recommendations"}
                    </Button>
                    {!dataset && <p className="text-sm text-destructive mt-2">Please upload a dataset on the home page first.</p>}
                </CardContent>
            </Card>
            
            {isLoading.mlModels && <LoadingSkeleton />}
            
            {mlModelsResult && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" /> AI Recommendations
                        </CardTitle>
                        <CardDescription>For a <span className="font-semibold text-primary">{problemType}</span> problem with your dataset, consider these approaches.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <Cpu className="h-5 w-5" />Recommended Model Families
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mlModelsResult.recommendedModels.map((model) => (
                                    <span key={model} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                                        {model}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-primary" />Reasoning
                            </h3>
                            <p className="text-muted-foreground">{mlModelsResult.reasoning}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

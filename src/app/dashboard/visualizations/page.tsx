'use client';

import { useData } from '@/context/data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateVisualizations } from '@/ai/flows/intelligent-visualization';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicChart } from '../components/dynamic-chart';

const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4"/>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-[350px] w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-5/6"/>
                </CardContent>
            </Card>
        ))}
    </div>
)

export default function VisualizationsPage() {
    const { dataset, datasetDescription, visualizationsResult, setVisualizationsResult, isLoading, setIsLoading } = useData();
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!dataset) {
            toast({ title: "No Dataset", description: "Please upload a dataset first.", variant: "destructive" });
            return;
        }

        setIsLoading(prev => ({ ...prev, visualizations: true }));
        setVisualizationsResult(null);

        try {
            const result = await generateVisualizations({ datasetDescription, datasetSample: dataset.slice(0, 5000) });
            setVisualizationsResult(result);
            toast({ title: "Visualizations Ready", description: "AI-generated charts are available for review." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to generate visualizations. The AI might have had trouble with your data.", variant: "destructive" });
        } finally {
            setIsLoading(prev => ({ ...prev, visualizations: false }));
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Intelligent Visualization</CardTitle>
                    <CardDescription>Let the AI analyze your dataset and automatically generate a selection of informative visualizations, complete with observations and insights.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGenerate} disabled={isLoading.visualizations || !dataset}>
                        {isLoading.visualizations && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading.visualizations ? "Generating..." : "Generate Visualizations"}
                    </Button>
                     {!dataset && <p className="text-sm text-destructive mt-2">Please upload a dataset on the home page first.</p>}
                </CardContent>
            </Card>
            
            {isLoading.visualizations && <LoadingSkeleton />}
            
            {visualizationsResult && (
                <div className="grid md:grid-cols-2 gap-6">
                    {visualizationsResult.map((vis, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-2"><Eye className="h-5 w-5 text-primary"/>{vis.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="border rounded-lg p-4 bg-muted/50 flex justify-center h-[350px]">
                                 <DynamicChart chartData={vis} />
                               </div>
                                <p className="text-sm text-muted-foreground">{vis.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

'use client';

import { useData } from '@/context/data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dataDiagnosis } from '@/ai/flows/data-diagnosis';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle, Lightbulb, BarChart3, HelpCircle, FileWarning, ShieldAlert } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { DataDiagnosisOutput } from '@/ai/flows/data-diagnosis';
import { Skeleton } from '@/components/ui/skeleton';

function DiagnosisSection({ title, details, icon: Icon }: { title: string, details: { hasIssue: boolean, details: string, solutions: string[] }, icon: React.ElementType}) {
    return (
        <AccordionItem value={title.toLowerCase().replace(/ /g, '-')}>
            <AccordionTrigger className="text-lg font-headline hover:no-underline">
                <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${details.hasIssue ? 'text-destructive' : 'text-green-600 dark:text-green-500'}`} />
                    {title}
                    {details.hasIssue ? (
                        <span className="text-xs font-normal text-destructive ml-2 rounded-md bg-destructive/10 px-2 py-1">(Issues Found)</span>
                    ) : (
                        <span className="text-xs font-normal text-green-600 dark:text-green-500 ml-2 rounded-md bg-green-500/10 px-2 py-1">(Looks Good)</span>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
                <p className="text-muted-foreground">{details.details}</p>
                {details.solutions.length > 0 && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> Suggested Solutions</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {details.solutions.map((sol, i) => <li key={i}>{sol}</li>)}
                        </ul>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}

const LoadingSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </CardContent>
    </Card>
)

export default function DiagnosisPage() {
    const { dataset, datasetDescription, diagnosisResult, setDiagnosisResult, isLoading, setIsLoading } = useData();
    const { toast } = useToast();

    const handleDiagnose = async () => {
        if (!dataset) {
            toast({ title: "No Dataset", description: "Please upload a dataset first.", variant: "destructive" });
            return;
        }

        setIsLoading(prev => ({ ...prev, diagnosis: true }));
        setDiagnosisResult(null);

        try {
            const result = await dataDiagnosis({ datasetDescription, dataSample: dataset.slice(0, 5000) });
            setDiagnosisResult(result);
            toast({ title: "Diagnosis Complete", description: "The dataset health report is ready." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to run diagnosis.", variant: "destructive" });
        } finally {
            setIsLoading(prev => ({ ...prev, diagnosis: false }));
        }
    };
    
    const renderResult = (result: DataDiagnosisOutput) => (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Data Health Report</CardTitle>
                <CardDescription>An AI-powered analysis of your dataset's quality, completeness, and more.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full" defaultValue={['completeness', 'quality-outliers', 'bias', 'distribution']}>
                    <DiagnosisSection title="Completeness" details={{ hasIssue: result.completeness.missingValues, details: result.completeness.missingValuesDetails, solutions: result.completeness.suggestedSolutions}} icon={FileWarning} />
                    <DiagnosisSection title="Quality & Outliers" details={{ hasIssue: result.quality.outliers, details: result.quality.outliersDetails, solutions: result.quality.suggestedSolutions}} icon={AlertTriangle} />
                    <DiagnosisSection title="Bias" details={{ hasIssue: result.bias.potentialBias, details: result.bias.biasDetails, solutions: result.bias.suggestedSolutions}} icon={ShieldAlert} />
                    <DiagnosisSection title="Distribution" details={{ hasIssue: result.distribution.distributionIssues, details: result.distribution.distributionDetails, solutions: result.distribution.suggestedSolutions}} icon={BarChart3} />
                </Accordion>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Run Data Diagnosis</CardTitle>
                    <CardDescription>Generate a comprehensive 'health report' for your dataset. The AI will check for common issues like missing values, outliers, and potential bias, then suggest improvements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleDiagnose} disabled={isLoading.diagnosis || !dataset}>
                        {isLoading.diagnosis && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading.diagnosis ? "Diagnosing..." : "Diagnose Dataset"}
                    </Button>
                    {!dataset && <p className="text-sm text-destructive mt-2">Please upload a dataset on the home page first.</p>}
                </CardContent>
            </Card>

            {isLoading.diagnosis && <LoadingSkeleton />}
            
            {diagnosisResult && renderResult(diagnosisResult)}

        </div>
    );
}

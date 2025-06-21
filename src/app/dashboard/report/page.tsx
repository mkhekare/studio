'use client';

import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileWarning, BarChart2, Cpu, Lightbulb, AlertTriangle, ShieldAlert, BarChart3, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const EmptyState = ({ title, description, link, linkText }: { title: string, description: string, link: string, linkText: string }) => (
    <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <h3 className="font-headline text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link href={link} passHref>
            <Button variant="outline">{linkText}</Button>
        </Link>
    </div>
);

export default function ReportPage() {
    const { fileName, datasetDescription, diagnosisResult, visualizationsResult, mlModelsResult, problemType } = useData();

    return (
        <div className="space-y-6">
            <Card className="bg-card/50">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Analysis Report</CardTitle>
                        <CardDescription>A consolidated summary of all AI-generated findings for: <span className="font-semibold text-primary">{fileName || "your dataset"}</span></CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
                </CardHeader>
            </Card>

            {/* Data Diagnosis Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><FileWarning/>Data Diagnosis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    {diagnosisResult ? (
                         <div className="space-y-4">
                            <p className="text-muted-foreground">{diagnosisResult.completeness.missingValuesDetails}</p>
                            <p className="text-muted-foreground">{diagnosisResult.quality.outliersDetails}</p>
                            <p className="text-muted-foreground">{diagnosisResult.bias.biasDetails}</p>
                            <p className="text-muted-foreground">{diagnosisResult.distribution.distributionDetails}</p>
                         </div>
                    ) : (
                        <EmptyState title="No Diagnosis Data" description="Run the data diagnosis to see a health report here." link="/dashboard/diagnosis" linkText="Run Diagnosis" />
                    )}
                </CardContent>
            </Card>

            {/* Visualizations Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><BarChart2/>Intelligent Visualizations</CardTitle>
                </CardHeader>
                <CardContent>
                    {visualizationsResult ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {visualizationsResult.map((vis, index) => (
                                <div key={index} className="border rounded-lg p-4 space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><Eye className="h-4 w-4 text-primary"/> {vis.visualizationType}</h4>
                                     <div className="bg-muted/50 flex justify-center p-2 rounded-md">
                                        <Image src={vis.imageDataUri} width={300} height={200} alt={vis.description} className="rounded-md" data-ai-hint="data visualization"/>
                                     </div>
                                    <p className="text-sm text-muted-foreground">{vis.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No Visualizations" description="Generate visualizations to see AI-powered charts here." link="/dashboard/visualizations" linkText="Generate Visualizations" />
                    )}
                </CardContent>
            </Card>
            
            {/* ML Models Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Cpu/>ML Model Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    {mlModelsResult ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Recommended Models for <span className="text-primary">{problemType}</span>:</h4>
                                <div className="flex flex-wrap gap-2">
                                {mlModelsResult.recommendedModels.map((model) => (
                                    <span key={model} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                                        {model}
                                    </span>
                                ))}
                                </div>
                            </div>
                             <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4 text-primary"/> Reasoning</h4>
                                <p className="text-muted-foreground">{mlModelsResult.reasoning}</p>
                             </div>
                        </div>
                    ) : (
                        <EmptyState title="No Model Suggestions" description="Get ML model recommendations from the AI here." link="/dashboard/ml-models" linkText="Get Suggestions" />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

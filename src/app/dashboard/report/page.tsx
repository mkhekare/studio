'use client';

import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileWarning, BarChart2, Cpu, Lightbulb, AlertTriangle, ShieldAlert, CheckCircle, Eye, Sparkles, DatabaseZap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const EmptyState = ({ title, description, link, linkText, icon:Icon }: { title: string, description: string, link: string, linkText: string, icon: React.ElementType }) => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-full min-h-[200px]">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-headline text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-xs">{description}</p>
        <Link href={link} passHref>
            <Button variant="outline">{linkText}</Button>
        </Link>
    </div>
);

export default function ReportPage() {
    const { fileName, diagnosisResult, visualizationsResult, mlModelsResult, problemType } = useData();

    const hasContent = diagnosisResult || visualizationsResult || mlModelsResult;

    return (
        <div className="space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Analysis Report</CardTitle>
                        <CardDescription>A consolidated summary for: <span className="font-semibold text-primary">{fileName || "your dataset"}</span></CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => window.print()} disabled={!hasContent}><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><BarChart2/>Intelligent Visualizations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {visualizationsResult && visualizationsResult.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {visualizationsResult.map((vis, index) => (
                                        <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                                            <h4 className="font-semibold font-headline flex items-center gap-2 text-primary"><Eye className="h-4 w-4"/> {vis.visualizationType}</h4>
                                            <div className="bg-background flex justify-center p-2 rounded-md border">
                                                <Image src={vis.imageDataUri} width={300} height={200} alt={vis.description} className="rounded-md" data-ai-hint="data visualization"/>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{vis.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No Visualizations" description="Generate visualizations to see AI-powered charts here." link="/dashboard/visualizations" linkText="Generate Visualizations" icon={BarChart2} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><FileWarning/>Diagnosis Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {diagnosisResult ? (
                                <ul className="space-y-3 text-sm">
                                    <li className="flex gap-3"><ShieldAlert className={`h-5 w-5 ${diagnosisResult.completeness.missingValues ? 'text-destructive' : 'text-green-600'} shrink-0 mt-0.5`} /> <span>{diagnosisResult.completeness.missingValuesDetails}</span></li>
                                    <li className="flex gap-3"><AlertTriangle className={`h-5 w-5 ${diagnosisResult.quality.outliers ? 'text-destructive' : 'text-green-600'} shrink-0 mt-0.5`} /> <span>{diagnosisResult.quality.outliersDetails}</span></li>
                                    <li className="flex gap-3"><CheckCircle className={`h-5 w-5 ${diagnosisResult.bias.potentialBias ? 'text-destructive' : 'text-green-600'} shrink-0 mt-0.5`} /> <span>{diagnosisResult.bias.biasDetails}</span></li>
                                    <li className="flex gap-3"><BarChart3 className={`h-5 w-5 ${diagnosisResult.distribution.distributionIssues ? 'text-destructive' : 'text-green-600'} shrink-0 mt-0.5`} /> <span>{diagnosisResult.distribution.distributionDetails}</span></li>
                                </ul>
                            ) : (
                                <EmptyState title="No Diagnosis Data" description="Run the data diagnosis to see a health report here." link="/dashboard/diagnosis" linkText="Run Diagnosis" icon={FileWarning} />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Cpu/>ML Model Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mlModelsResult ? (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-3 !font-body">Models for <span className="text-primary">{problemType}</span>:</h4>
                                        <div className="flex flex-wrap gap-2">
                                        {mlModelsResult.recommendedModels.map((model) => (
                                            <span key={model} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                                                {model}
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                                        <h4 className="font-semibold flex items-center gap-2 mb-2 !font-body"><Lightbulb className="h-4 w-4 text-primary"/> Reasoning</h4>
                                        <p className="text-muted-foreground text-sm">{mlModelsResult.reasoning}</p>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState title="No Model Suggestions" description="Get ML model recommendations from the AI." link="/dashboard/ml-models" linkText="Get Suggestions" icon={Cpu} />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { UploadCard } from './components/upload-card';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background to-blue-100 dark:from-background dark:to-blue-950">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Logo />
      </div>
      <div className="text-center mb-10 max-w-4xl">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          Unlock Insights from Your Data
        </h1>
        <p className="mt-4 text-md sm:text-lg text-muted-foreground max-w-3xl mx-auto">
          DataWise AI provides instant diagnostics, intelligent visualizations, and ML model recommendations to supercharge your data analysis workflow.
        </p>
      </div>
      <UploadCard />
    </main>
  );
}

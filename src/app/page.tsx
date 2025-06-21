import { UploadCard } from './components/upload-card';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 bg-background overflow-hidden">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Logo />
      </div>
      <div className="text-center mb-10 max-w-4xl z-10">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          Unlock the Story in Your Data
        </h1>
        <p className="mt-4 text-md sm:text-lg text-muted-foreground max-w-3xl mx-auto">
          DataWise AI is your intelligent analyst, transforming raw data into clear diagnostics, compelling visualizations, and smart recommendations.
        </p>
      </div>
      <UploadCard />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-slate-950 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.15),transparent)]"></div>
      </div>
    </main>
  );
}

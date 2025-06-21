'use client';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File, Rows, Columns, DatabaseZap } from 'lucide-react';
import { DataPreviewTable } from './components/data-preview-table';
import { parseCsv } from '@/lib/csv-parser';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base !font-body font-medium">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold font-headline">{value}</div>
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  const { fileName, dataset } = useData();

  const { headers, rows } = useMemo(() => {
    return parseCsv(dataset || '');
  }, [dataset]);

  if (!dataset) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-8 rounded-lg border-2 border-dashed bg-card/50">
            <DatabaseZap className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-3xl font-bold font-headline mb-2">Welcome to DataWise AI</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">It seems your canvas is empty. Let's paint it with data! Upload a dataset to begin your journey of discovery.</p>
            <Link href="/" passHref>
                <Button size="lg">
                  Upload Your First Dataset
                </Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Dataset" value={fileName || 'N/A'} icon={File} />
        <StatCard title="Total Rows" value={rows.length} icon={Rows} />
        <StatCard title="Total Columns" value={headers.length} icon={Columns} />
      </div>
      <div>
        <DataPreviewTable />
      </div>
    </div>
  );
}

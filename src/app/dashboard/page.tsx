'use client';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File, Rows, Columns } from 'lucide-react';
import { DataPreviewTable } from './components/data-preview-table';
import { parseCsv } from '@/lib/csv-parser';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
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
        <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-lg border-2 border-dashed">
            <h2 className="text-2xl font-bold font-headline mb-2">Welcome to Your Dashboard</h2>
            <p className="text-muted-foreground mb-4 max-w-sm">It looks like you haven't loaded any data yet. Start by uploading a dataset to see the magic happen.</p>
            <Link href="/" passHref>
                <Button>Upload a Dataset</Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
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

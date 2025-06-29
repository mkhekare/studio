'use client';

import { useData } from '@/context/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parseCsv } from '@/lib/csv-parser';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DataPreviewTable() {
  const { dataset, fileName } = useData();

  const { headers, rows } = useMemo(() => {
    return parseCsv(dataset || '');
  }, [dataset]);

  if (!dataset) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Loaded</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">Please upload a dataset from the homepage to get started.</p>
          <Button variant="outline" asChild>
            <Link href="/">Go to Upload Page</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Data Profile</CardTitle>
        <CardDescription>A preview of your dataset: <span className="font-semibold text-primary">{fileName}</span></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto rounded-md border max-h-[60vh]">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 100).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap text-sm">{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         {rows.length > 100 && <p className="text-sm text-muted-foreground mt-2">Showing first 100 of {rows.length} total rows.</p>}
      </CardContent>
    </Card>
  );
}

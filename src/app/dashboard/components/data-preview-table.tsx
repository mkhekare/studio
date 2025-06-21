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
          <Link href="/" passHref>
            <Button variant="outline">Go to Upload Page</Button>
          </Link>
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
        <div className="overflow-auto rounded-md border max-h-96">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 20).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         {rows.length > 20 && <p className="text-sm text-muted-foreground mt-2">Showing first 20 of {rows.length} total rows.</p>}
      </CardContent>
    </Card>
  );
}

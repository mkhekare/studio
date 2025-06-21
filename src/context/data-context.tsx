"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { DataDiagnosisOutput } from '@/ai/flows/data-diagnosis';
import type { GenerateVisualizationsOutput } from '@/ai/flows/intelligent-visualization';
import type { MlModelSuggestionOutput } from '@/ai/flows/ml-model-suggestion';

interface LoadingState {
  diagnosis: boolean;
  visualizations: boolean;
  mlModels: boolean;
}

interface DataContextType {
  dataset: string | null;
  setDataset: (data: string | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
  datasetDescription: string;
  setDatasetDescription: (description: string) => void;
  diagnosisResult: DataDiagnosisOutput | null;
  setDiagnosisResult: (result: DataDiagnosisOutput | null) => void;
  visualizationsResult: GenerateVisualizationsOutput | null;
  setVisualizationsResult: (result: GenerateVisualizationsOutput | null) => void;
  mlModelsResult: MlModelSuggestionOutput | null;
  setMlModelsResult: (result: MlModelSuggestionOutput | null) => void;
  isLoading: LoadingState;
  setIsLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
  problemType: string;
  setProblemType: (type: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [dataset, setDataset] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [datasetDescription, setDatasetDescription] = useState<string>('');
  const [diagnosisResult, setDiagnosisResult] = useState<DataDiagnosisOutput | null>(null);
  const [visualizationsResult, setVisualizationsResult] = useState<GenerateVisualizationsOutput | null>(null);
  const [mlModelsResult, setMlModelsResult] = useState<MlModelSuggestionOutput | null>(null);
  const [problemType, setProblemType] = useState<string>('classification');
  const [isLoading, setIsLoading] = useState<LoadingState>({
    diagnosis: false,
    visualizations: false,
    mlModels: false,
  });

  const value = {
    dataset,
    setDataset,
    fileName,
    setFileName,
    datasetDescription,
    setDatasetDescription,
    diagnosisResult,
    setDiagnosisResult,
    visualizationsResult,
    setVisualizationsResult,
    mlModelsResult,
    setMlModelsResult,
    isLoading,
    setIsLoading,
    problemType,
    setProblemType,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

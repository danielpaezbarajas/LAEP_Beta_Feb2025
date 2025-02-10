import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUpload } from './components/FileUpload';
import { CriteriaForm } from './components/CriteriaForm';
import { LanguageSelector } from './components/LanguageSelector';
import { Assessment, AssessmentCriteria } from './types';
import { ClipboardList, Download, FileText, Bot } from 'lucide-react';
import { analyzeDocument } from './services/openai';

function App() {
  const { t } = useTranslation();
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const initialCriteria: AssessmentCriteria[] = [
    {
      id: '1',
      title: t('criteria.structure.title'),
      description: t('criteria.structure.description'),
      score: 0,
      maxScore: 10
    },
    {
      id: '2',
      title: t('criteria.content.title'),
      description: t('criteria.content.description'),
      score: 0,
      maxScore: 10
    },
    {
      id: '3',
      title: t('criteria.visual.title'),
      description: t('criteria.visual.description'),
      score: 0,
      maxScore: 10
    }
  ];

  const [criteria, setCriteria] = useState<AssessmentCriteria[]>(initialCriteria);

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setCurrentFile(files[0]);
      setCriteria(prev => prev.map(c => ({
        ...c,
        score: 0,
        aiAnalysis: undefined,
        isAnalyzing: false
      })));
    }
  };

  const handleScoreChange = (id: string, score: number) => {
    setCriteria(prev =>
      prev.map(criterion =>
        criterion.id === id ? { ...criterion, score } : criterion
      )
    );
  };

  const analyzeWithAI = async () => {
    if (!currentFile) return;

    setIsAnalyzing(true);
    const fileContent = await currentFile.text();

    const updatedCriteria = [...criteria];
    for (let i = 0; i < updatedCriteria.length; i++) {
      const criterion = updatedCriteria[i];
      setCriteria(prev => prev.map(c => 
        c.id === criterion.id ? { ...c, isAnalyzing: true } : c
      ));

      try {
        const result = await analyzeDocument(fileContent, criterion);
        updatedCriteria[i] = {
          ...criterion,
          score: result.score,
          aiAnalysis: result.analysis,
          isAnalyzing: false
        };
        setCriteria([...updatedCriteria]);
      } catch (error) {
        console.error(`Error analyzing criterion ${criterion.id}:`, error);
        updatedCriteria[i] = {
          ...criterion,
          aiAnalysis: "Error during analysis",
          isAnalyzing: false
        };
        setCriteria([...updatedCriteria]);
      }
    }

    setIsAnalyzing(false);
  };

  const totalScore = criteria.reduce((sum, criterion) => sum + criterion.score, 0);
  const maxPossibleScore = criteria.reduce((sum, criterion) => sum + criterion.maxScore, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {t('appTitle')}
              </h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                {t('documentUpload')}
              </h2>
              <FileUpload onFileUpload={handleFileUpload} />
              {currentFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {t('currentFile')}: {currentFile.name}
                  </p>
                  <button
                    onClick={analyzeWithAI}
                    disabled={isAnalyzing}
                    className={`mt-3 w-full flex items-center justify-center px-4 py-2 rounded
                      ${isAnalyzing
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                      } text-white transition-colors`}
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    {isAnalyzing ? t('analyzing') : t('analyzeButton')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{t('assessmentCriteria')}</h2>
              <div className="space-y-4">
                {criteria.map(criterion => (
                  <CriteriaForm
                    key={criterion.id}
                    criteria={criterion}
                    onScoreChange={handleScoreChange}
                  />
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">{t('totalScore')}:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalScore} / {maxPossibleScore}
                  </span>
                </div>
                
                <button
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg
                    hover:bg-blue-700 transition-colors flex items-center justify-center
                    font-medium"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {t('exportReport')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentCriteria } from '../types';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

interface CriteriaFormProps {
  criteria: AssessmentCriteria;
  onScoreChange: (id: string, score: number) => void;
}

export function CriteriaForm({ criteria, onScoreChange }: CriteriaFormProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-4 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {criteria.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {criteria.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {criteria.isAnalyzing ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <SlidersHorizontal className="w-5 h-5 text-blue-500" />
          )}
          <input
            type="number"
            min="0"
            max={criteria.maxScore}
            value={criteria.score}
            onChange={(e) => onScoreChange(criteria.id, Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded text-center"
            disabled={criteria.isAnalyzing}
          />
          <span className="text-gray-500">/ {criteria.maxScore}</span>
        </div>
      </div>
      
      {criteria.aiAnalysis && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">{t('aiAnalysis')}</h4>
          <p className="text-sm text-blue-800">{criteria.aiAnalysis}</p>
        </div>
      )}
    </div>
  );
}
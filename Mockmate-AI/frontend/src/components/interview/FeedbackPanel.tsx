import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  BookOpen,
  Quote,
  Eye,
  Sliders,
} from 'lucide-react';
import { Evaluation } from '../../types';
import { ScoreMeter } from './ScoreMeter';
import { AccordionItem } from '../ui/Accordion';
import { Badge } from '../ui/Badge';

interface FeedbackPanelProps {
  evaluation: Evaluation | null;
  mode?: 'practice' | 'assessment';
  isCompleted?: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  evaluation,
  mode = 'practice',
  isCompleted = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (mode === 'assessment' && !isCompleted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Assessment Mode Active</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
          Your responses are being recorded. Individual rubric scores and feedback are withheld during assessment mode and will be compiled into your comprehensive evaluation report upon interview completion.
        </p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 mb-3">
          <Sparkles className="w-6 h-6 text-teal-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No Evaluation Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Submit your answer to receive detailed rubric scores across Clarity, Relevance, Structure, and Confidence.
        </p>
      </div>
    );
  }

  const handleCopySuggestedAnswer = () => {
    if (evaluation.suggested_answer) {
      navigator.clipboard.writeText(evaluation.suggested_answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dimensions = [
    {
      key: 'clarity',
      name: 'Clarity',
      score: evaluation.clarity_score,
      desc: 'Understandability & concept communication',
      explanation: evaluation.clarity_explanation,
      evidence: evaluation.evidence?.clarity,
    },
    {
      key: 'relevance',
      name: 'Relevance',
      score: evaluation.relevance_score,
      desc: 'Technical accuracy & addressing question',
      explanation: evaluation.relevance_explanation,
      evidence: evaluation.evidence?.relevance,
    },
    {
      key: 'structure',
      name: 'Structure',
      score: evaluation.structure_score,
      desc: 'Logical progression & coherence',
      explanation: evaluation.structure_explanation,
      evidence: evaluation.evidence?.structure,
    },
    {
      key: 'confidence',
      name: 'Linguistic Confidence',
      score: evaluation.confidence_score,
      desc: 'Assertiveness & absence of excessive hesitation',
      explanation: evaluation.confidence_explanation,
      evidence: evaluation.evidence?.confidence,
    },
  ];

  const renderEvidence = (evidenceText?: string) => {
    if (!evidenceText) return null;
    const isObservation = evidenceText.startsWith('[Observation:') || evidenceText.startsWith('Observation:');
    return (
      <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
        isObservation
          ? 'bg-amber-50/70 text-amber-900 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900'
          : 'bg-slate-50 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
      }`}>
        {isObservation ? (
          <Eye className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        ) : (
          <Quote className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <span className="font-semibold text-[11px] block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
            {isObservation ? 'AI Observation' : 'Verified Excerpt from Answer'}
          </span>
          <p className="italic">{evidenceText}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Overall Score Card */}
      <div className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            AI Evaluation Result
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Overall Answer Score
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Calculated arithmetic mean across 4 rubric dimensions
          </p>
        </div>
        <ScoreMeter score={evaluation.overall_score} size="lg" />
      </div>

      {/* 4 Rubric Dimensions */}
      <div className="grid grid-cols-2 gap-2">
        {dimensions.map((dim) => (
          <div
            key={dim.key}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-subtle"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {dim.name}
              </span>
              <ScoreMeter score={dim.score} size="sm" showMax={false} />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {dim.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Expandable Dimension Justifications & Evidence */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Detailed Dimension Explanations & Evidence
        </h4>
        {dimensions.map((dim) => (
          <AccordionItem
            key={dim.key}
            title={
              <div className="flex items-center justify-between w-full pr-2">
                <span>{dim.name}</span>
                <span className="text-xs text-brand-600 font-bold">{dim.score.toFixed(1)}/5.0</span>
              </div>
            }
          >
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {dim.explanation}
            </p>
            {renderEvidence(dim.evidence)}
          </AccordionItem>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Strengths */}
        <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Key Strengths
          </div>
          <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
            {evaluation.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Areas for Growth
          </div>
          <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
            {evaluation.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Concepts Chips */}
      {evaluation.missing_concepts && evaluation.missing_concepts.length > 0 && (
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
            Missing Technical Concepts to Review:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {evaluation.missing_concepts.map((concept, i) => (
              <Badge key={i} variant="warning" size="sm">
                {concept}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      <div className="p-3.5 bg-brand-50/50 dark:bg-brand-950/30 rounded-xl border border-brand-200/80 dark:border-brand-800/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900 dark:text-brand-300 mb-2">
          <Lightbulb className="w-4 h-4 text-brand-600" />
          Actionable Suggestions
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          {evaluation.improvement_suggestions.map((sug, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-brand-600 font-bold">→</span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Model Answer */}
      {evaluation.suggested_answer && (
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              Illustrative High-Scoring Response
            </span>
            <button
              onClick={handleCopySuggestedAnswer}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80 max-h-48 overflow-y-auto">
            {evaluation.suggested_answer}
          </p>
          <span className="text-[10px] text-slate-500 block">
            * This is an illustrative benchmark response demonstrating recommended structure and depth, not the sole correct answer.
          </span>
        </div>
      )}
    </div>
  );
};

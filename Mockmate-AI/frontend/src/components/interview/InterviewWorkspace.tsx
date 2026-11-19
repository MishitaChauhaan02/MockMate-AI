
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Trophy,
  RotateCcw,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';

import { InterviewDetail, Answer, InterviewSummary } from '../../types';
import { interviewApi } from '../../services/api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { FeedbackPanel } from './FeedbackPanel';
import { EvaluationProgress } from './EvaluationProgress';
import { Modal } from '../ui/Modal';

export const InterviewWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentAnswerText, setCurrentAnswerText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluatingStatus, setEvaluatingStatus] = useState<string | null>(null);
  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [isRetaking, setIsRetaking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [answersMap, setAnswersMap] = useState<Record<number, Answer>>({});

  const interviewId = parseInt(id || '0', 10);

  // Load interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const data = await interviewApi.getInterviewById(interviewId);

        setInterview(data);

        const map: Record<number, Answer> = {};

        data.answers.forEach((ans) => {
          map[ans.question_id] = ans;
        });

        setAnswersMap(map);

        // Completed interviews load their existing summary.
        // The backend completion endpoint now supports repeated requests.
        if (data.status === 'completed') {
          setIsCompleted(true);

          const sum = await interviewApi.completeInterview(interviewId);
          setSummary(sum);
        }
      } catch (err: any) {
        console.error('Failed to load interview:', err);
        setError(
          err.response?.data?.detail ||
          'Failed to load interview details. Please check connection.'
        );
      }
    };

    if (interviewId > 0) {
      fetchInterview();
    } else {
      setError('Invalid interview ID.');
    }
  }, [interviewId]);

  // Completed interviews must always remain read-only,
  // even when the user switches to the question review screen.
  const isReadOnly = interview?.status === 'completed';

  // Sync answer text when question index changes.
  useEffect(() => {
    if (!interview || !interview.questions[currentIndex]) return;

    const currentQ = interview.questions[currentIndex];
    const existingAnswer = answersMap[currentQ.id];

    if (existingAnswer) {
      setCurrentAnswerText(existingAnswer.answer_text);
    } else if (isReadOnly) {
      setCurrentAnswerText('');
    } else {
      const draft = localStorage.getItem(
        `draft_${interviewId}_q${currentQ.id}`
      );

      setCurrentAnswerText(draft || '');
    }
  }, [currentIndex, interview, answersMap, interviewId, isReadOnly]);

  // Auto-save drafts only for active interviews.
  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (isReadOnly || !interview) return;

    const val = e.target.value;
    setCurrentAnswerText(val);

    if (interview.questions[currentIndex]) {
      const qId = interview.questions[currentIndex].id;

      localStorage.setItem(
        `draft_${interviewId}_q${qId}`,
        val
      );
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />

        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          {error}
        </h3>

        <Button className="mt-4" onClick={() => navigate('/app')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentQuestion = interview.questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answersMap[currentQuestion.id]
    : null;

  const currentEvaluation = currentAnswer?.evaluation || null;

  const wordCount = currentAnswerText.trim()
    ? currentAnswerText.trim().split(/\s+/).length
    : 0;

  const charCount = currentAnswerText.length;

  const progressPercent =
    interview.total_questions > 0
      ? ((currentIndex + 1) / interview.total_questions) * 100
      : 0;

  const answeredCount = Object.keys(answersMap).length;

  const allAnswered =
    answeredCount >= interview.total_questions;

  // Submit and evaluate answer.
  const handleSubmitAnswer = async () => {
    if (
      !currentQuestion ||
      !currentAnswerText.trim() ||
      isSubmitting ||
      isReadOnly
    ) {
      return;
    }

    setIsSubmitting(true);
    setEvaluatingStatus('Analyzing your answer...');

    try {
      const resultAnswer = await interviewApi.submitAnswer(
        interviewId,
        {
          question_id: currentQuestion.id,
          answer_text: currentAnswerText.trim(),
          question_order: currentIndex + 1,
        }
      );

      setAnswersMap((prev) => ({
        ...prev,
        [currentQuestion.id]: resultAnswer,
      }));

      localStorage.removeItem(
        `draft_${interviewId}_q${currentQuestion.id}`
      );
    } catch (err: any) {
      console.error('Answer submission error:', err);

      alert(
        err.response?.data?.detail ||
        'Failed to evaluate answer. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setEvaluatingStatus(null);
    }
  };

  // Complete interview.
  const handleCompleteInterview = async () => {
    if (isReadOnly || isSubmitting) return;

    try {
      const summaryResult =
        await interviewApi.completeInterview(interviewId);

      setSummary(summaryResult);
      setIsCompleted(true);

      // Update local interview state to read-only.
      setInterview((prev) =>
        prev ? { ...prev, status: 'completed' } : prev
      );
    } catch (err: any) {
      console.error('Completion error:', err);

      alert(
        'Failed to complete interview: ' +
        (err.response?.data?.detail || err.message)
      );
    }
  };

  // Retake interview.
  const handleRetakeInterview = async () => {
    if (!interview) return;

    setIsRetaking(true);

    try {
      const newInterview = await interviewApi.createInterview({
        category: interview.category,
        difficulty: interview.difficulty,
        total_questions: interview.total_questions,
        mode: interview.mode,
      });

      navigate(`/app/interview/${newInterview.id}`);
    } catch (err: any) {
      alert(
        'Failed to launch retake interview: ' +
        (err.response?.data?.detail || err.message)
      );
    } finally {
      setIsRetaking(false);
    }
  };

  // FINAL RESULTS VIEW
  if (isCompleted && summary) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">

        {/* Results Banner */}
        <div className="p-8 bg-gradient-to-tr from-brand-900 via-brand-800 to-indigo-900 text-white rounded-3xl shadow-premium relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-300 text-xs font-semibold mb-3">
                <Trophy className="w-4 h-4 text-amber-300" />
                Interview Completed Successfully
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {summary.category}
              </h2>

              <p className="text-sm text-brand-200 mt-1">
                {summary.difficulty} Level • {summary.questions_attempted} of{' '}
                {summary.total_questions} Questions Evaluated
              </p>
            </div>

            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <span className="text-xs uppercase font-semibold text-brand-200 tracking-wider">
                Overall Score
              </span>

              <span className="text-4xl font-black text-white mt-1">
                {summary.overall_score.toFixed(1)}
              </span>

              <span className="text-xs text-teal-300 font-medium">
                Out of 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Dimension Averages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Clarity', score: summary.average_clarity },
            { name: 'Relevance', score: summary.average_relevance },
            { name: 'Structure', score: summary.average_structure },
            { name: 'Confidence', score: summary.average_confidence },
          ].map((dim) => (
            <div
              key={dim.name}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle text-center"
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {dim.name}
              </span>

              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {dim.score.toFixed(1)}
              </span>

              <span className="text-[11px] text-slate-400 block mt-0.5">
                / 5.0 avg
              </span>
            </div>
          ))}
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/80">
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Strongest Trait: {summary.strongest_dimension}
            </h4>

            <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-200">
              {summary.key_strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/80">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Area for Growth: {summary.weakest_dimension}
            </h4>

            <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-200">
              {summary.areas_for_improvement.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Personalized Practice Recommendations
          </h4>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {summary.personalized_recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-start gap-2.5"
              >
                <span className="text-brand-600 font-bold mt-0.5">
                  {i + 1}.
                </span>

                <p>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">

          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => setIsCompleted(false)}
          >
            Review Questions & Answers
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/app/history')}
            >
              View in History
            </Button>

            <Button
              variant="secondary"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
              onClick={() => navigate('/app')}
            >
              Dashboard
            </Button>

            <Button
              variant="primary"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={handleRetakeInterview}
              isLoading={isRetaking}
            >
              Retake Interview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SPLIT-SCREEN WORKSPACE / REVIEW VIEW
  return (
    <div className="space-y-5 animate-in fade-in duration-150">

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isReadOnly && summary) {
                setIsCompleted(true);
              } else {
                setIsExitModalOpen(true);
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isReadOnly ? 'Back to results' : 'Exit interview'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {interview.category}
              </span>

              <Badge variant="brand" size="sm">
                {interview.difficulty}
              </Badge>

              <Badge variant="teal" size="sm">
                {interview.mode === 'practice'
                  ? 'Practice Mode'
                  : 'Assessment Mode'}
              </Badge>

              {isReadOnly && (
                <Badge variant="teal" size="sm">
                  Read-only Review
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Question {currentIndex + 1} of {interview.total_questions} (
              {answeredCount} answered)
            </p>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {interview.questions.map((q, idx) => {
            const isAnswered = !!answersMap[q.id];
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
                title={`Question ${idx + 1}: ${
                  isAnswered ? 'Answered' : 'Unanswered'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}

          {!isReadOnly && (
            <Button
              size="sm"
              variant="outline"
              className="ml-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              onClick={() => setIsExitModalOpen(true)}
            >
              Exit
            </Button>
          )}
        </div>
      </div>

      <ProgressBar value={progressPercent} color="bg-brand-600" />

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Question and Answer */}
        <div className="lg:col-span-7 space-y-4">

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Question {currentIndex + 1}
              </span>

              {currentAnswer && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Answer Evaluated
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion?.question_text}
            </h3>

            {currentQuestion?.expected_concepts &&
              currentQuestion.expected_concepts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Domain benchmarks:
                  </span>

                  {currentQuestion.expected_concepts.slice(0, 3).map(
                    (concept, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono"
                      >
                        {concept}
                      </span>
                    )
                  )}
                </div>
              )}
          </div>

          {/* Answer Area */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-3">

            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Your Answer
              </label>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} chars</span>
              </div>
            </div>

            <textarea
              value={currentAnswerText}
              onChange={handleAnswerChange}
              placeholder={
                isReadOnly
                  ? 'No answer was submitted for this question.'
                  : 'Type your technical response here. Be clear, articulate relevant concepts, structure your points logically, and explain tradeoffs...'
              }
              rows={11}
              disabled={isSubmitting || isReadOnly}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans leading-relaxed resize-y placeholder:text-slate-400 disabled:opacity-80 disabled:cursor-not-allowed"
            />

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentIndex === 0 || isSubmitting}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={
                    currentIndex === interview.questions.length - 1 ||
                    isSubmitting
                  }
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>

              {!isReadOnly && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSubmitAnswer}
                    disabled={
                      !currentAnswerText.trim() ||
                      isSubmitting
                    }
                    isLoading={isSubmitting}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    {currentAnswer
                      ? 'Re-Evaluate Answer'
                      : 'Submit Answer'}
                  </Button>

                  {answeredCount > 0 && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                      onClick={handleCompleteInterview}
                      disabled={isSubmitting}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      {allAnswered
                        ? 'Finish Interview'
                        : `Finish (${answeredCount}/${interview.total_questions})`}
                    </Button>
                  )}
                </div>
              )}

              {isReadOnly && summary && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCompleted(true)}
                >
                  Back to Results
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="lg:col-span-5 sticky top-24">
          {isSubmitting ? (
            <EvaluationProgress
              statusMessage={evaluatingStatus || undefined}
            />
          ) : (
            <FeedbackPanel
              evaluation={currentEvaluation}
              mode={interview.mode}
              isCompleted={isReadOnly}
            />
          )}
        </div>
      </div>

      {/* Exit Modal */}
      <Modal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        title="Exit Interview Workspace?"
        subtitle="Your submitted answers and evaluations are saved safely."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            You can return at any time from your Interview History or
            Dashboard to resume or complete this session.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsExitModalOpen(false)}
            >
              Keep Practicing
            </Button>

            <Button
              variant="danger"
              onClick={() => {
                setIsExitModalOpen(false);
                navigate('/app');
              }}
            >
              Exit to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

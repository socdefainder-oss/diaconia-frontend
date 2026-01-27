import React, { useState, useEffect } from 'react';
import { quizService, QuizAnswer } from '@/services/quizService';
import { QuizQuestion } from '@/types';

interface QuizPlayerProps {
  courseId: string;
  moduleId: string | null;
  lessonId: string;
  onComplete: (passed: boolean) => void;
}

export default function QuizPlayer({ courseId, moduleId, lessonId, onComplete }: QuizPlayerProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [courseId, moduleId, lessonId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuestions(courseId, moduleId, lessonId);
      setQuestions(data.questions);
      setAnswers(Array(5).fill(null).map((_, i) => ({ questionIndex: i, selectedOption: -1 })));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar questionário');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    const updated = [...answers];
    updated[questionIndex].selectedOption = optionIndex;
    setAnswers(updated);
  };

  const canSubmit = () => {
    return answers.every(a => a.selectedOption >= 0);
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      setError('Responda todas as perguntas antes de enviar');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const data = await quizService.submitAnswers(courseId, moduleId, lessonId, answers);
      setResult(data);
      onComplete(data.passed);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar respostas');
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => {
    setResult(null);
    setAnswers(Array(5).fill(null).map((_, i) => ({ questionIndex: i, selectedOption: -1 })));
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className={`text-6xl mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
            {result.passed ? '✓' : '✗'}
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
            {result.passed ? 'Parabéns!' : 'Não foi desta vez'}
          </h3>
          <p className="text-gray-600 mb-4">{result.message}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{result.correctAnswers}/5</div>
              <div className="text-sm text-gray-600">Acertos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{result.score}%</div>
              <div className="text-sm text-gray-600">Pontuação</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {result.results.map((r: any, i: number) => (
            <div key={i} className={`p-3 rounded-lg ${r.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                <span className={r.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {r.isCorrect ? '✓' : '✗'}
                </span>
                <span className="font-medium">Questão {i + 1}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {!result.passed && (
            <button
              onClick={retry}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Tentar Novamente
            </button>
          )}
          {result.passed && (
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Continuar para Próxima Aula
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Questionário da Aula</h3>
        <p className="text-gray-600">
          Responda todas as 5 perguntas. Você precisa acertar pelo menos 4 para avançar.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6 mb-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">
              {qIndex + 1}. {q.question}
            </h4>
            <div className="space-y-2">
              {q.options.map((opt: any, oIndex: number) => {
                const isSelected = answers[qIndex]?.selectedOption === oIndex;
                return (
                  <label
                    key={oIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={isSelected}
                      onChange={() => selectAnswer(qIndex, oIndex)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">{String.fromCharCode(65 + oIndex)}.</span>
                    <span>{opt.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit() || submitting}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
          canSubmit() && !submitting
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {submitting ? 'Enviando...' : 'Enviar Respostas'}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        {answers.filter(a => a.selectedOption >= 0).length}/5 perguntas respondidas
      </div>
    </div>
  );
}

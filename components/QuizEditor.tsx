import React, { useState } from 'react';
import { QuizQuestion, QuizOption } from '@/types';

interface QuizEditorProps {
  quiz: QuizQuestion[];
  onChange: (quiz: QuizQuestion[]) => void;
}

export default function QuizEditor({ quiz, onChange }: QuizEditorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quiz.length > 0 
      ? quiz 
      : Array(5).fill(null).map((_, i) => ({
          question: '',
          options: Array(4).fill(null).map(() => ({ text: '', isCorrect: false })),
          order: i,
        }))
  );

  const updateQuestion = (index: number, field: 'question', value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
    onChange(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
    onChange(updated);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIndex,
    }));
    setQuestions(updated);
    onChange(updated);
  };

  const isValid = () => {
    return questions.every(q => 
      q.question.trim() !== '' &&
      q.options.every(o => o.text.trim() !== '') &&
      q.options.filter(o => o.isCorrect).length === 1
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Questionário (5 Perguntas Obrigatórias)</h3>
        {!isValid() && (
          <span className="text-sm text-red-600">
            ⚠️ Complete todas as perguntas e marque a resposta correta
          </span>
        )}
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border rounded-lg p-4 bg-gray-50">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Pergunta {qIndex + 1} *
            </label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
              placeholder="Digite a pergunta..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Opções (marque a correta):</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  checked={opt.isCorrect}
                  onChange={() => setCorrectOption(qIndex, oIndex)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium">{String.fromCharCode(65 + oIndex)}:</span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  placeholder={`Opção ${String.fromCharCode(65 + oIndex)}`}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {opt.isCorrect && (
                  <span className="text-green-600 font-semibold">✓ Correta</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-sm text-gray-600">
        <p>⚠️ Todas as 5 perguntas são obrigatórias</p>
        <p>⚠️ Cada pergunta deve ter 4 opções e apenas 1 correta</p>
        <p>⚠️ O aluno precisa acertar no mínimo 4 questões (80%) para avançar</p>
      </div>
    </div>
  );
}

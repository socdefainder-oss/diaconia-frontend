import api from '@/lib/api';

export interface QuizAnswer {
  questionIndex: number;
  selectedOption: number;
}

export interface QuizSubmitResponse {
  success: boolean;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  message: string;
  results: Array<{
    questionIndex: number;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
  }>;
}

export const quizService = {
  // Obter perguntas do quiz (sem respostas corretas)
  getQuestions: async (courseId: string, moduleId: string | null, lessonId: string) => {
    const modId = moduleId || 'null';
    const response = await api.get(`/quiz/${courseId}/${modId}/${lessonId}/questions`);
    return response.data;
  },

  // Enviar respostas do quiz
  submitAnswers: async (
    courseId: string,
    moduleId: string | null,
    lessonId: string,
    answers: QuizAnswer[]
  ): Promise<QuizSubmitResponse> => {
    const modId = moduleId || 'null';
    const response = await api.post(`/quiz/${courseId}/${modId}/${lessonId}/submit`, {
      answers,
    });
    return response.data;
  },

  // Obter histórico de tentativas
  getAttempts: async (courseId: string, lessonId: string) => {
    const response = await api.get(`/quiz/${courseId}/${lessonId}/attempts`);
    return response.data;
  },

  // Obter melhor tentativa
  getBestAttempt: async (courseId: string, lessonId: string) => {
    const response = await api.get(`/quiz/${courseId}/${lessonId}/best`);
    return response.data;
  },
};

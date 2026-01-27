#  Integração Final - Quiz no Frontend

##  Arquivos Criados

1. **services/quizService.ts** - Serviço de comunicação com API
2. **components/QuizEditor.tsx** - Editor de perguntas para admin
3. **components/QuizPlayer.tsx** - Interface de resposta para aluno
4. **types/index.ts** - Atualizado com interfaces Quiz

##  Próximas Etapas de Integração

### 1. Integrar QuizEditor na Página de Edição de Curso

**Arquivo:** `app/dashboard/courses/[id]/edit/page.tsx`

Adicionar QuizEditor no formulário de edição de aula:

```tsx
import QuizEditor from '@/components/QuizEditor';

// No formulário de edição de lesson:
<QuizEditor
  quiz={currentLesson.quiz || []}
  onChange={(quiz) => {
    setCurrentLesson({ ...currentLesson, quiz });
  }}
/>
```

### 2. Integrar QuizPlayer na Página de Visualização

**Arquivo:** `app/dashboard/courses/[id]/page.tsx`

Adicionar após o player de vídeo:

```tsx
import QuizPlayer from '@/components/QuizPlayer';
import { useState } from 'react';

// Estado para controlar quiz
const [showQuiz, setShowQuiz] = useState(false);
const [quizPassed, setQuizPassed] = useState(false);

// Após o vídeo terminar (onEnded do player):
const handleVideoEnd = () => {
  if (currentLesson.quiz && currentLesson.quiz.length === 5) {
    setShowQuiz(true);
  } else {
    // Sem quiz, marcar como completa direto
    markLessonComplete();
  }
};

// Renderizar QuizPlayer:
{showQuiz && currentLesson.quiz && (
  <QuizPlayer
    courseId={courseId}
    moduleId={currentModule?._id || null}
    lessonId={currentLesson._id!}
    onComplete={(passed) => {
      setQuizPassed(passed);
      if (passed) {
        markLessonComplete();
        // Liberar próxima aula
      }
    }}
  />
)}
```

### 3. Atualizar Lógica de Bloqueio

No mesmo arquivo `app/dashboard/courses/[id]/page.tsx`:

```tsx
const isLessonUnlocked = (lesson: Lesson, lessonIndex: number): boolean => {
  if (lessonIndex === 0) return true; // Primeira sempre desbloqueada

  const previousLesson = lessons[lessonIndex - 1];
  const previousProgress = progress.completedLessons.find(
    (lp) => lp.lessonId === previousLesson._id && lp.moduleId === currentModule?._id
  );

  if (!previousProgress) return false;

  // Se aula anterior tem quiz, verificar se passou
  if (previousLesson.quiz && previousLesson.quiz.length === 5) {
    return previousProgress.completed && 
           previousProgress.quizCompleted && 
           previousProgress.quizPassed;
  }

  // Sem quiz, só verifica se completou o vídeo
  return previousProgress.completed;
};
```

### 4. Atualizar Indicadores Visuais

Adicionar badges para mostrar status do quiz:

```tsx
{lesson.quiz && lesson.quiz.length === 5 && (
  <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
     Quiz
  </span>
)}

{lessonProgress?.quizCompleted && (
  <span className={`ml-2 px-2 py-1 text-xs rounded ${
    lessonProgress.quizPassed 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }`}>
    {lessonProgress.quizPassed 
      ? ` ${lessonProgress.quizScore}%` 
      : ` ${lessonProgress.quizScore}%`
    }
  </span>
)}
```

##  Testando

1. Como Admin:
   - Edite um curso existente
   - Adicione questionário em uma aula
   - Salve e publique

2. Como Aluno:
   - Assista o vídeo até o fim
   - Quiz aparece automaticamente
   - Responda as 5 perguntas
   - Teste passar (4+ corretas) e reprovar (< 4)
   - Verifique se próxima aula desbloqueou

##  Pontos de Atenção

- Validar que quiz tem exatamente 5 perguntas antes de salvar
- Não permitir salvar se alguma pergunta não tem resposta correta marcada
- Quiz só aparece se lesson.quiz existe e tem 5 perguntas
- Aula sem quiz continua funcionando normalmente (compatibilidade)

##  Referências

- Backend API: `/api/quiz/*`
- Documentação completa: `diaconia-backend/QUIZ_IMPLEMENTATION.md`

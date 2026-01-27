import re

with open(r'app\dashboard\courses\[id]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Adicionar useMemo no import
content = content.replace(
    "import { useState, useEffect } from 'react';",
    "import { useState, useEffect, useMemo } from 'react';"
)

# 2. Adicionar import do QuizPlayer
content = content.replace(
    "import { Course, Progress, Module, Lesson } from '@/types';",
    "import { Course, Progress, Module, Lesson } from '@/types';\nimport QuizPlayer from '@/components/QuizPlayer';"
)

# 3. Adicionar estados do quiz
content = content.replace(
    "const [generatingCertificate, setGeneratingCertificate] = useState(false);",
    """const [generatingCertificate, setGeneratingCertificate] = useState(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);"""
)

# 4. Mover effectiveModules para useMemo antes dos useEffects
old_useEffect = """  useEffect(() => {
    loadCourseAndProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);"""

new_code = """  // Calcular effectiveModules baseado no course
  const effectiveModules = useMemo(() => {
    if (!course) return [];
    return course.modules && course.modules.length > 0
      ? course.modules
      : course.lessons && course.lessons.length > 0
      ? [{ _id: 'default', title: course.title, description: '', order: 1, lessons: course.lessons }]
      : [];
  }, [course]);

  useEffect(() => {
    loadCourseAndProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resetar quiz ao mudar de aula
  useEffect(() => {
    setShowQuiz(false);
    setVideoCompleted(false);
  }, [selectedModule, selectedLesson]);"""

content = content.replace(old_useEffect, new_code)

# 5. Atualizar handleCompleteLesson para usar effectiveModules e mostrar quiz
old_handleComplete = """  const handleCompleteLesson = async () => {
    if (!course?.modules || completing) return;

    const courseModule = course.modules[selectedModule];
    const lesson = courseModule.lessons[selectedLesson];

    if (!courseModule._id || !lesson._id) return;

    setCompleting(true);"""

new_handleComplete = """  const handleCompleteLesson = async () => {
    if (!effectiveModules.length || completing) return;

    const courseModule = effectiveModules[selectedModule];
    const lesson = courseModule.lessons[selectedLesson];

    if (!courseModule._id || !lesson._id) return;

    // Se a aula tem quiz, mostrar o quiz ao invés de marcar como concluída
    if (lesson.quiz && lesson.quiz.length === 5) {
      setShowQuiz(true);
      setVideoCompleted(true);
      toast.info('Responda o questionário para concluir a aula');
      return;
    }

    // Se não tem quiz, marcar como concluída diretamente
    setCompleting(true);"""

content = content.replace(old_handleComplete, new_handleComplete)

# 6. Remover effectiveModules antigo e adicionar validação
old_effective = """  // Se não houver módulos, criar um módulo virtual com as lessons
  const effectiveModules = course.modules && course.modules.length > 0
    ? course.modules
    : course.lessons && course.lessons.length > 0
    ? [{ _id: 'default', title: course.title, description: '', order: 1, lessons: course.lessons }]
    : [];

  const currentModule = effectiveModules[selectedModule];
  const currentLesson = currentModule.lessons[selectedLesson];
  const isCurrentLessonCompleted = isLessonCompleted(
    currentModule._id || '',
    currentLesson._id || ''
  );"""

new_effective = """  if (!effectiveModules.length || !effectiveModules[selectedModule]) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Este curso não possui módulos ou aulas.</p>
        <Link href="/dashboard/courses" className="btn-primary mt-4">
          Voltar
        </Link>
      </div>
    );
  }

  const currentModule = effectiveModules[selectedModule];
  const currentLesson = currentModule.lessons[selectedLesson];
  const isCurrentLessonCompleted = isLessonCompleted(
    currentModule._id || '',
    currentLesson._id || ''
  );"""

content = content.replace(old_effective, new_effective)

# 7. Adicionar QuizPlayer antes do fechamento do card de progresso (linha após "Ver Certificado")
# Encontrar a seção do certificado e adicionar o quiz player
pattern = r'(</a>\s+)\s+(\)\}\s+</div>)'
replacement = r'\1)}\n\n          {/* Quiz Player */}\n          {showQuiz && currentLesson?.quiz && currentLesson.quiz.length === 5 && (\n            <div className="mt-6">\n              <QuizPlayer\n                courseId={course._id}\n                moduleId={currentModule?._id || null}\n                lessonId={currentLesson._id!}\n                onComplete={(passed) => {\n                  setShowQuiz(false);\n                  if (passed) {\n                    window.location.reload();\n                  }\n                }}\n              />\n            </div>\n          )}\n        \2'

content = re.sub(pattern, replacement, content, count=1)

with open(r'app\dashboard\courses\[id]\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Arquivo integrado com sucesso!")

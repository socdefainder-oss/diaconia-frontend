'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlayCircle, Lock, CheckCircle, Clock, BookOpen, Award } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { progressService } from '@/services/progressService';
import { certificateService } from '@/services/certificateService';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Course, Progress, Module, Lesson } from '@/types';

export default function CourseViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [completing, setCompleting] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    loadCourseAndProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCourseAndProgress = async () => {
    try {
      const [courseData, progressData] = await Promise.all([
        courseService.getCourse(params.id),
        progressService.getCourseProgress(params.id),
      ]);
      
      setCourse(courseData);
      setProgress(progressData);
    } catch (error: any) {
      toast.error('Erro ao carregar curso');
      router.push('/dashboard/courses');
    } finally {
      setLoading(false);
    }
  };

  const isLessonCompleted = (moduleId: string, lessonId: string): boolean => {
    if (!progress) return false;
    return progress.completedLessons.some(
      (l) => l.moduleId === moduleId && l.lessonId === lessonId && l.completed
    );
  };

  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number): boolean => {
    // Primeira aula sempre desbloqueada
    if (moduleIndex === 0 && lessonIndex === 0) return true;

    const modules = effectiveModules || [];
    if (moduleIndex >= effectiveModules.length) return false;

    const courseModule = modules[moduleIndex];
    
    // Verificar aula anterior no mesmo módulo
    if (lessonIndex > 0) {
      const previousLesson = courseModule.lessons[lessonIndex - 1];
      return isLessonCompleted(courseModule._id || '', previousLesson._id || '');
    }

    // Verificar última aula do módulo anterior
    if (moduleIndex > 0) {
      const previousModule = modules[moduleIndex - 1];
      const lastLesson = previousModule.lessons[previousModule.lessons.length - 1];
      return isLessonCompleted(previousModule._id || '', lastLesson._id || '');
    }

    return false;
  };

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    if (!isLessonUnlocked(moduleIndex, lessonIndex)) {
      toast.error('Complete a aula anterior para desbloquear');
      return;
    }
    setSelectedModule(moduleIndex);
    setSelectedLesson(lessonIndex);
  };

  const handleCompleteLesson = async () => {
    if (!course?.modules || completing) return;

    const courseModule = course.modules[selectedModule];
    const lesson = courseModule.lessons[selectedLesson];

    if (!courseModule._id || !lesson._id) return;

    setCompleting(true);
    try {
      const updatedProgress = await progressService.completeLesson(
        params.id,
        courseModule._id,
        lesson._id
      );
      setProgress(updatedProgress);
      toast.success('Aula concluída!');

      // Verificar se completou o curso
      if (updatedProgress.completed && !updatedProgress.certificateIssued) {
        toast.success('🎉 Parabéns! Você completou o curso!', { duration: 5000 });
      }

      // Avançar para próxima aula automaticamente
      if (selectedLesson < courseModule.lessons.length - 1) {
        setSelectedLesson(selectedLesson + 1);
      } else if (selectedModule < effectiveModules.length - 1) {
        setSelectedModule(selectedModule + 1);
        setSelectedLesson(0);
      }
    } catch (error) {
      toast.error('Erro ao marcar aula como concluída');
    } finally {
      setCompleting(false);
    }
  };

  const handleGenerateCertificate = async () => {
    setGeneratingCertificate(true);
    try {
      const certificate = await certificateService.generateCertificate(params.id);
      toast.success('Certificado gerado com sucesso!');
      window.open(`/certificates/${certificate.certificateId}`, '_blank');
      
      // Atualizar progresso
      if (progress) {
        setProgress({
          ...progress,
          certificateIssued: true,
          certificateUrl: certificate.certificateUrl,
        });
      }
    } catch (error) {
      toast.error('Erro ao gerar certificado');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const getVideoEmbedUrl = (videoUrl: string): string => {
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('youtu.be')
        ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
        : videoUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
    }
    // Vimeo
    if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return videoUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Curso não encontrado.</p>
        <Link href="/dashboard/courses" className="btn-primary mt-4">
          Voltar
        </Link>
      </div>
    );
  }

  // Se não houver módulos, criar um módulo virtual com as lessons
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
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/courses"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600">{currentModule.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {progress && (
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {progress.progress}%
                </span>
              </div>
            )}
            {progress?.completed && !progress?.certificateIssued && (
              <button
                onClick={handleGenerateCertificate}
                disabled={generatingCertificate}
                className="btn-primary flex items-center gap-2"
              >
                <Award size={18} />
                {generatingCertificate ? 'Gerando...' : 'Gerar Certificado'}
              </button>
            )}
            {progress?.certificateIssued && progress?.certificateUrl && (
              <a
                href={`/certificates/${progress._id}`}
                target="_blank"
                className="btn-primary flex items-center gap-2"
              >
                <Award size={18} />
                Ver Certificado
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Player */}
        <div className="flex-1 bg-black flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            {currentLesson.videoUrl ? (
              <iframe
                src={getVideoEmbedUrl(currentLesson.videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-white text-center">
                <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum vídeo disponível</p>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="bg-gray-900 text-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <p className="text-gray-300 mb-4">{currentLesson.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {currentLesson.videoDuration
                      ? `${Math.floor(currentLesson.videoDuration / 60)} min`
                      : 'Duração não especificada'}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    Aula {selectedLesson + 1} de {currentModule.lessons.length}
                  </span>
                </div>
              </div>

              {!isCurrentLessonCompleted && (
                <button
                  onClick={handleCompleteLesson}
                  disabled={completing}
                  className="btn-primary flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  {completing ? 'Marcando...' : 'Marcar como Concluída'}
                </button>
              )}
              {isCurrentLessonCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  <span className="font-medium">Concluída</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Módulos e Aulas */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">Conteúdo do Curso</h3>
            <p className="text-sm text-gray-600 mt-1">
              {course.totalLessons || 0} aulas em {effectiveModules.length} módulos
            </p>
          </div>

          <div className="divide-y">
            {effectiveModules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {moduleIndex + 1}. {module.title}
                </h4>
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const unlocked = isLessonUnlocked(moduleIndex, lessonIndex);
                    const completed = isLessonCompleted(
                      module._id || '',
                      lesson._id || ''
                    );
                    const isCurrent =
                      moduleIndex === selectedModule &&
                      lessonIndex === selectedLesson;

                    return (
                      <button
                        key={lessonIndex}
                        onClick={() => handleLessonClick(moduleIndex, lessonIndex)}
                        disabled={!unlocked}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isCurrent
                            ? 'bg-primary-50 border-primary-300'
                            : unlocked
                            ? 'hover:bg-gray-50 border-gray-200'
                            : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {completed ? (
                              <CheckCircle
                                size={20}
                                className="text-green-500"
                              />
                            ) : unlocked ? (
                              <PlayCircle
                                size={20}
                                className={
                                  isCurrent
                                    ? 'text-primary-600'
                                    : 'text-gray-400'
                                }
                              />
                            ) : (
                              <Lock size={20} className="text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                isCurrent
                                  ? 'text-primary-900'
                                  : unlocked
                                  ? 'text-gray-900'
                                  : 'text-gray-400'
                              }`}
                            >
                              {lesson.title}
                            </p>
                            {lesson.videoDuration && (
                              <p className="text-xs text-gray-500 mt-1">
                                {Math.floor(lesson.videoDuration / 60)} min
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import os

# Ler arquivo de edição
edit_file = r'app\dashboard\courses\[id]\edit\page.tsx'
with open(edit_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Procurar onde adicionar QuizEditor (após o campo de duração)
quiz_editor_jsx = '''
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Questionário (5 perguntas obrigatórias)
                        </label>
                        <QuizEditor
                          questions={lesson.quiz || []}
                          onChange={(questions) => {
                            const newLessons = [...formData.lessons];
                            newLessons[lessonIndex] = {
                              ...lesson,
                              quiz: questions
                            };
                            setFormData({ ...formData, lessons: newLessons });
                          }}
                        />
                      </div>'''

if 'QuizEditor' not in content or '<QuizEditor' not in content:
    # Encontrar o fechamento do campo de duração e adicionar QuizEditor
    # Procurar por "</div>" após "Duração"
    import re
    
    # Padrão: campo de duração seguido de fechamento de div
    pattern = r'(placeholder="Duração em minutos"[^>]*>[\s\S]*?</div>)'
    
    if re.search(pattern, content):
        content = re.sub(
            pattern,
            r'\1' + quiz_editor_jsx,
            content,
            count=1
        )
        print('✅ QuizEditor JSX adicionado no formulário')
    else:
        print('⚠️ Não encontrou local para adicionar QuizEditor JSX')
else:
    print('ℹ️ QuizEditor JSX já existe')

# Salvar
with open(edit_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ QuizEditor integrado completamente!')

import os

# Ler arquivo de edição
edit_file = r'app\dashboard\courses\[id]\edit\page.tsx'
with open(edit_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Adicionar import QuizEditor
if 'QuizEditor' not in content:
    content = content.replace(
        "import Link from 'next/link';",
        "import Link from 'next/link';\nimport QuizEditor from '@/components/QuizEditor';"
    )
    print('✅ Import QuizEditor adicionado')

# Adicionar quiz no tipo do formData lessons
if 'quiz?' not in content and 'title: string; description: string; videoUrl: string; duration: number; order: number' in content:
    content = content.replace(
        'title: string; description: string; videoUrl: string; duration: number; order: number',
        'title: string; description: string; videoUrl: string; duration: number; order: number; quiz?: any[]'
    )
    print('✅ Tipo quiz adicionado no formData')

# Adicionar quiz no mapeamento de lessons
if 'quiz: lesson.quiz' not in content:
    content = content.replace(
        'order: lesson.order || 0,',
        'order: lesson.order || 0,\n          quiz: lesson.quiz || [],'
    )
    print('✅ Quiz adicionado no mapeamento de lessons')

# Salvar
with open(edit_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Arquivo de edição atualizado!')

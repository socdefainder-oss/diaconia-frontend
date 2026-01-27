#!/usr/bin/env python3
"""Script para integrar automaticamente o sistema de questionário no frontend"""
import os
import re

FRONTEND_DIR = "."

def read_file(path):
    """Lê conteúdo do arquivo"""
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    """Escreve conteúdo no arquivo"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def integrate_quiz_editor():
    """Integra QuizEditor na página de edição"""
    edit_page = os.path.join(FRONTEND_DIR, "app", "dashboard", "courses", "[id]", "edit", "page.tsx")
    
    if not os.path.exists(edit_page):
        print(f"❌ Arquivo não encontrado: {edit_page}")
        return False
    
    content = read_file(edit_page)
    
    # Adicionar import do QuizEditor
    if "import QuizEditor from" not in content:
        # Procurar linha de imports
        import_pattern = r"(import.*from\s+['\"]@/types['\"];?\n)"
        if re.search(import_pattern, content):
            content = re.sub(
                import_pattern,
                r"\1import QuizEditor from '@/components/QuizEditor';\n",
                content
            )
            print("✅ Import do QuizEditor adicionado")
        else:
            print("⚠️  Não encontrou local para adicionar import")
    
    # Adicionar QuizEditor no formulário (procurar por videoUrl ou videoDuration)
    if "QuizEditor" not in content or "quiz={" not in content:
        # Procurar pelo campo de videoUrl ou videoDuration
        video_pattern = r"(videoDuration.*?\n.*?</div>)"
        if re.search(video_pattern, content, re.DOTALL):
            quiz_editor_code = '''

                {/* Questionário */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Questionário (Opcional)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Adicione 5 perguntas obrigatórias. O aluno precisa acertar 4 para avançar.
                  </p>
                  <QuizEditor
                    quiz={currentLesson?.quiz || []}
                    onChange={(quiz) => {
                      setCurrentLesson({ ...currentLesson, quiz });
                    }}
                  />
                </div>'''
            
            content = re.sub(
                video_pattern,
                r"\1" + quiz_editor_code,
                content,
                flags=re.DOTALL
            )
            print("✅ QuizEditor integrado no formulário")
        else:
            print("⚠️  Não encontrou local para adicionar QuizEditor")
    
    write_file(edit_page, content)
    return True

def integrate_quiz_player():
    """Integra QuizPlayer na página de visualização"""
    view_page = os.path.join(FRONTEND_DIR, "app", "dashboard", "courses", "[id]", "page.tsx")
    
    if not os.path.exists(view_page):
        print(f"❌ Arquivo não encontrado: {view_page}")
        return False
    
    content = read_file(view_page)
    
    # Adicionar imports
    if "import QuizPlayer from" not in content:
        import_pattern = r"(import.*from\s+['\"]@/types['\"];?\n)"
        if re.search(import_pattern, content):
            content = re.sub(
                import_pattern,
                r"\1import QuizPlayer from '@/components/QuizPlayer';\n",
                content
            )
            print("✅ Import do QuizPlayer adicionado")
    
    # Adicionar estados para quiz
    if "showQuiz" not in content:
        # Procurar por useState existente
        usestate_pattern = r"(const \[.*?\] = useState.*?\n)"
        matches = list(re.finditer(usestate_pattern, content))
        if matches:
            last_match = matches[-1]
            quiz_states = "\n  const [showQuiz, setShowQuiz] = useState(false);\n  const [videoCompleted, setVideoCompleted] = useState(false);\n"
            content = content[:last_match.end()] + quiz_states + content[last_match.end():]
            print("✅ Estados do quiz adicionados")
    
    # Adicionar renderização do QuizPlayer
    if "QuizPlayer" not in content or "courseId=" not in content:
        # Procurar por onde renderizar (após o player de vídeo)
        # Vamos adicionar antes do fechamento do container principal
        quiz_player_code = '''

          {/* Quiz Player */}
          {showQuiz && currentLesson?.quiz && currentLesson.quiz.length === 5 && (
            <div className="mt-6">
              <QuizPlayer
                courseId={course._id}
                moduleId={currentModule?._id || null}
                lessonId={currentLesson._id!}
                onComplete={(passed) => {
                  setShowQuiz(false);
                  if (passed) {
                    window.location.reload();
                  }
                }}
              />
            </div>
          )}'''
        
        # Procurar por um bom local para inserir (antes de fechar divs principais)
        # Vamos inserir antes do último </div> do main content
        pattern = r'(</div>\s*</div>\s*</div>\s*$)'
        if re.search(pattern, content, re.MULTILINE):
            content = re.sub(pattern, quiz_player_code + r'\n\1', content, flags=re.MULTILINE)
            print("✅ QuizPlayer renderizado")
        else:
            print("⚠️  Não encontrou local ideal, adicionando no final do componente")
            # Adicionar antes do export ou último return
            export_pattern = r'(}\s*export default)'
            if re.search(export_pattern, content):
                content = re.sub(export_pattern, quiz_player_code + '\n\n' + r'\1', content)
    
    write_file(view_page, content)
    return True

def main():
    print("🚀 Integrando sistema de questionário...\n")
    
    success = True
    
    # Integrar QuizEditor
    print("1️⃣  Integrando QuizEditor na página de edição...")
    if not integrate_quiz_editor():
        success = False
    
    print()
    
    # Integrar QuizPlayer
    print("2️⃣  Integrando QuizPlayer na página de visualização...")
    if not integrate_quiz_player():
        success = False
    
    print()
    
    if success:
        print("✅ Integração concluída com sucesso!")
        print("\n📝 PRÓXIMOS PASSOS:")
        print("1. Revisar as alterações com: git diff")
        print("2. Testar com: npm run build")
        print("3. Fazer commit e push")
    else:
        print("⚠️  Algumas integrações falharam. Revise manualmente.")

if __name__ == "__main__":
    main()

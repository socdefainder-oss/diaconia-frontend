import re

with open(r'app\dashboard\courses\[id]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Contar abertura e fechamento
open_braces = content.count('{')
close_braces = content.count('}')
open_parens = content.count('(')
close_parens = content.count(')')
open_brackets = content.count('[')
close_brackets = content.count(']')

print(f"{{ = {open_braces}")
print(f"}} = {close_braces}")
print(f"Diferença: {open_braces - close_braces}")
print()
print(f"( = {open_parens}")
print(f") = {close_parens}")
print(f"Diferença: {open_parens - close_parens}")
print()
print(f"[ = {open_brackets}")
print(f"] = {close_brackets}")
print(f"Diferença: {open_brackets - close_brackets}")

# Verificar a função handleCompleteLesson
match = re.search(r'const handleCompleteLesson = async \(\) => \{(.+?)^\s*\};', content, re.DOTALL | re.MULTILINE)
if match:
    func_content = match.group(0)
    func_open = func_content.count('{')
    func_close = func_content.count('}')
    print(f"\nhandleCompleteLesson:")
    print(f"{{ = {func_open}, }} = {func_close}, Diff = {func_open - func_close}")
else:
    print("\nhandleCompleteLesson não encontrada com regex")

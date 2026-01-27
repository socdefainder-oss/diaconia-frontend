import re

with open(r'app\dashboard\courses\[id]\page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Procurar por funções que não foram fechadas corretamente
in_function = False
function_name = ""
brace_count = 0
start_line = 0

for i, line in enumerate(lines, 1):
    # Detectar início de função
    if 'const ' in line and '=' in line and ('=>' in line or 'function' in line):
        if not in_function:
            in_function = True
            function_name = line.split('const ')[1].split('=')[0].strip()
            start_line = i
            brace_count = 0
    
    # Contar chaves
    if in_function:
        brace_count += line.count('{')
        brace_count -= line.count('}')
        
        # Se voltou a zero, função terminou
        if brace_count == 0 and '{' in lines[start_line-1]:
            print(f"✅ {function_name}: linhas {start_line}-{i}")
            in_function = False
        elif brace_count < 0:
            print(f"❌ {function_name}: ERRO - mais }} do que {{ na linha {i}")
            print(f"   Linha: {line.strip()}")
            break

# Procurar linha com problema
print("\nLinhas próximas ao erro (215-230):")
for i in range(214, min(231, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()}")

import sys

file_path = r'app\dashboard\courses\[id]\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
print(f"\nLine 210-215:")
for i in range(209, min(215, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')

# Buscar effectiveModules usado antes de ser definido
print(f"\n\nSearching for effectiveModules usage:")
for i, line in enumerate(lines):
    if 'effectiveModules' in line:
        print(f"Line {i+1}: {line.strip()}")

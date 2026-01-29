import re

# Ler o arquivo
with open(r'app\dashboard\schedules\[teamId]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar e substituir a função preencherConfirmados com logs de debug
old_function = '''  const preencherConfirmados = () => {
    const linhas = listaParticipantes.split('\\n').filter(l => l.trim());
    const confirmados: string[] = [];

    linhas.forEach(linha => {
      const parts = linha.split('-').map(p => p.trim());
      if (parts.length < 2) return;
      const nome = parts[0];
      const status = parts.slice(1).join('-');

      if (isConfirmado(status) && !coordenadores.some(c => normalizeStr(c) === normalizeStr(nome))) {
        confirmados.push(nome);
      }
    });'''

new_function = '''  const preencherConfirmados = () => {
    console.log('🔵 preencherConfirmados chamada');
    console.log('📝 Lista completa:', listaParticipantes);
    
    const linhas = listaParticipantes.split('\\n').filter(l => l.trim());
    console.log('📋 Linhas processadas:', linhas.length);
    
    const confirmados: string[] = [];

    linhas.forEach(linha => {
      const parts = linha.split('–').map(p => p.trim()); // Usar travessão (–) ao invés de hífen (-)
      if (parts.length < 2) {
        // Tentar com hífen normal também
        const parts2 = linha.split('-').map(p => p.trim());
        if (parts2.length >= 2) {
          const nome = parts2[0];
          const status = parts2.slice(1).join('-');
          
          if (isConfirmado(status) && !coordenadores.some(c => normalizeStr(c) === normalizeStr(nome))) {
            confirmados.push(nome);
          }
        }
        return;
      }
      
      const nome = parts[0];
      const status = parts.slice(1).join('–');

      if (isConfirmado(status) && !coordenadores.some(c => normalizeStr(c) === normalizeStr(nome))) {
        confirmados.push(nome);
      }
    });
    
    console.log('✅ Confirmados encontrados:', confirmados.length, confirmados);'''

# Substituir
content = content.replace(old_function, new_function)

# Salvar
with open(r'app\dashboard\schedules\[teamId]\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Arquivo atualizado com logs de debug!')

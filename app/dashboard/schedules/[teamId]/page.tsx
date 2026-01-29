'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaDownload, FaCopy, FaEraser } from 'react-icons/fa';
import { teamService } from '@/services/teamService';
import { Team } from '@/types';

export default function TeamSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [listaParticipantes, setListaParticipantes] = useState('');
  const [textoGerado, setTextoGerado] = useState('');
  const [campos, setCampos] = useState<Record<string, string>>({
    campo0: '', campo1: '', campo2: '', campo3: '', campo4: '', campo5: '',
    campo6: '', campo7: '', campo8: '', campo9: '', campo10: '', campo11: '',
    campo12: '', campo13: '', campo14: '', campo15: '', campo16: '', campo17: '',
    campo18: '', campo19: '', campo20: '', campo21: '', campo22: '', campo23: '', campo24: ''
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Arrays de dados
  const nomesCampos = [
    'Porta 1', 'Lateral Camarim', 'Escada', 'Aux Pastores', 'Unifila lado Camarim',
    'Corredor 1 - Entrada principal da área reservada', 'Corredor 2', 'Corredor 3 - Entrada secundária da área Reservada',
    'Corredor 4', 'Corredor 5', 'Corredor 6', 'Corredor 7', 'Corredor 8', 'Corredor 9',
    'Recepcionista 1', 'Recepcionista 2', 'Recepcionista 3', 'Controlador de Area', 'Staff',
    'Lateral Bateria:', 'Porta Emergencia', 'Auxiliar', 'Hora de Chegada', 'Uniforme', 'Recepcionista 4'
  ];

  const camposSemInput = ['Lateral Camarim', 'Corredor 1 - Entrada principal da área reservada', 
    'Corredor 3 - Entrada secundária da área Reservada', 'Lateral Bateria:'];

  const posicoesTexto = [
    [15, 25],    // 0: Porta 1 (canto superior esquerdo)
    [85, 335],   // 1: Lateral Camarim (título)
    [35, 15],    // 2: Escada (canto superior esquerdo, segunda bolinha)
    [240, 155],  // 3: Aux Pastores (área central superior, perto da Viviana)
    [145, 25],   // 4: Unifila lado Camarim (topo centro-esquerda)
    [150, 220],  // 5: Corredor 1 (título vermelho)
    [125, 685],  // 6: Corredor 2 (embaixo esquerda)
    [150, 265],  // 7: Corredor 3 (título vermelho)
    [20, 685],   // 8: Corredor 4 (embaixo, primeira bolinha esquerda)
    [160, 440],  // 9: Corredor 5 (meio, lado esquerdo)
    [255, 685],  // 10: Corredor 6 (embaixo centro)
    [160, 340],  // 11: Corredor 7 (meio-esquerda, área central)
    [380, 685],  // 12: Corredor 8 (embaixo centro-direita)
    [490, 685],  // 13: Corredor 9 (embaixo, última bolinha direita)
    [260, 60],   // 14: Recepcionista 1 (topo, área do Telão)
    [260, 85],   // 15: Recepcionista 2 (topo, abaixo de Bella)
    [260, 110],  // 16: Recepcionista 3 (topo, abaixo de Luciana)
    [485, 380],  // 17: Controlador de Area (lado direito, meio)
    [485, 410],  // 18: Staff (lado direito, abaixo do controlador)
    [415, 335],  // 19: Lateral Bateria (título)
    [505, 25],   // 20: Porta Emergencia (canto superior direito)
    [385, 210],  // 21: Auxiliar (lado direito superior, próximo de Joana)
    [50, 560],   // 22: Hora de Chegada (campo de texto)
    [50, 580],   // 23: Uniforme (campo de texto)
    [260, 135]   // 24: Recepcionista 4 (topo, abaixo de Patricia)
  ];

  const coordenadores = ['Ivan', 'Renata', 'Wellington', 'Fernanda', 'Éverton', 'Liliane'];

  const femaleNames = ['Renata', 'Fernanda', 'Liliane', 'Bella', 'Luciana', 'Patricia', 
    'Isabella', 'Giovanna', 'Mariana', 'Ana', 'Carolina', 'Julia', 'Camila', 
    'Beatriz', 'Larissa', 'Amanda', 'Gabriela', 'Rafaela'];

  const femalePrefer = ['recepcionista', 'controlador de area', 'staff', 'aux pastores', 'auxiliar'];
  const malePrefer = ['escada', 'porta emergencia'];

  // Utility functions
  const normalizeStr = (s: string) => {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  };

  const isConfirmado = (status: string) => {
    const st = normalizeStr(status);
    // Verifica emojis de confirmação ou texto
    return status.includes('✅') || status.includes('✔') || 
           /^confirm/.test(st) || st === 'ok' || st === 'presenca' || st === 'presente';
  };

  const isFemaleName = (name: string) => {
    const n = normalizeStr(name);
    if (femaleNames.some(fn => normalizeStr(fn) === n)) return true;
    return /[aá]$/.test(n);
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let yPos = y;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, yPos);
        line = words[i] + ' ';
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, yPos);
  };

  const desenharCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, 500, 600);

    ctx.font = '10px Arial';
    ctx.fillStyle = 'black';

    posicoesTexto.forEach((pos, idx) => {
      const nome = campos[`campo${idx}`];
      if (nome) {
        wrapText(ctx, nome, pos[0], pos[1], 12, 12);
      }
    });
  };

  const preencherConfirmados = () => {
    console.log('Iniciando preenchimento de confirmados...');
    const linhas = listaParticipantes.split('\n').filter(l => l.trim());
    console.log(`Total de linhas: ${linhas.length}`);
    const confirmados: string[] = [];

    linhas.forEach(linha => {
      const parts = linha.split('-').map(p => p.trim());
      if (parts.length < 2) return;
      const nome = parts[0];
      const status = parts.slice(1).join('-');
      
      console.log(`Processando: ${nome} - Status: ${status} - É confirmado? ${isConfirmado(status)}`);
      
      if (isConfirmado(status) && !coordenadores.some(c => normalizeStr(c) === normalizeStr(nome))) {
        confirmados.push(nome);
      }
    });
    
    console.log('Confirmados encontrados:', confirmados);

    const usados = new Set<string>();
    const novoCampos = { ...campos };

    const pegarNomePreferencial = (listas: string[][]) => {
      for (const lista of listas) {
        while (lista.length > 0) {
          const nome = lista.shift()!;
          if (!usados.has(nome)) {
            usados.add(nome);
            return nome;
          }
        }
      }
      return '';
    };

    const femininos = confirmados.filter(n => isFemaleName(n));
    const masculinos = confirmados.filter(n => !isFemaleName(n));

    // Recepcionistas (14-16, 24) - preferem feminino
    [14, 15, 16, 24].forEach(idx => {
      novoCampos[`campo${idx}`] = pegarNomePreferencial([femininos, masculinos]);
    });

    // Controlador de Area (17) - feminino
    novoCampos.campo17 = pegarNomePreferencial([femininos, masculinos]);

    // Staff (18) - feminino
    novoCampos.campo18 = pegarNomePreferencial([femininos, masculinos]);

    // Aux Pastores (3) - feminino
    novoCampos.campo3 = pegarNomePreferencial([femininos, masculinos]);

    // Auxiliar (21) - feminino
    novoCampos.campo21 = pegarNomePreferencial([femininos, masculinos]);

    // Escada (2) - masculino
    novoCampos.campo2 = pegarNomePreferencial([masculinos, femininos]);

    // Porta Emergencia (20) - masculino
    novoCampos.campo20 = pegarNomePreferencial([masculinos, femininos]);

    // Restantes
    [0, 4, 6, 7, 9, 10, 11, 12, 13].forEach(idx => {
      novoCampos[`campo${idx}`] = pegarNomePreferencial([masculinos, femininos]);
    });
    
    console.log('Campos preenchidos:', novoCampos);

    setCampos(novoCampos);
  };

  const gerarTexto = () => {
    const c = campos;
    const texto = `📢 *ESCALA DE SERVIÇO - ${team?.name || 'EQUIPE'}* 📢

🔹 *Posições e Responsabilidades:*

🚪 *Porta 1:* ${c.campo0 || '[Não preenchido]'}
🪜 *Escada:* ${c.campo2 || '[Não preenchido]'}
👥 *Aux Pastores:* ${c.campo3 || '[Não preenchido]'}
📍 *Unifila lado Camarim:* ${c.campo4 || '[Não preenchido]'}

🔸 *Corredores:*
• *Corredor 2:* ${c.campo6 || '[Não preenchido]'}
• *Corredor 4:* ${c.campo8 || '[Não preenchido]'}
• *Corredor 5:* ${c.campo9 || '[Não preenchido]'}
• *Corredor 6:* ${c.campo10 || '[Não preenchido]'}
• *Corredor 7:* ${c.campo11 || '[Não preenchido]'}
• *Corredor 8:* ${c.campo12 || '[Não preenchido]'}
• *Corredor 9:* ${c.campo13 || '[Não preenchido]'}

👋 *Recepcionistas:*
• *Recepcionista 1:* ${c.campo14 || '[Não preenchido]'}
• *Recepcionista 2:* ${c.campo15 || '[Não preenchido]'}
• *Recepcionista 3:* ${c.campo16 || '[Não preenchido]'}
• *Recepcionista 4:* ${c.campo24 || '[Não preenchido]'}

🎯 *Posições Especiais:*
• *Controlador de Área:* ${c.campo17 || '[Não preenchido]'}
• *Staff:* ${c.campo18 || '[Não preenchido]'}
• *Porta Emergência:* ${c.campo20 || '[Não preenchido]'}
• *Auxiliar:* ${c.campo21 || '[Não preenchido]'}

⏰ *Hora de Chegada:* ${c.campo22 || '[Não preenchido]'}
👕 *Uniforme:* ${c.campo23 || '[Não preenchido]'}

━━━━━━━━━━━━━━━━━━━━━━

📋 *INSTRUÇÕES GERAIS:*

✅ Chegue no horário estabelecido
✅ Vista o uniforme correto
✅ Mantenha a postura profissional
✅ Seja cordial com todos
✅ Mantenha seu posto organizado
✅ Em caso de dúvida, procure o coordenador

🙏 *Contamos com você!*`;

    setTextoGerado(texto);
  };

  const copiarTexto = () => {
    if (textoGerado) {
      navigator.clipboard.writeText(textoGerado);
      alert('Texto copiado para área de transferência!');
    }
  };

  const baixarImagem = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `escala-${team?.name || 'equipe'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const limparCampos = () => {
    setCampos({
      campo0: '', campo1: '', campo2: '', campo3: '', campo4: '', campo5: '',
      campo6: '', campo7: '', campo8: '', campo9: '', campo10: '', campo11: '',
      campo12: '', campo13: '', campo14: '', campo15: '', campo16: '', campo17: '',
      campo18: '', campo19: '', campo20: '', campo21: '', campo22: '', campo23: '', campo24: ''
    });
    setListaParticipantes('');
    setTextoGerado('');
  };

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await teamService.getTeam(teamId);
        setTeam(data);
      } catch (error) {
        console.error('Erro ao carregar equipe:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId]);

  useEffect(() => {
    if (imageRef.current?.complete) {
      desenharCanvas();
    }
  }, [campos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Equipe não encontrada
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard/schedules')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft /> Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Escala - {team.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda - Formulário */}
        <div className="space-y-6">
          {/* Campos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Posições</h2>
            <div className="space-y-3">
              {nomesCampos.map((nome, idx) => {
                const isSemInput = camposSemInput.includes(nome);
                
                if (isSemInput) {
                  return (
                    <div key={idx} className="font-semibold text-blue-600 pt-2">
                      {nome}
                    </div>
                  );
                }

                return (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {nome}
                    </label>
                    <input
                      type="text"
                      value={campos[`campo${idx}`]}
                      onChange={(e) => setCampos({ ...campos, [`campo${idx}`]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Digite o nome para ${nome}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de Participantes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Lista de Participantes</h2>
            <p className="text-sm text-gray-600 mb-3">
              Cole a lista no formato: Nome - Status (um por linha)
            </p>
            <textarea
              value={listaParticipantes}
              onChange={(e) => setListaParticipantes(e.target.value)}
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="João - Confirmado&#10;Maria - Confirmada&#10;Pedro - Justificado"
            />
            <button
              onClick={preencherConfirmados}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Preencher Confirmados
            </button>
          </div>

          {/* Botões de Ação */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Ações</h2>
            <div className="space-y-3">
              <button
                onClick={gerarTexto}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Gerar Texto para WhatsApp
              </button>
              <button
                onClick={limparCampos}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
              >
                <FaEraser /> Limpar Tudo
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Mapa e Texto */}
        <div className="space-y-6">
          {/* Canvas do Mapa */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Mapa (Croqui)</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={600}
                className="w-full"
              />
              <img
                ref={imageRef}
                src="https://i.imgur.com/fhNiX9k.png"
                alt="Croqui"
                crossOrigin="anonymous"
                onLoad={desenharCanvas}
                className="hidden"
              />
            </div>
            <button
              onClick={baixarImagem}
              className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
            >
              <FaDownload /> Baixar Imagem
            </button>
          </div>

          {/* Texto Gerado */}
          {textoGerado && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Texto para WhatsApp</h2>
              <textarea
                value={textoGerado}
                readOnly
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={copiarTexto}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
              >
                <FaCopy /> Copiar Texto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

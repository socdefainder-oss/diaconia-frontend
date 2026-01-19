'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Download, Share2, CheckCircle } from 'lucide-react';
import { certificateService } from '@/services/certificateService';
import toast from 'react-hot-toast';

interface CertificateVerification {
  studentName: string;
  studentEmail: string;
  courseName: string;
  courseCategory: string;
  completedAt: string;
  certificateId: string;
  valid: boolean;
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [certificate, setCertificate] = useState<CertificateVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCertificate = async () => {
    try {
      const data = await certificateService.verifyCertificate(params.id);
      setCertificate(data);
    } catch (error) {
      toast.error('Certificado não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Award size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Certificado não encontrado
          </h1>
          <p className="text-gray-600">
            O certificado que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  const completedDate = new Date(certificate.completedAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Ações */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button onClick={handleShare} className="btn-secondary flex items-center gap-2">
            <Share2 size={18} />
            Compartilhar
          </button>
          <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
            <Download size={18} />
            Download PDF
          </button>
        </div>

        {/* Certificado */}
        <div className="bg-white rounded-lg shadow-2xl p-12 border-8 border-primary-600 relative overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <pattern
                  id="pattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="2" fill="currentColor" />
                </pattern>
                <rect width="400" height="400" fill="url(#pattern)" />
              </svg>
            </div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <Award size={80} className="mx-auto text-primary-600 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                CERTIFICADO DE CONCLUSÃO
              </h1>
              <div className="w-32 h-1 bg-primary-600 mx-auto"></div>
            </div>

            {/* Conteúdo */}
            <div className="text-center space-y-6 my-12">
              <p className="text-lg text-gray-700">Certificamos que</p>
              
              <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 inline-block px-8">
                {certificate.studentName}
              </h2>

              <p className="text-lg text-gray-700">
                concluiu com êxito o curso
              </p>

              <h3 className="text-2xl font-bold text-primary-700">
                {certificate.courseName}
              </h3>

              <p className="text-gray-600">
                na categoria <span className="font-semibold">{certificate.courseCategory}</span>
              </p>

              <div className="flex items-center justify-center gap-2 text-green-600 mt-8">
                <CheckCircle size={24} />
                <span className="font-medium">Certificado Válido</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 w-48 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    Data de Conclusão
                    <br />
                    <span className="font-semibold">{completedDate}</span>
                  </p>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 w-48 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    ID do Certificado
                    <br />
                    <span className="font-mono text-xs font-semibold">
                      {certificate.certificateId}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Selo */}
            <div className="absolute bottom-8 right-8 print:block">
              <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center border-4 border-white shadow-lg">
                <Award size={40} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Verificação */}
        <div className="mt-8 text-center text-sm text-gray-600 print:hidden">
          <p>
            Para verificar a autenticidade deste certificado, acesse:
            <br />
            <span className="font-mono text-primary-600">
              {window.location.href}
            </span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

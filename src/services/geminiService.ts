const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

if (!GEMINI_API_KEY) {
  console.warn(
    'VITE_GEMINI_API_KEY não configurada. Defina-a no arquivo .env (veja .env.example). ' +
    'A análise por IA usará respostas de fallback até que a chave seja fornecida.'
  );
}

export interface BusinessAnalysis {
  digitalPresenceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  marketOpportunities: string[];
  competitiveAdvantage: string;
  summary: string;
}

export class GeminiService {
  static async analyzeBusinessProfile(businessData: {
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    address: string;
    hasWebsite: boolean;
    hasPhone: boolean;
  }): Promise<BusinessAnalysis> {
    const prompt = `
    Analise o seguinte negócio local e forneça uma análise detalhada de sua presença digital e oportunidades de mercado:

    Nome: ${businessData.name}
    Categoria: ${businessData.category}
    Avaliação: ${businessData.rating}/5 (${businessData.reviewCount} avaliações)
    Endereço: ${businessData.address}
    Tem website: ${businessData.hasWebsite ? 'Sim' : 'Não'}
    Tem telefone: ${businessData.hasPhone ? 'Sim' : 'Não'}

    Forneça uma análise em JSON com os seguintes campos:
    - digitalPresenceScore (0-100): pontuação da presença digital
    - strengths: array de 3-5 pontos fortes
    - weaknesses: array de 3-5 pontos fracos
    - recommendations: array de 3-5 recomendações específicas
    - marketOpportunities: array de 2-4 oportunidades de mercado
    - competitiveAdvantage: uma frase sobre vantagem competitiva
    - summary: resumo em 2-3 frases

    Responda APENAS com o JSON válido, sem texto adicional.
    `;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      
      // Parse JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta inválida da IA');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    } catch (error) {
      console.error('Erro ao analisar negócio:', error);
      
      // Fallback analysis
      return {
        digitalPresenceScore: businessData.hasWebsite ? 75 : 45,
        strengths: [
          `Avaliação positiva de ${businessData.rating}/5`,
          `${businessData.reviewCount} avaliações dos clientes`,
          businessData.hasWebsite ? 'Presença online estabelecida' : 'Negócio tradicional consolidado'
        ],
        weaknesses: [
          !businessData.hasWebsite ? 'Ausência de website' : 'Pode melhorar SEO',
          'Presença limitada em redes sociais',
          'Falta de estratégia digital integrada'
        ],
        recommendations: [
          'Criar perfil no Google Meu Negócio',
          'Desenvolver estratégia de marketing digital',
          'Implementar sistema de gestão de reviews'
        ],
        marketOpportunities: [
          'Expansão digital pós-pandemia',
          'Marketing local direcionado'
        ],
        competitiveAdvantage: 'Forte reputação local com oportunidade de crescimento digital',
        summary: `${businessData.name} possui uma base sólida com ${businessData.rating}/5 estrelas, mas pode expandir significativamente sua presença digital para alcançar mais clientes locais.`
      };
    }
  }

  static async generateMarketInsights(location: string, category: string): Promise<string[]> {
    const prompt = `
    Gere insights de mercado para um negócio da categoria "${category}" localizado em "${location}".
    
    Forneça 4-6 insights específicos sobre:
    - Tendências do mercado local
    - Comportamento do consumidor
    - Oportunidades sazonais
    - Estratégias de crescimento
    
    Responda com um array JSON de strings, sem texto adicional.
    `;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const insightsText = data.candidates[0].content.parts[0].text;
      
      const jsonMatch = insightsText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Resposta inválida da IA');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      
      return [
        `Mercado de ${category} em ${location} apresenta oportunidades de crescimento`,
        'Consumidores locais valorizam atendimento personalizado',
        'Marketing digital pode aumentar visibilidade em 40%',
        'Parcerias locais podem expandir base de clientes'
      ];
    }
  }
}
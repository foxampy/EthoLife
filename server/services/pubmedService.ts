/**
 * PubMed E-utilities API Service
 * Скачивание текстовых данных (JSON/XML) - не PDF!
 * Экономия места: ~100KB на статью вместо 2MB PDF
 */

import axios from 'axios';

const PUBMED_API_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const API_KEY = process.env.PUBMED_API_KEY; // Опционально, увеличивает rate limit

export interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  year: number;
  month?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmcid?: string; // PubMed Central ID для Open Access
  keywords: string[];
  meshTerms: string[];
  publicationTypes: string[];
  language: string;
  isOpenAccess: boolean;
  abstractText: string; // Полный текст abstract
}

export interface SearchResult {
  articles: PubMedArticle[];
  totalCount: number;
  query: string;
  retstart: number;
  retmax: number;
}

class PubMedService {
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 350; // 3 requests per second max (без API key)
  private minRequestIntervalWithKey: number = 100; // 10 requests per second (с API key)

  private async rateLimit() {
    const interval = API_KEY ? this.minRequestIntervalWithKey : this.minRequestInterval;
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < interval) {
      await new Promise(resolve => setTimeout(resolve, interval - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  private getApiParams() {
    return API_KEY ? `&api_key=${API_KEY}` : '';
  }

  /**
   * Поиск статей по запросу
   * Возвращает только ID ( economит трафик)
   */
  async search(
    query: string, 
    retstart: number = 0, 
    retmax: number = 20,
    sort: string = 'relevance',
    filters?: {
      dateFrom?: string; // YYYY/MM/DD
      dateTo?: string;
      articleType?: string;
      language?: string;
      hasAbstract?: boolean;
      isOpenAccess?: boolean;
    }
  ): Promise<SearchResult> {
    await this.rateLimit();

    let searchQuery = query;
    
    // Добавляем фильтры
    if (filters) {
      if (filters.dateFrom && filters.dateTo) {
        searchQuery += ` AND (${filters.dateFrom}[PDAT] : ${filters.dateTo}[PDAT])`;
      }
      if (filters.articleType) {
        searchQuery += ` AND ${filters.articleType}[PT]`;
      }
      if (filters.language) {
        searchQuery += ` AND ${filters.language}[LA]`;
      }
      if (filters.hasAbstract) {
        searchQuery += ' AND hasabstract[text]';
      }
      if (filters.isOpenAccess) {
        searchQuery += ' AND open access[filter]';
      }
    }

    const url = `${PUBMED_API_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retstart=${retstart}&retmax=${retmax}&sort=${sort}&retmode=json${this.getApiParams()}`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      
      const ids: string[] = data.esearchresult.idlist || [];
      const totalCount = parseInt(data.esearchresult.count) || 0;

      // Получаем полные данные для найденных ID
      const articles = ids.length > 0 ? await this.fetchArticlesByIds(ids) : [];

      return {
        articles,
        totalCount,
        query,
        retstart,
        retmax
      };
    } catch (error) {
      console.error('PubMed search error:', error);
      throw new Error('Failed to search PubMed');
    }
  }

  /**
   * Получение полных данных статей по ID (JSON format - текст!)
   */
  async fetchArticlesByIds(ids: string[]): Promise<PubMedArticle[]> {
    if (ids.length === 0) return [];
    
    await this.rateLimit();

    const idString = ids.join(',');
    // retmode=json возвращает текстовые данные, не PDF!
    const url = `${PUBMED_API_BASE}/esummary.fcgi?db=pubmed&id=${idString}&retmode=json${this.getApiParams()}`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      const result = data.result;

      return ids.map(id => this.parseArticle(result[id])).filter(Boolean) as PubMedArticle[];
    } catch (error) {
      console.error('PubMed fetch error:', error);
      return [];
    }
  }

  /**
   * Получение полного Abstract (текст)
   */
  async fetchAbstract(pmid: string): Promise<string> {
    await this.rateLimit();

    const url = `${PUBMED_API_BASE}/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml${this.getApiParams()}`;

    try {
      const response = await axios.get(url);
      const xml = response.data;
      
      // Простой парсинг XML для извлечения Abstract
      const abstractMatch = xml.match(/<AbstractText[^>]*>(.*?)<\/AbstractText>/g);
      if (abstractMatch) {
        return abstractMatch
          .map((match: string) => match.replace(/<[^>]+>/g, ''))
          .join(' ');
      }
      
      return '';
    } catch (error) {
      console.error('PubMed abstract error:', error);
      return '';
    }
  }

  /**
   * Получение списка категорий (MeSH Terms)
   */
  async fetchMeshTerms(pmid: string): Promise<string[]> {
    await this.rateLimit();

    const url = `${PUBMED_API_BASE}/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml${this.getApiParams()}`;

    try {
      const response = await axios.get(url);
      const xml = response.data;
      
      // Парсинг MeSH terms
      const meshMatches = xml.match(/<DescriptorName[^>]*>(.*?)<\/DescriptorName>/g);
      if (meshMatches) {
        return meshMatches.map((match: string) => match.replace(/<[^>]+>/g, ''));
      }
      
      return [];
    } catch (error) {
      console.error('PubMed MeSH error:', error);
      return [];
    }
  }

  /**
   * Парсинг статьи из JSON ответа
   */
  private parseArticle(data: any): PubMedArticle | null {
    if (!data) return null;

    const uid = data.uid;
    const title = data.title || '';
    const authors = (data.authors || []).map((a: any) => a.name || '');
    const journal = data.fulljournalname || data.source || '';
    const year = parseInt(data.pubdate?.split(' ')[0]) || 0;
    const doi = data.articleids?.find((id: any) => id.idtype === 'doi')?.value;
    const pmcid = data.articleids?.find((id: any) => id.idtype === 'pmcid')?.value;
    
    // Keywords
    const keywords = data.keywords || [];
    
    // Publication types
    const pubTypes = data.pubtype || [];
    
    // Open Access check
    const isOpenAccess = data.isOpenAccess || false;

    return {
      pmid: uid,
      title: this.cleanText(title),
      abstract: '', // Будет загружено отдельно при необходимости
      abstractText: '',
      authors,
      journal: this.cleanText(journal),
      year,
      volume: data.volume || '',
      issue: data.issue || '',
      pages: data.pages || '',
      doi,
      pmcid,
      keywords,
      meshTerms: [], // Будет загружено отдельно
      publicationTypes: pubTypes,
      language: data.lang?.[0] || 'eng',
      isOpenAccess
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/\[|\]/g, '') // Убираем квадратные скобки
      .trim();
  }

  /**
   * Готовые поисковые запросы по категориям
   */
  getCategoryQueries(): Record<string, string> {
    return {
      nutrition: '(nutrition[Title/Abstract] OR diet[Title/Abstract] OR dietary[Title/Abstract]) AND (health[Title/Abstract] OR metabolic[Title/Abstract])',
      
      fitness: '(exercise[Title/Abstract] OR physical activity[Title/Abstract] OR training[Title/Abstract]) AND (health[Title/Abstract] OR performance[Title/Abstract])',
      
      sleep: '(sleep[Title/Abstract] OR insomnia[Title/Abstract] OR circadian[Title/Abstract]) AND (health[Title/Abstract] OR disorder[Title/Abstract])',
      
      mental_health: '(depression[Title/Abstract] OR anxiety[Title/Abstract] OR stress[Title/Abstract] OR mental health[Title/Abstract]) AND (treatment[Title/Abstract] OR intervention[Title/Abstract])',
      
      weight_loss: '(weight loss[Title/Abstract] OR obesity[Title/Abstract] OR bariatric[Title/Abstract]) AND (intervention[Title/Abstract] OR diet[Title/Abstract])',
      
      cardiovascular: '(cardiovascular[Title/Abstract] OR heart disease[Title/Abstract] OR hypertension[Title/Abstract]) AND (prevention[Title/Abstract] OR treatment[Title/Abstract])',
      
      diabetes: '(diabetes[Title/Abstract] OR glucose[Title/Abstract] OR insulin[Title/Abstract]) AND (management[Title/Abstract] OR treatment[Title/Abstract])',
      
      supplements: '(supplement[Title/Abstract] OR vitamin[Title/Abstract] OR mineral[Title/Abstract]) AND (efficacy[Title/Abstract] OR safety[Title/Abstract])',
      
      meditation: '(meditation[Title/Abstract] OR mindfulness[Title/Abstract] OR yoga[Title/Abstract]) AND (stress[Title/Abstract] OR mental health[Title/Abstract])',
      
      posture: '(posture[Title/Abstract] OR ergonomics[Title/Abstract] OR musculoskeletal[Title/Abstract]) AND (pain[Title/Abstract] OR office[Title/Abstract])'
    };
  }

  /**
   * Импорт статей по категориям для локальной БД
   */
  async importCategoryArticles(
    category: string, 
    maxResults: number = 1000,
    onProgress?: (current: number, total: number) => void
  ): Promise<PubMedArticle[]> {
    const query = this.getCategoryQueries()[category];
    if (!query) {
      throw new Error(`Unknown category: ${category}`);
    }

    const allArticles: PubMedArticle[] = [];
    const batchSize = 100;
    const batches = Math.ceil(maxResults / batchSize);

    for (let i = 0; i < batches; i++) {
      const retstart = i * batchSize;
      const retmax = Math.min(batchSize, maxResults - retstart);
      
      try {
        const result = await this.search(query, retstart, retmax);
        allArticles.push(...result.articles);
        
        if (onProgress) {
          onProgress(allArticles.length, maxResults);
        }
        
        // Пауза между батчами
        if (i < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error importing batch ${i}:`, error);
      }
    }

    return allArticles;
  }
}

export const pubmedService = new PubMedService();
export default pubmedService;

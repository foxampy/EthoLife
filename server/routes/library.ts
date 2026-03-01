/**
 * Library API Routes
 * Управление научной библиотекой (текстовые данные)
 */

import { Router } from 'express';
import { pubmedService } from '../services/pubmedService';
import { supabase } from '../supabase/client';

const router = Router();

// Получить категории библиотеки
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('library_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Поиск статей в локальной БД
router.get('/articles', async (req, res) => {
  try {
    const { 
      q, // поисковый запрос
      category, 
      year_from, 
      year_to,
      is_open_access,
      limit = 20,
      offset = 0
    } = req.query;

    let query = supabase
      .from('library_articles')
      .select('*', { count: 'exact' });

    // Полнотекстовый поиск
    if (q) {
      query = query.or(`title.ilike.%${q}%,abstract.ilike.%${q}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (year_from) {
      query = query.gte('year', year_from);
    }

    if (year_to) {
      query = query.lte('year', year_to);
    }

    if (is_open_access === 'true') {
      query = query.eq('is_open_access', true);
    }

    const { data, error, count } = await query
      .order('year', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;

    res.json({
      articles: data,
      total: count,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Поиск через PubMed API (реальное время)
router.get('/search-pubmed', async (req, res) => {
  try {
    const { q, category, retstart = 0, retmax = 20 } = req.query;

    if (!q && !category) {
      return res.status(400).json({ error: 'Query or category required' });
    }

    let query = q as string;
    
    // Если указана категория, используем готовый запрос
    if (category && !q) {
      const queries = pubmedService.getCategoryQueries();
      query = queries[category as string] || '';
    }

    const result = await pubmedService.search(
      query,
      Number(retstart),
      Number(retmax),
      'relevance',
      { hasAbstract: true }
    );

    res.json(result);
  } catch (error) {
    console.error('PubMed search error:', error);
    res.status(500).json({ error: 'PubMed search failed' });
  }
});

// Импорт статьи из PubMed в локальную БД
router.post('/import-article', async (req, res) => {
  try {
    const { pmid, category } = req.body;

    // Получаем полные данные
    const articles = await pubmedService.fetchArticlesByIds([pmid]);
    
    if (articles.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = articles[0];

    // Добавляем в БД
    const { data, error } = await supabase
      .from('library_articles')
      .insert([{
        pmid: article.pmid,
        pmcid: article.pmcid,
        doi: article.doi,
        title: article.title,
        abstract: article.abstract,
        authors: article.authors,
        journal: article.journal,
        year: article.year,
        volume: article.volume,
        issue: article.issue,
        pages: article.pages,
        keywords: article.keywords,
        mesh_terms: article.meshTerms,
        publication_types: article.publicationTypes,
        category: category || 'general',
        language: article.language,
        is_open_access: article.isOpenAccess,
        pubmed_url: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,
        pmc_url: article.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmcid}/` : null,
        doi_url: article.doi ? `https://doi.org/${article.doi}` : null,
        sync_status: 'synced'
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Article already exists' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import article' });
  }
});

// Массовый импорт по категории
router.post('/import-category', async (req, res) => {
  try {
    const { category, max_results = 100 } = req.body;

    // Запускаем импорт в фоне
    const articles = await pubmedService.importCategoryArticles(
      category,
      max_results,
      (current, total) => {
        console.log(`Importing ${category}: ${current}/${total}`);
      }
    );

    // Вставляем в БД пакетами
    const batchSize = 50;
    const inserted = [];
    
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize).map(article => ({
        pmid: article.pmid,
        pmcid: article.pmcid,
        doi: article.doi,
        title: article.title,
        abstract: article.abstract,
        authors: article.authors,
        journal: article.journal,
        year: article.year,
        volume: article.volume,
        issue: article.issue,
        pages: article.pages,
        keywords: article.keywords,
        mesh_terms: article.meshTerms,
        publication_types: article.publicationTypes,
        category: category,
        language: article.language,
        is_open_access: article.isOpenAccess,
        pubmed_url: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,
        pmc_url: article.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmcid}/` : null,
        doi_url: article.doi ? `https://doi.org/${article.doi}` : null,
        sync_status: 'synced'
      }));

      const { data, error } = await supabase
        .from('library_articles')
        .upsert(batch, { onConflict: 'pmid' })
        .select();

      if (error) {
        console.error('Batch insert error:', error);
      } else {
        inserted.push(...(data || []));
      }

      // Пауза между батчами
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Обновляем счетчик в категории
    await supabase
      .from('library_categories')
      .update({ 
        article_count: inserted.length,
        last_imported_at: new Date().toISOString()
      })
      .eq('name', category);

    res.json({
      imported: inserted.length,
      total_found: articles.length,
      category
    });
  } catch (error) {
    console.error('Category import error:', error);
    res.status(500).json({ error: 'Failed to import category' });
  }
});

// Получить статью по ID
router.get('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('library_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Article not found' });

    res.json(data);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Статистика библиотеки
router.get('/stats', async (req, res) => {
  try {
    const { data: stats, error: statsError } = await supabase
      .from('library_stats')
      .select('*')
      .single();

    const { data: categories, error: catError } = await supabase
      .from('library_category_stats')
      .select('*');

    if (statsError) throw statsError;

    res.json({
      overall: stats,
      by_category: categories || []
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// User library (избранное)
router.get('/user-library', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
      .from('user_library_items')
      .select(`
        *,
        article:library_articles(*)
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('User library error:', error);
    res.status(500).json({ error: 'Failed to fetch user library' });
  }
});

router.post('/user-library', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { article_id, notes, tags } = req.body;

    const { data, error } = await supabase
      .from('user_library_items')
      .insert([{
        user_id: userId,
        article_id,
        notes,
        tags
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Add to library error:', error);
    res.status(500).json({ error: 'Failed to add to library' });
  }
});

export default router;

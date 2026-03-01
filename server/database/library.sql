-- Библиотека научных статей (текстовые данные, не PDF!)
-- Размер: ~100KB на статью вместо 2MB PDF = экономия 95% места

-- Таблица статей
CREATE TABLE IF NOT EXISTS library_articles (
  id SERIAL PRIMARY KEY,
  pmid VARCHAR(20) UNIQUE NOT NULL,
  pmcid VARCHAR(20),
  doi VARCHAR(255),
  
  -- Основные поля (текст)
  title TEXT NOT NULL,
  abstract TEXT,
  abstract_text TEXT,
  
  -- Авторы и журнал
  authors TEXT[],
  journal VARCHAR(500),
  journal_abbreviation VARCHAR(100),
  
  -- Дата публикации
  year INTEGER,
  month INTEGER,
  day INTEGER,
  publication_date DATE,
  
  -- Библиографические данные
  volume VARCHAR(50),
  issue VARCHAR(50),
  pages VARCHAR(50),
  
  -- Категории и теги
  keywords TEXT[],
  mesh_terms TEXT[],
  publication_types TEXT[],
  
  -- Категоризация для нашей библиотеки
  category VARCHAR(100),
  subcategory VARCHAR(100),
  
  -- Язык и доступность
  language VARCHAR(10) DEFAULT 'eng',
  is_open_access BOOLEAN DEFAULT FALSE,
  
  -- Метрики
  citation_count INTEGER DEFAULT 0,
  impact_factor NUMERIC(5,3),
  
  -- Полный текст (если доступен Open Access)
  full_text TEXT,
  has_full_text BOOLEAN DEFAULT FALSE,
  
  -- Ссылки
  pubmed_url VARCHAR(500),
  pmc_url VARCHAR(500),
  doi_url VARCHAR(500),
  
  -- Внутренние метаданные
  imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_synced_at TIMESTAMP,
  sync_status VARCHAR(20) DEFAULT 'pending',
  
  -- Индексы для поиска
  search_vector TSVECTOR
);

-- Индексы для быстрого поиска
CREATE INDEX idx_library_articles_pmid ON library_articles(pmid);
CREATE INDEX idx_library_articles_category ON library_articles(category);
CREATE INDEX idx_library_articles_year ON library_articles(year);
CREATE INDEX idx_library_articles_journal ON library_articles(journal);
CREATE INDEX idx_library_articles_open_access ON library_articles(is_open_access);
CREATE INDEX idx_library_articles_keywords ON library_articles USING GIN(keywords);
CREATE INDEX idx_library_articles_mesh ON library_articles USING GIN(mesh_terms);
CREATE INDEX idx_library_articles_search ON library_articles USING GIN(search_vector);

-- Таблица для связи статей с пользователями (избранное)
CREATE TABLE IF NOT EXISTS user_library_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  article_id INTEGER REFERENCES library_articles(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  read_status VARCHAR(20) DEFAULT 'unread',
  reading_progress INTEGER DEFAULT 0,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  is_relevant BOOLEAN,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, article_id)
);

CREATE INDEX idx_user_library_user ON user_library_items(user_id);
CREATE INDEX idx_user_library_article ON user_library_items(article_id);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS library_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(200),
  description TEXT,
  pubmed_query TEXT,
  article_count INTEGER DEFAULT 0,
  last_imported_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Заполняем категории
INSERT INTO library_categories (name, display_name, description, pubmed_query) VALUES
('nutrition', 'Питание', 'Исследования в области питания, диетологии и метаболизма', 
 '(nutrition[Title/Abstract] OR diet[Title/Abstract]) AND humans[MeSH Terms]'),
('fitness', 'Фитнес и спорт', 'Физическая активность, тренировки и спортивная медицина',
 '(exercise[Title/Abstract] OR "physical activity"[Title/Abstract]) AND humans[MeSH Terms]'),
('sleep', 'Сон', 'Исследования сна, нарушения сна и циркадных ритмов',
 '(sleep[Title/Abstract] OR insomnia[Title/Abstract]) AND humans[MeSH Terms]'),
('mental_health', 'Ментальное здоровье', 'Психология, психиатрия и ментальное благополучие',
 '(depression[Title/Abstract] OR anxiety[Title/Abstract] OR "mental health"[Title/Abstract]) AND humans[MeSH Terms]'),
('weight_loss', 'Похудение', 'Ожирение, похудение и бариатрия',
 '("weight loss"[Title/Abstract] OR obesity[Title/Abstract]) AND humans[MeSH Terms]'),
('cardiovascular', 'Сердечно-сосудистая система', 'Сердечно-сосудистые заболевания и их профилактика',
 '(cardiovascular[Title/Abstract] OR "heart disease"[Title/Abstract]) AND humans[MeSH Terms]'),
('diabetes', 'Диабет', 'Сахарный диабет, глюкоза и инсулин',
 '(diabetes[Title/Abstract] OR glucose[Title/Abstract]) AND humans[MeSH Terms]'),
('supplements', 'БАДы и витамины', 'Пищевые добавки, витамины и минералы',
 '(supplement[Title/Abstract] OR vitamin[Title/Abstract]) AND (efficacy[Title/Abstract] OR safety[Title/Abstract]) AND humans[MeSH Terms]'),
('meditation', 'Медитация', 'Медитация, осознанность и йога',
 '(meditation[Title/Abstract] OR mindfulness[Title/Abstract] OR yoga[Title/Abstract]) AND humans[MeSH Terms]'),
('posture', 'Осанка', 'Эргономика, осанка и мышечно-скелетные проблемы',
 '(posture[Title/Abstract] OR ergonomics[Title/Abstract]) AND (pain[Title/Abstract] OR office[Title/Abstract]) AND humans[MeSH Terms]')
ON CONFLICT (name) DO NOTHING;

-- Программа вознаграждения исследователей
CREATE TABLE IF NOT EXISTS researcher_program (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'applicant',
  institution VARCHAR(500),
  degree VARCHAR(200),
  specialization TEXT[],
  orcid_id VARCHAR(50),
  articles_reviewed INTEGER DEFAULT 0,
  articles_contributed INTEGER DEFAULT 0,
  verifications_made INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  pending_payout DECIMAL(10,2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  badge_level VARCHAR(50) DEFAULT 'bronze',
  cv_url VARCHAR(500),
  publications_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Задачи для исследователей
CREATE TABLE IF NOT EXISTS researcher_tasks (
  id SERIAL PRIMARY KEY,
  task_type VARCHAR(100) NOT NULL,
  article_id INTEGER REFERENCES library_articles(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(500),
  description TEXT,
  requirements TEXT,
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'medium',
  deadline TIMESTAMP,
  reward_amount DECIMAL(10,2),
  reward_currency VARCHAR(10) DEFAULT 'UNITY',
  submission_text TEXT,
  submission_url VARCHAR(500),
  reviewed_by INTEGER REFERENCES users(id),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_at TIMESTAMP,
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- Институциональное сотрудничество
CREATE TABLE IF NOT EXISTS institutional_partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  type VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(200),
  website VARCHAR(500),
  contact_name VARCHAR(300),
  contact_email VARCHAR(300),
  contact_phone VARCHAR(100),
  status VARCHAR(50) DEFAULT 'negotiating',
  partnership_type VARCHAR(100)[],
  annual_contribution DECIMAL(12,2),
  total_contributed DECIMAL(12,2) DEFAULT 0,
  moa_signed BOOLEAN DEFAULT FALSE,
  moa_signed_at TIMESTAMP,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Функция для обновления поискового вектора
CREATE OR REPLACE FUNCTION update_article_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.abstract, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.keywords::text, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.mesh_terms::text, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_article_search_vector
BEFORE INSERT OR UPDATE ON library_articles
FOR EACH ROW
EXECUTE FUNCTION update_article_search_vector();

-- Представление для статистики
CREATE OR REPLACE VIEW library_stats AS
SELECT 
  COUNT(*) as total_articles,
  COUNT(*) FILTER (WHERE is_open_access) as open_access_count,
  COUNT(*) FILTER (WHERE has_full_text) as full_text_count,
  COUNT(DISTINCT category) as categories_count,
  COUNT(DISTINCT journal) as journals_count,
  AVG(citation_count) as avg_citations,
  MAX(imported_at) as last_updated
FROM library_articles;

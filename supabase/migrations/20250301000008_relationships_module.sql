-- ============================================
-- MIGRATION: Relationships Module
-- Version: 20250301000008
-- Description: Full relationships tracking system
-- ============================================

-- ============================================
-- CORE: Contacts
-- ============================================

-- Important people in user's life
CREATE TABLE relationships_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('family', 'partner', 'friend', 'colleague', 'mentor', 'acquaintance', 'other')),
    relationship_subtype VARCHAR(50), -- mother, father, sibling, spouse, best_friend, etc
    importance_level INTEGER CHECK (importance_level BETWEEN 1 AND 10), -- how important
    intimacy_level INTEGER CHECK (intimacy_level BETWEEN 1 AND 10), -- how close
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10), -- how stressful
    satisfaction_level INTEGER CHECK (satisfaction_level BETWEEN 1 AND 10), -- satisfaction level
    contact_frequency_goal VARCHAR(50) CHECK (contact_frequency_goal IN ('daily', 'few_times_week', 'weekly', 'biweekly', 'monthly', 'quarterly', 'as_needed')),
    preferred_contact_methods VARCHAR[] DEFAULT '{}', -- call, text, video, in_person, social_media
    birthday DATE,
    anniversary DATE,
    key_memories TEXT[] DEFAULT '{}',
    shared_interests VARCHAR[] DEFAULT '{}',
    photo_url VARCHAR(500),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact details (phones, emails, addresses)
CREATE TABLE relationships_contact_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES relationships_contacts(id) ON DELETE CASCADE,
    detail_type VARCHAR(50) NOT NULL CHECK (detail_type IN ('phone', 'email', 'address', 'social_media', 'messenger', 'other')),
    label VARCHAR(50), -- home, work, personal
    value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INTERACTIONS
-- ============================================

-- Interactions (communications)
CREATE TABLE relationships_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES relationships_contacts(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('call', 'video_call', 'text_message', 'voice_message', 'in_person', 'social_media', 'email', 'letter', 'other')),
    initiated_by VARCHAR(20) CHECK (initiated_by IN ('me', 'them', 'mutual')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 10), -- how it went
    energy_change INTEGER CHECK (energy_change BETWEEN -5 AND 5), -- +5 energized, -5 drained
    mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
    topics_discussed TEXT[] DEFAULT '{}',
    was_supportive BOOLEAN DEFAULT false,
    had_conflict BOOLEAN DEFAULT false,
    conflict_resolution VARCHAR(50) CHECK (conflict_resolution IN ('resolved', 'ongoing', 'avoided', 'not_discussed')),
    location VARCHAR(255),
    occasion VARCHAR(255), -- birthday, casual, planned_meeting
    follow_up_needed BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    photos VARCHAR[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Planned interactions
CREATE TABLE relationships_planned_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES relationships_contacts(id) ON DELETE CASCADE,
    planned_type VARCHAR(50) NOT NULL CHECK (planned_type IN ('call', 'meet', 'celebrate', 'gift', 'support', 'other')),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    occasion VARCHAR(255),
    preparation_needed TEXT,
    reminder_enabled BOOLEAN DEFAULT true,
    reminder_time TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT false,
    completed_interaction_id UUID REFERENCES relationships_interactions(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- QUALITY & ASSESSMENTS
-- ============================================

-- Relationship assessments
CREATE TABLE relationships_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES relationships_contacts(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    overall_satisfaction INTEGER CHECK (overall_satisfaction BETWEEN 1 AND 10),
    communication_quality INTEGER CHECK (communication_quality BETWEEN 1 AND 10),
    trust_level INTEGER CHECK (trust_level BETWEEN 1 AND 10),
    support_received INTEGER CHECK (support_received BETWEEN 1 AND 10),
    support_given INTEGER CHECK (support_given BETWEEN 1 AND 10),
    conflict_frequency VARCHAR(50) CHECK (conflict_frequency IN ('never', 'rarely', 'sometimes', 'often', 'constantly')),
    conflict_resolution_quality INTEGER CHECK (conflict_resolution_quality BETWEEN 1 AND 10),
    shared_values_alignment INTEGER CHECK (shared_values_alignment BETWEEN 1 AND 10),
    future_outlook VARCHAR(50) CHECK (future_outlook IN ('improving', 'stable', 'declining', 'uncertain')),
    strength_areas TEXT[] DEFAULT '{}',
    growth_areas TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Love Languages (for close relationships)
CREATE TABLE relationships_love_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES relationships_contacts(id) ON DELETE CASCADE,
    my_love_language VARCHAR(50) CHECK (my_love_language IN ('words_of_affirmation', 'acts_of_service', 'receiving_gifts', 'quality_time', 'physical_touch')),
    their_love_language_guess VARCHAR(50) CHECK (their_love_language_guess IN ('words_of_affirmation', 'acts_of_service', 'receiving_gifts', 'quality_time', 'physical_touch')),
    their_confirmed_love_language VARCHAR(50) CHECK (their_confirmed_love_language IN ('words_of_affirmation', 'acts_of_service', 'receiving_gifts', 'quality_time', 'physical_touch')),
    my_satisfaction_giving INTEGER CHECK (my_satisfaction_giving BETWEEN 1 AND 10),
    my_satisfaction_receiving INTEGER CHECK (my_satisfaction_receiving BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, contact_id)
);

-- ============================================
-- BOUNDARIES & PATTERNS
-- ============================================

-- Boundaries in relationships
CREATE TABLE relationships_boundaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES relationships_contacts(id) ON DELETE CASCADE,
    boundary_type VARCHAR(50) NOT NULL CHECK (boundary_type IN ('time', 'emotional', 'physical', 'digital', 'financial', 'other')),
    boundary_description TEXT NOT NULL,
    is_communicated BOOLEAN DEFAULT false,
    is_respected VARCHAR(50) CHECK (is_respected IN ('always', 'usually', 'sometimes', 'rarely', 'never')),
    enforcement_needed TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Patterns in relationships
CREATE TABLE relationships_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES relationships_contacts(id), -- if specific to a contact
    pattern_name VARCHAR(255) NOT NULL,
    pattern_type VARCHAR(50) CHECK (pattern_type IN ('positive', 'negative', 'neutral', 'toxic', 'growth')),
    description TEXT,
    trigger_situations TEXT[] DEFAULT '{}',
    my_typical_response TEXT,
    their_typical_response TEXT,
    desired_change TEXT,
    action_plan TEXT,
    is_active BOOLEAN DEFAULT true,
    discovered_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SOCIAL CIRCLE ANALYSIS
-- ============================================

-- Social circle analysis
CREATE TABLE relationships_social_circle_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL,
    total_active_contacts INTEGER DEFAULT 0,
    avg_interaction_frequency_days DECIMAL(4,1),
    relationship_distribution JSONB DEFAULT '{}', -- { family: 5, friends: 8, colleagues: 12 }
    satisfaction_by_category JSONB DEFAULT '{}',
    energy_balance INTEGER CHECK (energy_balance BETWEEN -100 AND 100),
    support_network_strength INTEGER CHECK (support_network_strength BETWEEN 1 AND 10),
    isolation_risk_score INTEGER CHECK (isolation_risk_score BETWEEN 1 AND 10),
    diversity_score INTEGER CHECK (diversity_score BETWEEN 1 AND 10),
    reciprocity_score INTEGER CHECK (reciprocity_score BETWEEN 1 AND 10),
    ai_insights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- GOALS & EXERCISES
-- ============================================

-- Relationship goals
CREATE TABLE relationships_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES relationships_contacts(id), -- specific person or general goal
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('improve_communication', 'spend_more_time', 'resolve_conflict', 'build_trust', 'deepen_intimacy', 'set_boundaries', 'reconnect', 'maintain', 'let_go')),
    description TEXT NOT NULL,
    specific_actions TEXT[] DEFAULT '{}',
    target_date DATE,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    is_achieved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Exercises for relationships
CREATE TABLE relationships_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('communication', 'appreciation', 'conflict_resolution', 'intimacy', 'trust_building', 'boundary_setting', 'forgiveness')),
    description TEXT,
    instructions TEXT[] DEFAULT '{}',
    duration_minutes INTEGER,
    is_for_couples BOOLEAN DEFAULT false,
    is_for_families BOOLEAN DEFAULT false,
    is_for_friends BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Completed exercises
CREATE TABLE relationships_exercise_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES relationships_contacts(id), -- with whom done
    exercise_id UUID NOT NULL REFERENCES relationships_exercises(id),
    completed_at TIMESTAMPTZ DEFAULT now(),
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    notes TEXT,
    would_repeat BOOLEAN
);

-- ============================================
-- AI & INSIGHTS
-- ============================================

CREATE TABLE relationships_ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_date DATE NOT NULL,
    insight_type VARCHAR(50) CHECK (insight_type IN ('pattern', 'warning', 'recommendation', 'celebration', 'connection_reminder', 'balance_alert')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    related_contact_id UUID REFERENCES relationships_contacts(id),
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    suggested_action TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- Contacts indexes
CREATE INDEX idx_contacts_user_id ON relationships_contacts(user_id);
CREATE INDEX idx_contacts_relationship_type ON relationships_contacts(relationship_type);
CREATE INDEX idx_contacts_birthday ON relationships_contacts(birthday);
CREATE INDEX idx_contacts_importance ON relationships_contacts(importance_level DESC);

-- Contact details indexes
CREATE INDEX idx_contact_details_contact_id ON relationships_contact_details(contact_id);
CREATE INDEX idx_contact_details_type ON relationships_contact_details(detail_type);

-- Interactions indexes
CREATE INDEX idx_interactions_user_id ON relationships_interactions(user_id);
CREATE INDEX idx_interactions_contact_id ON relationships_interactions(contact_id);
CREATE INDEX idx_interactions_start_time ON relationships_interactions(start_time DESC);
CREATE INDEX idx_interactions_type ON relationships_interactions(interaction_type);

-- Planned interactions indexes
CREATE INDEX idx_planned_user_id ON relationships_planned_interactions(user_id);
CREATE INDEX idx_planned_contact_id ON relationships_planned_interactions(contact_id);
CREATE INDEX idx_planned_date ON relationships_planned_interactions(scheduled_date);
CREATE INDEX idx_planned_reminder ON relationships_planned_interactions(reminder_time) WHERE reminder_enabled = true;

-- Assessments indexes
CREATE INDEX idx_assessments_user_contact ON relationships_assessments(user_id, contact_id);
CREATE INDEX idx_assessments_date ON relationships_assessments(assessment_date DESC);

-- Social circle analysis indexes
CREATE INDEX idx_social_analysis_user_date ON relationships_social_circle_analysis(user_id, analysis_date DESC);

-- AI insights indexes
CREATE INDEX idx_ai_insights_user ON relationships_ai_insights(user_id, is_read);
CREATE INDEX idx_ai_insights_priority ON relationships_ai_insights(priority) WHERE is_read = false;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE relationships_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_planned_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_love_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_boundaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_social_circle_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_exercise_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships_ai_insights ENABLE ROW LEVEL SECURITY;

-- Contacts policies
CREATE POLICY "Users can manage their own contacts"
    ON relationships_contacts FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Contact details policies
CREATE POLICY "Users can manage details for their contacts"
    ON relationships_contact_details FOR ALL
    USING (EXISTS (
        SELECT 1 FROM relationships_contacts 
        WHERE id = contact_id AND user_id = auth.uid()
    ));

-- Interactions policies
CREATE POLICY "Users can manage their own interactions"
    ON relationships_interactions FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Planned interactions policies
CREATE POLICY "Users can manage their planned interactions"
    ON relationships_planned_interactions FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Assessments policies
CREATE POLICY "Users can manage their assessments"
    ON relationships_assessments FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Love languages policies
CREATE POLICY "Users can manage love languages"
    ON relationships_love_languages FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Boundaries policies
CREATE POLICY "Users can manage boundaries"
    ON relationships_boundaries FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Patterns policies
CREATE POLICY "Users can manage patterns"
    ON relationships_patterns FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Social circle analysis policies
CREATE POLICY "Users can manage their social analysis"
    ON relationships_social_circle_analysis FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Goals policies
CREATE POLICY "Users can manage their goals"
    ON relationships_goals FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Exercise sessions policies
CREATE POLICY "Users can manage their exercise sessions"
    ON relationships_exercise_sessions FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- AI insights policies
CREATE POLICY "Users can manage their AI insights"
    ON relationships_ai_insights FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_relationships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contacts_updated
    BEFORE UPDATE ON relationships_contacts
    FOR EACH ROW EXECUTE FUNCTION update_relationships_updated_at();

CREATE TRIGGER trigger_planned_updated
    BEFORE UPDATE ON relationships_planned_interactions
    FOR EACH ROW EXECUTE FUNCTION update_relationships_updated_at();

CREATE TRIGGER trigger_love_languages_updated
    BEFORE UPDATE ON relationships_love_languages
    FOR EACH ROW EXECUTE FUNCTION update_relationships_updated_at();

CREATE TRIGGER trigger_goals_updated
    BEFORE UPDATE ON relationships_goals
    FOR EACH ROW EXECUTE FUNCTION update_relationships_updated_at();

-- Auto-update duration from start/end times
CREATE OR REPLACE FUNCTION calculate_interaction_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_time IS NOT NULL AND NEW.end_time IS NOT NULL THEN
        NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_interaction_duration
    BEFORE INSERT OR UPDATE ON relationships_interactions
    FOR EACH ROW EXECUTE FUNCTION calculate_interaction_duration();

-- Update contact last interaction on new interaction
CREATE OR REPLACE FUNCTION update_contact_last_interaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if this is the most recent interaction
    IF NOT EXISTS (
        SELECT 1 FROM relationships_interactions
        WHERE contact_id = NEW.contact_id
        AND start_time > NEW.start_time
        AND id != NEW.id
    ) THEN
        UPDATE relationships_contacts
        SET updated_at = now()
        WHERE id = NEW.contact_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_last_interaction
    AFTER INSERT ON relationships_interactions
    FOR EACH ROW EXECUTE FUNCTION update_contact_last_interaction();

-- ============================================
-- SNAPSHOT INTEGRATION
-- ============================================

-- Function to get relationship stats for daily snapshot
CREATE OR REPLACE FUNCTION get_relationships_snapshot(p_user_id UUID, p_date DATE)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'interactions_today', (
            SELECT COUNT(*) FROM relationships_interactions
            WHERE user_id = p_user_id
            AND DATE(start_time) = p_date
        ),
        'avg_quality_today', (
            SELECT COALESCE(AVG(quality_rating), 0)
            FROM relationships_interactions
            WHERE user_id = p_user_id
            AND DATE(start_time) = p_date
        ),
        'energy_balance_today', (
            SELECT COALESCE(SUM(energy_change), 0)
            FROM relationships_interactions
            WHERE user_id = p_user_id
            AND DATE(start_time) = p_date
        ),
        'total_active_contacts', (
            SELECT COUNT(*) FROM relationships_contacts
            WHERE user_id = p_user_id AND is_active = true
        ),
        'planned_today', (
            SELECT COUNT(*) FROM relationships_planned_interactions
            WHERE user_id = p_user_id
            AND scheduled_date = p_date
            AND is_completed = false
        ),
        'birthdays_today', (
            SELECT COUNT(*) FROM relationships_contacts
            WHERE user_id = p_user_id
            AND is_active = true
            AND birthday IS NOT NULL
            AND EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM p_date)
            AND EXTRACT(DAY FROM birthday) = EXTRACT(DAY FROM p_date)
        ),
        'avg_satisfaction', (
            SELECT COALESCE(AVG(satisfaction_level), 0)
            FROM relationships_contacts
            WHERE user_id = p_user_id AND is_active = true
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA: Default Exercises
-- ============================================

INSERT INTO relationships_exercises (name, category, description, instructions, duration_minutes, is_for_couples, is_for_families, is_for_friends) VALUES
('Active Listening Practice', 'communication', 'Practice truly listening without interrupting or planning your response', 
    ARRAY['Set a timer for 10 minutes', 'One person speaks, the other only listens', 'Listener summarizes what they heard', 'Switch roles'], 20, true, true, true),
('Gratitude Expression', 'appreciation', 'Express specific things you appreciate about the other person',
    ARRAY['Write down 3 specific things you appreciate', 'Share them in person or via message', 'Be specific about actions, not just traits'], 15, true, true, true),
('Conflict De-escalation', 'conflict_resolution', 'Practice pausing and cooling down during disagreements',
    ARRAY['Recognize rising tension', 'Request a 10-minute break', 'Take deep breaths', 'Return to discussion when calm'], 30, true, true, false),
('Quality Time Ritual', 'intimacy', 'Create a regular dedicated time together without distractions',
    ARRAY['Schedule 30 minutes without phones', 'Choose an activity you both enjoy', 'Focus fully on each other', 'Make it a regular habit'], 30, true, true, true),
('Trust Building Questions', 'trust_building', 'Ask deeper questions to build emotional intimacy',
    ARRAY['Take turns asking questions', 'Listen without judgment', 'Share authentically', 'Maintain confidentiality'], 45, true, false, true),
('Boundary Setting Practice', 'boundary_setting', 'Practice communicating your boundaries clearly',
    ARRAY['Identify a boundary you need', 'Use "I" statements', 'Be specific about what you need', 'Suggest alternatives if appropriate'], 20, true, true, true),
('Forgiveness Letter', 'forgiveness', 'Write a letter of forgiveness (not necessarily to send)',
    ARRAY['Write about the hurt you experienced', 'Express your feelings fully', 'Write about letting go', 'Decide whether to share or keep private'], 30, false, false, false);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE relationships_contacts IS 'Important people in user life with relationship metadata';
COMMENT ON TABLE relationships_interactions IS 'Logged communications and meetings with contacts';
COMMENT ON TABLE relationships_planned_interactions IS 'Scheduled future interactions and reminders';
COMMENT ON TABLE relationships_assessments IS 'Periodic relationship quality assessments';
COMMENT ON TABLE relationships_social_circle_analysis IS 'Aggregated analysis of social health';

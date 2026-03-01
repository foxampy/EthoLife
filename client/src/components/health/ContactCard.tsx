import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  Video,
  Mail,
  Heart,
  Clock,
  ChevronRight,
  User,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { moduleColors } from '@/stores/healthStore';
import { Contact, useRelationshipsStore } from '@/stores/modules/relationshipsStore';

const RELATIONSHIPS_COLOR = moduleColors.relationships.primary;
const RELATIONSHIPS_BG = moduleColors.relationships.bg;

interface ContactCardProps {
  contact: Contact;
  onLogInteraction?: () => void;
  onViewDetails?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function ContactCard({
  contact,
  onLogInteraction,
  onViewDetails,
  showActions = true,
  compact = false,
}: ContactCardProps) {
  const { getConnectionHealth, getInteractionsByContact } = useRelationshipsStore();
  
  const health = getConnectionHealth(contact.id);
  const interactions = getInteractionsByContact(contact.id);
  const lastInteraction = interactions[0];
  
  const daysSince = contact.days_since_contact || 0;
  const needsAttention = daysSince > 14 || health.status === 'at_risk';
  
  const getHealthColor = () => {
    switch (health.status) {
      case 'healthy':
        return '#22c55e';
      case 'needs_attention':
        return '#eab308';
      case 'at_risk':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const getRelationshipIcon = () => {
    switch (contact.relationship_type) {
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'partner':
        return '💕';
      case 'friend':
        return '👋';
      case 'colleague':
        return '💼';
      case 'mentor':
        return '🎓';
      default:
        return '👤';
    }
  };

  const getRelationshipLabel = () => {
    const labels: Record<string, string> = {
      family: 'Семья',
      partner: 'Партнер',
      friend: 'Друг',
      colleague: 'Коллега',
      mentor: 'Наставник',
      acquaintance: 'Знакомый',
      other: 'Другое',
    };
    return labels[contact.relationship_type] || contact.relationship_type;
  };

  const handleQuickAction = (action: 'call' | 'message' | 'video') => {
    // In a real app, these would trigger actual phone/messaging actions
    // For now, we just log the interaction
    if (onLogInteraction) {
      onLogInteraction();
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={onViewDetails}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: RELATIONSHIPS_BG }}
                >
                  {contact.photo_url ? (
                    <img 
                      src={contact.photo_url} 
                      alt={contact.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{getRelationshipIcon()}</span>
                  )}
                </div>
                {/* Health indicator */}
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: getHealthColor() }}
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{contact.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{getRelationshipLabel()}</span>
                  {contact.relationship_subtype && (
                    <span className="text-gray-400">• {contact.relationship_subtype}</span>
                  )}
                </div>
              </div>
              
              {/* Quick action */}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAction('call');
                }}
              >
                <Phone className="w-4 h-4" style={{ color: RELATIONSHIPS_COLOR }} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`overflow-hidden transition-shadow hover:shadow-lg ${
          needsAttention ? 'border-orange-300' : ''
        }`}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div 
              className="relative w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: RELATIONSHIPS_BG }}
            >
              {contact.photo_url ? (
                <img 
                  src={contact.photo_url} 
                  alt={contact.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{getRelationshipIcon()}</span>
              )}
              
              {/* Importance badge */}
              {contact.importance_level >= 8 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-xs">⭐</span>
                </div>
              )}
              
              {/* Health indicator */}
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                style={{ backgroundColor: getHealthColor() }}
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Badge variant="secondary" className="text-xs">
                      {getRelationshipLabel()}
                    </Badge>
                    {contact.relationship_subtype && (
                      <span className="text-gray-400">{contact.relationship_subtype}</span>
                    )}
                  </div>
                </div>
                
                {needsAttention && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">{daysSince}д</span>
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <Heart className="w-4 h-4" style={{ color: RELATIONSHIPS_COLOR }} />
                  <span className="font-medium">{contact.importance_level}/10</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={daysSince > 14 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                    {daysSince === Infinity || daysSince === 0 
                      ? 'Нет связи' 
                      : `${daysSince} дн. назад`}
                  </span>
                </div>
              </div>
              
              {/* Quality rating */}
              {lastInteraction && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">Последнее:</span>
                  <Badge 
                    variant="secondary"
                    style={{
                      backgroundColor: getQualityColor(lastInteraction.quality_rating),
                      color: 'white',
                    }}
                  >
                    {lastInteraction.quality_rating}/10
                  </Badge>
                  {lastInteraction.energy_change !== 0 && (
                    <span className={`text-xs ${lastInteraction.energy_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {lastInteraction.energy_change > 0 ? '+' : ''}{lastInteraction.energy_change} ⚡
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAction('call');
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Звонок
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAction('message');
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Написать
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAction('video');
                }}
              >
                <Video className="w-4 h-4 mr-2" />
                Видео
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.();
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Mini contact card for lists
export function ContactMiniCard({ contact, onClick }: { contact: Contact; onClick?: () => void }) {
  const getRelationshipIcon = () => {
    switch (contact.relationship_type) {
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'partner':
        return '💕';
      case 'friend':
        return '👋';
      case 'colleague':
        return '💼';
      default:
        return '👤';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-pink-300 transition-colors w-full text-left"
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
        style={{ backgroundColor: RELATIONSHIPS_BG }}
      >
        {getRelationshipIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{contact.name}</p>
        <p className="text-xs text-gray-500">{contact.relationship_type}</p>
      </div>
    </motion.button>
  );
}

// Contact selector for forms
export function ContactSelector({
  contacts,
  selectedId,
  onSelect,
}: {
  contacts: Contact[];
  selectedId?: string;
  onSelect: (contact: Contact) => void;
}) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {contacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => onSelect(contact)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            selectedId === contact.id
              ? 'bg-pink-100 border border-pink-300'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: RELATIONSHIPS_BG }}
          >
            {contact.photo_url ? (
              <img 
                src={contact.photo_url} 
                alt={contact.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">{contact.name}</p>
            <p className="text-xs text-gray-500">{contact.relationship_type}</p>
          </div>
          {selectedId === contact.id && (
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: RELATIONSHIPS_COLOR }}
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// Helper functions
function getQualityColor(rating: number): string {
  if (rating >= 8) return '#22c55e';
  if (rating >= 6) return '#84cc16';
  if (rating >= 4) return '#eab308';
  return '#ef4444';
}

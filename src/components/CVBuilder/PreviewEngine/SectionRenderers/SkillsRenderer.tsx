// src/components/CVBuilder/PreviewEngine/SectionRenderers/SkillsRenderer.tsx
import React from 'react';
import { Code2, Award, Users, Wrench } from 'lucide-react';
import { SectionRendererProps } from '../types';
import { useStyleSystem } from '../../StyleSystem/ThemeProvider';

interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5 scale
  category: string;
}

interface SkillsRendererProps extends SectionRendererProps {
  data: SkillItem[];
  showIcon?: boolean;
  layout?: 'bars' | 'dots' | 'tags' | 'grouped' | 'minimal';
  showLevels?: boolean;
  groupByCategory?: boolean;
  columns?: number;
}

const SkillsRenderer: React.FC<SkillsRendererProps> = ({
  data,
  isVisible,
  showIcon = true,
  layout = 'bars',
  showLevels = true,
  groupByCategory = false,
  columns = 2,
  className = '',
  style = {}
}) => {
  const { currentTheme } = useStyleSystem();

  if (!isVisible || !data || data.length === 0) return null;

  const sectionTitle = "Skills";

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('technical') || lowerCategory.includes('programming')) return Code2;
    if (lowerCategory.includes('soft') || lowerCategory.includes('interpersonal')) return Users;
    if (lowerCategory.includes('certification') || lowerCategory.includes('license')) return Award;
    return Wrench;
  };

  const getLevelText = (level: number) => {
    const levels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
    return levels[level - 1] || 'Unknown';
  };

  const groupedSkills = groupByCategory 
    ? data.reduce((groups, skill) => {
        const category = skill.category || 'Other';
        if (!groups[category]) groups[category] = [];
        groups[category].push(skill);
        return groups;
      }, {} as Record<string, SkillItem[]>)
    : { 'All Skills': data };

  const renderSectionHeader = () => (
    <div className="flex items-center gap-3 mb-6">
      {showIcon && (
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{
            backgroundColor: 'var(--cv-color-primary)',
            color: 'white'
          }}
        >
          <Code2 className="h-4 w-4" />
        </div>
      )}
      <h2 
        className="font-semibold uppercase tracking-wide"
        style={{
          fontSize: 'var(--cv-text-lg)',
          fontFamily: 'var(--cv-font-heading)',
          fontWeight: 'var(--cv-font-semibold)',
          color: 'var(--cv-color-primary)',
          letterSpacing: '0.05em'
        }}
      >
        {sectionTitle}
      </h2>
      <div 
        className="flex-1 h-px"
        style={{ backgroundColor: 'var(--cv-color-border)' }}
      />
    </div>
  );

  const renderSkillBars = (skills: SkillItem[]) => (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.id} className="space-y-1">
          <div className="flex justify-between items-center">
            <span 
              className="font-medium"
              style={{
                fontSize: 'var(--cv-text-sm)',
                fontFamily: 'var(--cv-font-body)',
                color: 'var(--cv-color-text-primary)'
              }}
            >
              {skill.name}
            </span>
            {showLevels && (
              <span 
                className="text-xs"
                style={{ color: 'var(--cv-color-text-muted)' }}
              >
                {getLevelText(skill.level)}
              </span>
            )}
          </div>
          <div 
            className="h-2 rounded-full"
            style={{ backgroundColor: 'var(--cv-color-surface)' }}
          >
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(skill.level / 5) * 100}%`,
                backgroundColor: 'var(--cv-color-primary)'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkillDots = (skills: SkillItem[]) => (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.id} className="flex items-center justify-between">
          <span 
            className="font-medium"
            style={{
              fontSize: 'var(--cv-text-sm)',
              fontFamily: 'var(--cv-font-body)',
              color: 'var(--cv-color-text-primary)'
            }}
          >
            {skill.name}
          </span>
          {showLevels && (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div 
                  key={dot}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: dot <= skill.level 
                      ? 'var(--cv-color-primary)' 
                      : 'var(--cv-color-border)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillTags = (skills: SkillItem[]) => (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span 
          key={skill.id}
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: showLevels && skill.level >= 4 
              ? 'var(--cv-color-primary)' 
              : 'var(--cv-color-surface)',
            color: showLevels && skill.level >= 4 
              ? 'white' 
              : 'var(--cv-color-text-primary)',
            border: `1px solid var(--cv-color-border)`
          }}
          title={showLevels ? `${skill.name} - ${getLevelText(skill.level)}` : skill.name}
        >
          {skill.name}
          {showLevels && (
            <span className="ml-1 opacity-75">
              {'★'.repeat(skill.level)}
            </span>
          )}
        </span>
      ))}
    </div>
  );

  const renderSkillMinimal = (skills: SkillItem[]) => (
    <div 
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}
    >
      {skills.map((skill) => (
        <div key={skill.id} className="text-sm">
          <span 
            style={{
              fontSize: 'var(--cv-text-sm)',
              fontFamily: 'var(--cv-font-body)',
              color: 'var(--cv-color-text-primary)'
            }}
          >
            {skill.name}
          </span>
          {showLevels && (
            <span 
              className="ml-2"
              style={{ color: 'var(--cv-color-text-muted)' }}
            >
              ({getLevelText(skill.level)})
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillsByLayout = (skills: SkillItem[]) => {
    switch (layout) {
      case 'dots':
        return renderSkillDots(skills);
      case 'tags':
        return renderSkillTags(skills);
      case 'minimal':
        return renderSkillMinimal(skills);
      case 'bars':
      default:
        return renderSkillBars(skills);
    }
  };

  const renderGroupedSkills = () => {
    return Object.entries(groupedSkills).map(([category, skills]) => {
      const CategoryIcon = getCategoryIcon(category);
      
      return (
        <div key={category} className="mb-6 last:mb-0">
          {groupByCategory && (
            <div className="flex items-center gap-2 mb-4">
              <CategoryIcon 
                className="h-4 w-4"
                style={{ color: 'var(--cv-color-secondary)' }}
              />
              <h3 
                className="font-medium"
                style={{
                  fontSize: 'var(--cv-text-base)',
                  fontFamily: 'var(--cv-font-heading)',
                  fontWeight: 'var(--cv-font-medium)',
                  color: 'var(--cv-color-text-primary)'
                }}
              >
                {category}
              </h3>
              <div 
                className="flex-1 h-px"
                style={{ backgroundColor: 'var(--cv-color-border)' }}
              />
            </div>
          )}
          {renderSkillsByLayout(skills)}
        </div>
      );
    });
  };

  return (
    <section 
      className={`cv-skills-section ${className}`}
      style={{
        marginBottom: 'var(--cv-space-xl)',
        ...style
      }}
    >
      {renderSectionHeader()}
      <div style={{ paddingLeft: showIcon ? 'var(--cv-space-lg)' : '0' }}>
        {layout === 'grouped' || groupByCategory ? (
          renderGroupedSkills()
        ) : (
          renderSkillsByLayout(data)
        )}
      </div>
    </section>
  );
};

export default SkillsRenderer;

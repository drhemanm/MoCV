// src/components/FlowStartScreen.tsx - Apple Design
import React, { useState } from 'react';
import { 
  Plus, ArrowRight, FileText, Target, MessageSquare, TrendingUp
} from 'lucide-react';
import { GameData } from '../types';

interface FlowStartScreenProps {
  gameData: GameData;
  onImproveCV: () => void;
  onCreateNew: () => void;
  onAnalyzeVsJob: () => void;
  onInterviewPrep: () => void;
  onMyCVs: () => void;
}

const FlowStartScreen: React.FC<FlowStartScreenProps> = ({
  gameData, // Keep interface compatible
  onImproveCV,
  onCreateNew,
  onAnalyzeVsJob,
  onInterviewPrep,
  onMyCVs
}) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-medium text-gray-900">
              MoCV
            </div>
            <button 
              onClick={onMyCVs}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              My CVs
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold text-gray-900 mb-6 leading-tight">
            Create your<br />professional story
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Build a CV that opens doors. Professional templates, 
            intelligent guidance, results that matter.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3 mb-12">
          <ActionCard
            title="Create new CV"
            description="Start with a professional template"
            icon={Plus}
            primary={true}
            onClick={onCreateNew}
            selected={selectedAction === 'create'}
            onSelect={() => setSelectedAction('create')}
          />
          
          <ActionCard
            title="Improve existing CV"
            description="Get professional feedback and suggestions"
            icon={TrendingUp}
            onClick={onImproveCV}
            selected={selectedAction === 'improve'}
            onSelect={() => setSelectedAction('improve')}
          />
          
          <ActionCard
            title="Job match analysis"
            description="See how your CV matches job requirements"
            icon={Target}
            onClick={onAnalyzeVsJob}
            selected={selectedAction === 'analyze'}
            onSelect={() => setSelectedAction('analyze')}
          />
          
          <ActionCard
            title="Interview preparation"
            description="Practice with role-specific questions"
            icon={MessageSquare}
            onClick={onInterviewPrep}
            selected={selectedAction === 'interview'}
            onSelect={() => setSelectedAction('interview')}
          />
        </div>

        {/* Secondary Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Used by professionals at leading companies worldwide
          </p>
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <span className="text-xs font-medium">GOOGLE</span>
            <span className="text-xs font-medium">MICROSOFT</span>
            <span className="text-xs font-medium">APPLE</span>
            <span className="text-xs font-medium">META</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
  onClick: () => void;
  selected: boolean;
  onSelect: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  primary = false,
  onClick,
  selected,
  onSelect
}) => {
  return (
    <button
      className={`
        w-full group text-left p-6 rounded-2xl border transition-all duration-200
        ${primary 
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
          : selected
            ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
        }
      `}
      onClick={onClick}
      onMouseEnter={onSelect}
      onMouseLeave={() => {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${primary 
              ? 'bg-white/20' 
              : 'bg-gray-100 group-hover:bg-gray-200'
            }
          `}>
            <Icon className={`
              w-5 h-5 
              ${primary ? 'text-white' : 'text-gray-600'}
            `} />
          </div>
          <div>
            <h3 className={`
              text-lg font-medium
              ${primary ? 'text-white' : 'text-gray-900'}
            `}>
              {title}
            </h3>
            <p className={`
              text-sm
              ${primary ? 'text-blue-100' : 'text-gray-500'}
            `}>
              {description}
            </p>
          </div>
        </div>
        <ArrowRight className={`
          w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity
          ${primary ? 'text-white' : 'text-gray-400'}
        `} />
      </div>
    </button>
  );
};

export default FlowStartScreen;

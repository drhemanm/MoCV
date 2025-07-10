import React, { useState } from 'react';
import { Globe, ArrowRight, Info, CheckCircle, Target, TrendingUp, FileText, Users } from 'lucide-react';
import { TargetMarket } from '../types';
import BackButton from './BackButton';

interface TargetMarketSelectorProps {
  onMarketSelect: (market: TargetMarket) => void;
  onBack: () => void;
  selectedFlow: 'analyze' | 'create' | 'job-match' | 'interview';
}

const TargetMarketSelector: React.FC<TargetMarketSelectorProps> = ({ onMarketSelect, onBack, selectedFlow }) => {
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket | null>(null);

  const targetMarkets: TargetMarket[] = [
    {
      id: 'mauritius',
      name: 'Mauritius',
      flag: '🇲🇺',
      region: 'Africa',
      cvTips: [
        'Include both English and French language proficiency',
        'Highlight multicultural communication skills',
        'Emphasize remote work capabilities for international markets',
        'Include relevant certifications from recognized institutions'
      ],
      atsPreferences: [
        'Standard chronological format preferred',
        'Clear section headers in English',
        'PDF format widely accepted',
        'Keep to 2 pages maximum'
      ],
      culturalNotes: [
        'Professional photo optional but common',
        'Include nationality/work permit status',
        'Mention language skills prominently',
        'Reference international experience if available'
      ],
      commonFormats: ['Chronological', 'Hybrid'],
      keywordFocus: ['Multilingual', 'Cross-cultural', 'Remote work', 'International']
    },
    {
      id: 'south-africa',
      name: 'South Africa',
      flag: '🇿🇦',
      region: 'Africa',
      cvTips: [
        'Include multiple language proficiencies',
        'Highlight transformation and diversity experience',
        'Emphasize problem-solving in resource-constrained environments',
        'Include relevant BEE credentials if applicable'
      ],
      atsPreferences: [
        'Chronological format standard',
        'Clear contact information',
        'Skills section prominent',
        '2-3 pages acceptable'
      ],
      culturalNotes: [
        'Include race and gender for BEE compliance',
        'Mention driver\'s license and own transport',
        'Reference community involvement',
        'Include all 11 official languages spoken'
      ],
      commonFormats: ['Chronological', 'Skills-based'],
      keywordFocus: ['Transformation', 'Diversity', 'Leadership', 'Innovation']
    },
    {
      id: 'united-states',
      name: 'United States',
      flag: '🇺🇸',
      region: 'North America',
      cvTips: [
        'Focus on quantifiable achievements and metrics',
        'Use action verbs and power words',
        'Tailor keywords to specific job descriptions',
        'Highlight leadership and initiative-taking'
      ],
      atsPreferences: [
        'ATS-friendly formatting crucial',
        'Standard fonts (Arial, Calibri)',
        'Reverse chronological order',
        'One page for entry-level, 2 pages for experienced'
      ],
      culturalNotes: [
        'No photo, age, or personal information',
        'Focus on professional achievements',
        'Include volunteer work and community service',
        'Emphasize results and ROI'
      ],
      commonFormats: ['Reverse Chronological', 'Combination'],
      keywordFocus: ['Results-driven', 'Leadership', 'Innovation', 'Efficiency']
    },
    {
      id: 'united-kingdom',
      name: 'United Kingdom',
      flag: '🇬🇧',
      region: 'Europe',
      cvTips: [
        'Include personal statement at the top',
        'Use British spelling and terminology',
        'Highlight education credentials prominently',
        'Include hobbies and interests section'
      ],
      atsPreferences: [
        'Chronological format preferred',
        'Clear section divisions',
        'Professional summary essential',
        '2 pages standard length'
      ],
      culturalNotes: [
        'Personal statement replaces objective',
        'Include nationality/visa status',
        'References available upon request',
        'Modest tone preferred over aggressive selling'
      ],
      commonFormats: ['Chronological', 'Skills-based'],
      keywordFocus: ['Collaborative', 'Analytical', 'Strategic', 'Professional']
    },
    {
      id: 'canada',
      name: 'Canada',
      flag: '🇨🇦',
      region: 'North America',
      cvTips: [
        'Include bilingual capabilities (English/French)',
        'Highlight diversity and inclusion experience',
        'Emphasize cold climate adaptability if relevant',
        'Include volunteer and community involvement'
      ],
      atsPreferences: [
        'Chronological format standard',
        'Clean, professional layout',
        'Skills summary at top',
        '1-2 pages preferred'
      ],
      culturalNotes: [
        'No photo or personal information',
        'Include work authorization status',
        'Mention Canadian education/experience',
        'Emphasize teamwork and collaboration'
      ],
      commonFormats: ['Chronological', 'Functional'],
      keywordFocus: ['Bilingual', 'Collaborative', 'Adaptable', 'Inclusive']
    },
    {
      id: 'australia',
      name: 'Australia',
      flag: '🇦🇺',
      region: 'Oceania',
      cvTips: [
        'Include work rights/visa status clearly',
        'Highlight outdoor and team activities',
        'Emphasize practical problem-solving skills',
        'Include travel and international experience'
      ],
      atsPreferences: [
        'Reverse chronological preferred',
        'Skills summary prominent',
        'Clear contact details',
        '2-3 pages acceptable'
      ],
      culturalNotes: [
        'Casual but professional tone',
        'Include hobbies and interests',
        'Mention referee availability',
        'Highlight work-life balance awareness'
      ],
      commonFormats: ['Reverse Chronological', 'Skills-based'],
      keywordFocus: ['Practical', 'Team-oriented', 'Adaptable', 'Results-focused']
    },
    {
      id: 'germany',
      name: 'Germany',
      flag: '🇩🇪',
      region: 'Europe',
      cvTips: [
        'Include detailed education history',
        'Professional photo is standard',
        'Highlight technical certifications',
        'Include language proficiency levels (A1-C2)'
      ],
      atsPreferences: [
        'Tabular CV format common',
        'Chronological order important',
        'Detailed personal information',
        '1-2 pages standard'
      ],
      culturalNotes: [
        'Include date of birth and marital status',
        'Professional photo required',
        'Detailed education section',
        'Formal, structured approach'
      ],
      commonFormats: ['Tabular', 'Chronological'],
      keywordFocus: ['Systematic', 'Technical', 'Qualified', 'Precise']
    },
    {
      id: 'singapore',
      name: 'Singapore',
      flag: '🇸🇬',
      region: 'Asia',
      cvTips: [
        'Include multiple language capabilities',
        'Highlight cross-cultural experience',
        'Emphasize efficiency and productivity',
        'Include relevant certifications and training'
      ],
      atsPreferences: [
        'Chronological format preferred',
        'Professional summary important',
        'Skills section prominent',
        '2 pages maximum'
      ],
      culturalNotes: [
        'Include nationality and work pass status',
        'Professional photo common',
        'Mention language proficiencies',
        'Highlight regional experience'
      ],
      commonFormats: ['Chronological', 'Hybrid'],
      keywordFocus: ['Multicultural', 'Efficient', 'Analytical', 'Regional']
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      region: 'Middle East',
      cvTips: [
        'Include visa status and availability',
        'Highlight international and multicultural experience',
        'Emphasize adaptability to diverse environments',
        'Include Arabic language skills if applicable'
      ],
      atsPreferences: [
        'Chronological format standard',
        'Professional photo expected',
        'Clear contact information',
        '2-3 pages acceptable'
      ],
      culturalNotes: [
        'Include nationality and visa status',
        'Professional photo required',
        'Mention salary expectations',
        'Highlight Middle East experience'
      ],
      commonFormats: ['Chronological', 'Skills-based'],
      keywordFocus: ['International', 'Multicultural', 'Adaptable', 'Professional']
    },
    {
      id: 'global',
      name: 'Global/International',
      flag: '🌍',
      region: 'Worldwide',
      cvTips: [
        'Focus on universal skills and achievements',
        'Highlight remote work capabilities',
        'Emphasize cross-cultural communication',
        'Include international certifications'
      ],
      atsPreferences: [
        'ATS-optimized formatting',
        'Standard international format',
        'Clear, simple layout',
        '1-2 pages preferred'
      ],
      culturalNotes: [
        'Avoid country-specific references',
        'Use international date formats',
        'Include time zone availability',
        'Highlight global experience'
      ],
      commonFormats: ['Reverse Chronological', 'Hybrid'],
      keywordFocus: ['Global', 'Remote', 'Cross-cultural', 'International']
    }
  ];

  const getFlowTitle = () => {
    switch (selectedFlow) {
      case 'analyze': return 'CV Analysis';
      case 'create': return 'CV Creation';
      case 'job-match': return 'Job Matching';
      case 'interview': return 'Interview Preparation';
      default: return 'CV Optimization';
    }
  };

  const getFlowDescription = () => {
    switch (selectedFlow) {
      case 'analyze': return 'Get region-specific analysis and improvement suggestions for your CV';
      case 'create': return 'Create a CV optimized for your target job market';
      case 'job-match': return 'Match your CV against job descriptions with market-specific insights';
      case 'interview': return 'Prepare for interviews with market-specific cultural awareness';
      default: return 'Optimize your CV for your target market';
    }
  };

  const handleContinue = () => {
    if (selectedMarket) {
      onMarketSelect(selectedMarket);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <BackButton onClick={onBack} label="Back" variant="floating" />
          </div>
          
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Globe className="h-4 w-4" />
            Target Market Selection
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Choose Your Target Market
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Select the country or region where you plan to apply for jobs. We'll optimize your {getFlowTitle().toLowerCase()} 
            with market-specific best practices, cultural preferences, and ATS requirements.
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {getFlowDescription()}
          </p>
        </div>

        {/* Market Selection Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetMarkets.map((market) => (
              <button
                key={market.id}
                onClick={() => setSelectedMarket(market)}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-200 transform hover:scale-105 text-left group ${
                  selectedMarket?.id === market.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-transparent hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{market.flag}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{market.name}</h3>
                    <p className="text-sm text-gray-500">{market.region}</p>
                  </div>
                  {selectedMarket?.id === market.id && (
                    <CheckCircle className="h-6 w-6 text-blue-600 ml-auto" />
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Key Focus Areas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {market.keywordFocus.slice(0, 3).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Common Formats:</h4>
                    <p className="text-xs text-gray-600">{market.commonFormats.join(', ')}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Market Details */}
        {selectedMarket && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{selectedMarket.flag}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMarket.name}</h2>
                  <p className="text-gray-600">Market-specific optimization for {getFlowTitle().toLowerCase()}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    CV Best Practices
                  </h3>
                  <ul className="space-y-2">
                    {selectedMarket.cvTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    ATS Preferences
                  </h3>
                  <ul className="space-y-2">
                    {selectedMarket.atsPreferences.map((pref, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <FileText className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        {pref}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    Cultural Notes
                  </h3>
                  <ul className="space-y-2">
                    {selectedMarket.culturalNotes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    Keyword Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMarket.keywordFocus.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedMarket}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
          >
            Continue with {selectedMarket?.name || 'Selected Market'}
            <ArrowRight className="h-5 w-5" />
          </button>
          
          {selectedMarket && (
            <p className="text-sm text-gray-500 mt-4">
              Your {getFlowTitle().toLowerCase()} will be optimized for {selectedMarket.name} job market standards
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetMarketSelector;
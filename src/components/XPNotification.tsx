import React, { useEffect, useState } from 'react';
import { Star, TrendingUp, Award, Zap, Trophy } from 'lucide-react';

interface XPNotificationProps {
  xpGain: number;
  reason: string;
  levelUp?: boolean;
  newLevel?: number;
  achievements?: string[];
  onClose: () => void;
}

const XPNotification: React.FC<XPNotificationProps> = ({
  xpGain,
  reason,
  levelUp,
  newLevel,
  achievements,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible && !isLeaving 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4 max-w-sm border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-300" />
            </div>
            <span className="font-semibold text-sm">XP Gained!</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {/* XP Amount */}
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-yellow-300 mb-1">
            +{xpGain} XP
          </div>
          <div className="text-sm text-white/90">{reason}</div>
        </div>

        {/* Level Up */}
        {levelUp && newLevel && (
          <div className="bg-white/10 rounded-lg p-3 mb-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-green-300" />
              <span className="font-semibold text-green-300">LEVEL UP!</span>
            </div>
            <div className="text-2xl font-bold">Level {newLevel}</div>
          </div>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-300" />
              <span className="font-semibold text-sm">New Achievement{achievements.length > 1 ? 's' : ''}!</span>
            </div>
            {achievements.map((achievement, index) => (
              <div key={index} className="text-sm text-yellow-200">
                🏆 {achievement}
              </div>
            ))}
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-300 to-green-300 rounded-full transition-all duration-1000"
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default XPNotification;
import React from 'react';
import { Trophy, Star, Zap, Target, Award, Crown, Sparkles } from 'lucide-react';
import { GameData, Badge } from '../types';

interface GameProgressProps {
  gameData: GameData;
  onBadgeClick?: (badge: Badge) => void;
}

const GameProgress: React.FC<GameProgressProps> = ({ gameData, onBadgeClick }) => {
  const getBadgeForLevel = (level: number): Badge => {
    if (level >= 10) return { level: 'Master', icon: '👑', color: 'text-purple-600 bg-purple-100', message: 'CV Master! You\'ve mastered the art of CV creation!' };
    if (level >= 7) return { level: 'Expert', icon: '🏆', color: 'text-yellow-600 bg-yellow-100', message: 'CV Expert! Your skills are impressive!' };
    if (level >= 5) return { level: 'Pro', icon: '⭐', color: 'text-blue-600 bg-blue-100', message: 'CV Pro! You\'re getting really good at this!' };
    if (level >= 3) return { level: 'Advanced', icon: '🚀', color: 'text-green-600 bg-green-100', message: 'Advanced user! Keep up the great work!' };
    if (level >= 1) return { level: 'Beginner', icon: '🌱', color: 'text-teal-600 bg-teal-100', message: 'Welcome to MoCV! You\'re on your way!' };
    return { level: 'Starter', icon: '✨', color: 'text-gray-600 bg-gray-100', message: 'Just getting started!' };
  };

  const getXPForNextLevel = (currentLevel: number): number => {
    return (currentLevel + 1) * 100;
  };

  const getXPProgress = (): number => {
    const currentLevelXP = gameData.currentLevel * 100;
    const nextLevelXP = getXPForNextLevel(gameData.currentLevel);
    const progressXP = gameData.totalXP - currentLevelXP;
    return Math.min((progressXP / (nextLevelXP - currentLevelXP)) * 100, 100);
  };

  const currentBadge = getBadgeForLevel(gameData.currentLevel);
  const nextLevelXP = getXPForNextLevel(gameData.currentLevel);
  const xpProgress = getXPProgress();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Your Progress
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{gameData.totalXP} XP</div>
          <div className="text-sm text-gray-500">Level {gameData.currentLevel}</div>
        </div>
      </div>

      {/* Current Badge */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl ${currentBadge.color} cursor-pointer transition-all hover:scale-105`}
             onClick={() => onBadgeClick?.(currentBadge)}>
          <span className="text-2xl">{currentBadge.icon}</span>
          <div>
            <div className="font-semibold">{currentBadge.level}</div>
            <div className="text-xs opacity-75">{currentBadge.message}</div>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to Level {gameData.currentLevel + 1}</span>
          <span>{Math.round(xpProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {nextLevelXP - gameData.totalXP} XP to next level
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-orange-600" />
          Recent Achievements
        </h4>
        <div className="space-y-2">
          {gameData.achievements.length > 0 ? (
            gameData.achievements.slice(-3).map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-700">{achievement}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Complete actions to earn achievements!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{gameData.uploadsCount}</div>
          <div className="text-xs text-gray-500">CVs Created</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{gameData.highestScore}%</div>
          <div className="text-xs text-gray-500">Best ATS Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{gameData.consecutiveDays}</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default GameProgress;
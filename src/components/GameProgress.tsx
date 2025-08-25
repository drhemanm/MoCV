import React from 'react';
import { Trophy, Star, Zap, Target, Award, Crown, Sparkles, TrendingUp } from 'lucide-react';
import { GameData, Badge } from '../types';
import gamificationService from '../services/gamificationService';

interface GameProgressProps {
  gameData: GameData;
  onBadgeClick?: (badge: Badge) => void;
}

const GameProgress: React.FC<GameProgressProps> = ({ gameData, onBadgeClick }) => {
  const currentBadge = gamificationService.getLevelBadge();
  const nextLevelXP = gamificationService.getXPForNextLevel();
  const xpProgress = gamificationService.getLevelProgress();
  const xpNeeded = nextLevelXP - gameData.totalXP;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
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
        <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl ${currentBadge.color} cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg animate-float`}
             onClick={() => onBadgeClick?.(currentBadge)}>
          <span className="text-2xl">{currentBadge.icon}</span>
          <div>
            <div className="font-semibold">{currentBadge.level}</div>
            <div className="text-xs opacity-75">{currentBadge.message}</div>
          </div>
        </div>
      </div>

      {/* Recent XP Gain */}
      {gameData.lastXPGain && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 animate-pulse">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Recent XP</span>
          </div>
          <div className="text-xs text-blue-700">
            +{gameData.lastXPGain.amount} XP - {gameData.lastXPGain.reason}
          </div>
        </div>
      )}

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to Level {gameData.currentLevel + 1}</span>
          <span>{Math.round(xpProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 animate-gradient"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.max(0, xpNeeded)} XP to next level
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
                <Trophy className="h-4 w-4 text-yellow-500" />
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
          <div className="text-lg font-bold text-blue-600">{gameData.totalCVsCreated || gameData.uploadsCount}</div>
          <div className="text-xs text-gray-500">CVs Created</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{gameData.highestScore || 0}%</div>
          <div className="text-xs text-gray-500">Best ATS Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{gameData.streakCount || gameData.consecutiveDays || 0}</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-sm font-bold text-green-600">{gameData.totalAnalyses || 0}</div>
          <div className="text-xs text-gray-500">Analyses</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-orange-600">{gameData.totalInterviews || 0}</div>
          <div className="text-xs text-gray-500">Interviews</div>
        </div>
      </div>
    </div>
  );
};

export default GameProgress;
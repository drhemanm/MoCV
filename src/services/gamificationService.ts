// Gamification Service - Handles XP, levels, achievements, and rewards
export interface XPGain {
  amount: number;
  reason: string;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GameData {
  totalXP: number;
  currentLevel: number;
  uploadsCount: number;
  achievements: string[];
  consecutiveDays: number;
  lastUploadDate: string;
  highestScore: number;
  streakCount: number;
  totalCVsCreated: number;
  totalAnalyses: number;
  totalInterviews: number;
  lastXPGain?: XPGain;
}

// XP Rewards for different actions
export const XP_REWARDS = {
  CV_UPLOAD: 25,
  CV_ANALYSIS: 50,
  CV_CREATION: 100,
  TEMPLATE_SELECTION: 15,
  PROFILE_COMPLETION: 30,
  INTERVIEW_PRACTICE: 75,
  JOB_MATCH_ANALYSIS: 60,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 20,
  HIGH_ATS_SCORE: 40, // For scores above 85
  FIRST_TIME_BONUS: 50,
  ACHIEVEMENT_UNLOCK: 25
};

// Level thresholds (exponential growth)
export const LEVEL_THRESHOLDS = [
  0,     // Level 0
  100,   // Level 1
  250,   // Level 2
  450,   // Level 3
  700,   // Level 4
  1000,  // Level 5
  1350,  // Level 6
  1750,  // Level 7
  2200,  // Level 8
  2700,  // Level 9
  3250,  // Level 10
  3850,  // Level 11
  4500,  // Level 12
  5200,  // Level 13
  5950,  // Level 14
  6750,  // Level 15
  7600,  // Level 16
  8500,  // Level 17
  9450,  // Level 18
  10450, // Level 19
  11500  // Level 20 (max)
];

// Available achievements
export const ACHIEVEMENTS: { [key: string]: Omit<Achievement, 'unlocked' | 'unlockedAt'> } = {
  FIRST_CV: {
    id: 'FIRST_CV',
    name: 'CV Creator',
    description: 'Created your first CV',
    icon: '🎯',
    xpReward: 50
  },
  ANALYZER: {
    id: 'ANALYZER',
    name: 'CV Analyzer',
    description: 'Analyzed your first CV',
    icon: '🔍',
    xpReward: 30
  },
  INTERVIEWER: {
    id: 'INTERVIEWER',
    name: 'Interview Ready',
    description: 'Completed your first mock interview',
    icon: '🎤',
    xpReward: 75
  },
  HIGH_SCORER: {
    id: 'HIGH_SCORER',
    name: 'ATS Master',
    description: 'Achieved an ATS score of 90+',
    icon: '🏆',
    xpReward: 100
  },
  STREAK_WARRIOR: {
    id: 'STREAK_WARRIOR',
    name: 'Streak Warrior',
    description: 'Used the platform for 7 consecutive days',
    icon: '🔥',
    xpReward: 150
  },
  CV_COLLECTOR: {
    id: 'CV_COLLECTOR',
    name: 'CV Collector',
    description: 'Created 5 different CVs',
    icon: '📚',
    xpReward: 200
  },
  PERFECTIONIST: {
    id: 'PERFECTIONIST',
    name: 'Perfectionist',
    description: 'Achieved a perfect 100 ATS score',
    icon: '💎',
    xpReward: 250
  },
  GLOBAL_CITIZEN: {
    id: 'GLOBAL_CITIZEN',
    name: 'Global Citizen',
    description: 'Created CVs for 3 different markets',
    icon: '🌍',
    xpReward: 150
  },
  MENTOR: {
    id: 'MENTOR',
    name: 'Career Mentor',
    description: 'Used all platform features',
    icon: '👨‍🏫',
    xpReward: 300
  }
};

class GamificationService {
  private static instance: GamificationService;
  private gameData: GameData;
  private listeners: ((data: GameData) => void)[] = [];

  private constructor() {
    this.gameData = this.loadGameData();
    this.checkDailyLogin();
  }

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // Subscribe to game data changes
  subscribe(callback: (data: GameData) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.gameData));
  }

  private loadGameData(): GameData {
    const saved = localStorage.getItem('mocv_game_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          totalXP: parsed.totalXP || 0,
          currentLevel: parsed.currentLevel || 0,
          uploadsCount: parsed.uploadsCount || 0,
          achievements: parsed.achievements || [],
          consecutiveDays: parsed.consecutiveDays || 0,
          lastUploadDate: parsed.lastUploadDate || new Date().toISOString(),
          highestScore: parsed.highestScore || 0,
          streakCount: parsed.streakCount || 0,
          totalCVsCreated: parsed.totalCVsCreated || 0,
          totalAnalyses: parsed.totalAnalyses || 0,
          totalInterviews: parsed.totalInterviews || 0,
          lastXPGain: parsed.lastXPGain ? {
            ...parsed.lastXPGain,
            timestamp: new Date(parsed.lastXPGain.timestamp)
          } : undefined
        };
      } catch (error) {
        console.error('Error loading game data:', error);
        return this.getDefaultGameData();
      }
    }
    return this.getDefaultGameData();
  }

  private getDefaultGameData(): GameData {
    return {
      totalXP: 0,
      currentLevel: 0,
      uploadsCount: 0,
      achievements: [],
      consecutiveDays: 0,
      lastUploadDate: new Date().toISOString(),
      highestScore: 0,
      streakCount: 0,
      totalCVsCreated: 0,
      totalAnalyses: 0,
      totalInterviews: 0
    };
  }

  private saveGameData() {
    localStorage.setItem('mocv_game_data', JSON.stringify(this.gameData));
    this.notifyListeners();
  }

  private checkDailyLogin() {
    const today = new Date().toDateString();
    const lastLogin = new Date(this.gameData.lastUploadDate).toDateString();
    
    if (today !== lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === yesterday.toDateString()) {
        // Consecutive day
        this.gameData.consecutiveDays += 1;
        this.gameData.streakCount += 1;
        this.awardXP(XP_REWARDS.DAILY_LOGIN + XP_REWARDS.STREAK_BONUS, 'Daily login streak bonus');
      } else {
        // Streak broken
        this.gameData.consecutiveDays = 1;
        this.gameData.streakCount = 0;
        this.awardXP(XP_REWARDS.DAILY_LOGIN, 'Daily login');
      }
      
      this.gameData.lastUploadDate = new Date().toISOString();
      this.saveGameData();
    }
  }

  // Calculate level from XP
  private calculateLevel(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        return i;
      }
    }
    return 0;
  }

  // Get XP needed for next level
  getXPForNextLevel(): number {
    const nextLevel = this.gameData.currentLevel + 1;
    if (nextLevel >= LEVEL_THRESHOLDS.length) {
      return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    }
    return LEVEL_THRESHOLDS[nextLevel];
  }

  // Get current level progress (0-100)
  getLevelProgress(): number {
    const currentLevelXP = LEVEL_THRESHOLDS[this.gameData.currentLevel] || 0;
    const nextLevelXP = this.getXPForNextLevel();
    const progressXP = this.gameData.totalXP - currentLevelXP;
    const totalNeeded = nextLevelXP - currentLevelXP;
    
    if (totalNeeded <= 0) return 100;
    return Math.min(100, Math.max(0, (progressXP / totalNeeded) * 100));
  }

  // Award XP and handle level ups
  awardXP(amount: number, reason: string): { levelUp: boolean; newLevel?: number; achievements?: string[] } {
    const oldLevel = this.gameData.currentLevel;
    this.gameData.totalXP += amount;
    this.gameData.currentLevel = this.calculateLevel(this.gameData.totalXP);
    
    this.gameData.lastXPGain = {
      amount,
      reason,
      timestamp: new Date()
    };

    const result: { levelUp: boolean; newLevel?: number; achievements?: string[] } = {
      levelUp: this.gameData.currentLevel > oldLevel
    };

    if (result.levelUp) {
      result.newLevel = this.gameData.currentLevel;
      // Award bonus XP for level up
      this.gameData.totalXP += 25;
    }

    // Check for new achievements
    const newAchievements = this.checkAchievements();
    if (newAchievements.length > 0) {
      result.achievements = newAchievements;
    }

    this.saveGameData();
    return result;
  }

  // Check and unlock achievements
  private checkAchievements(): string[] {
    const newAchievements: string[] = [];
    
    // First CV
    if (this.gameData.totalCVsCreated >= 1 && !this.gameData.achievements.includes('CV Creator')) {
      this.unlockAchievement('FIRST_CV');
      newAchievements.push('CV Creator');
    }

    // First Analysis
    if (this.gameData.totalAnalyses >= 1 && !this.gameData.achievements.includes('CV Analyzer')) {
      this.unlockAchievement('ANALYZER');
      newAchievements.push('CV Analyzer');
    }

    // First Interview
    if (this.gameData.totalInterviews >= 1 && !this.gameData.achievements.includes('Interview Ready')) {
      this.unlockAchievement('INTERVIEWER');
      newAchievements.push('Interview Ready');
    }

    // High ATS Score
    if (this.gameData.highestScore >= 90 && !this.gameData.achievements.includes('ATS Master')) {
      this.unlockAchievement('HIGH_SCORER');
      newAchievements.push('ATS Master');
    }

    // Perfect Score
    if (this.gameData.highestScore >= 100 && !this.gameData.achievements.includes('Perfectionist')) {
      this.unlockAchievement('PERFECTIONIST');
      newAchievements.push('Perfectionist');
    }

    // Streak Warrior
    if (this.gameData.consecutiveDays >= 7 && !this.gameData.achievements.includes('Streak Warrior')) {
      this.unlockAchievement('STREAK_WARRIOR');
      newAchievements.push('Streak Warrior');
    }

    // CV Collector
    if (this.gameData.totalCVsCreated >= 5 && !this.gameData.achievements.includes('CV Collector')) {
      this.unlockAchievement('CV_COLLECTOR');
      newAchievements.push('CV Collector');
    }

    return newAchievements;
  }

  private unlockAchievement(achievementId: string) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (achievement && !this.gameData.achievements.includes(achievement.name)) {
      this.gameData.achievements.push(achievement.name);
      this.gameData.totalXP += achievement.xpReward;
    }
  }

  // Public methods for tracking actions
  trackCVCreation() {
    this.gameData.totalCVsCreated += 1;
    this.gameData.uploadsCount += 1;
    
    const isFirst = this.gameData.totalCVsCreated === 1;
    const xpAmount = isFirst ? XP_REWARDS.CV_CREATION + XP_REWARDS.FIRST_TIME_BONUS : XP_REWARDS.CV_CREATION;
    const reason = isFirst ? 'First CV created! Welcome bonus!' : 'CV created';
    
    return this.awardXP(xpAmount, reason);
  }

  trackCVAnalysis(score?: number) {
    this.gameData.totalAnalyses += 1;
    
    if (score && score > this.gameData.highestScore) {
      this.gameData.highestScore = score;
    }
    
    let xpAmount = XP_REWARDS.CV_ANALYSIS;
    let reason = 'CV analyzed';
    
    if (score && score >= 85) {
      xpAmount += XP_REWARDS.HIGH_ATS_SCORE;
      reason += ' with high ATS score!';
    }
    
    const isFirst = this.gameData.totalAnalyses === 1;
    if (isFirst) {
      xpAmount += XP_REWARDS.FIRST_TIME_BONUS;
      reason = 'First CV analysis! ' + reason;
    }
    
    return this.awardXP(xpAmount, reason);
  }

  trackInterviewPractice() {
    this.gameData.totalInterviews += 1;
    
    const isFirst = this.gameData.totalInterviews === 1;
    const xpAmount = isFirst ? XP_REWARDS.INTERVIEW_PRACTICE + XP_REWARDS.FIRST_TIME_BONUS : XP_REWARDS.INTERVIEW_PRACTICE;
    const reason = isFirst ? 'First interview practice! Welcome bonus!' : 'Interview practice completed';
    
    return this.awardXP(xpAmount, reason);
  }

  trackTemplateSelection() {
    return this.awardXP(XP_REWARDS.TEMPLATE_SELECTION, 'Template selected');
  }

  trackJobMatchAnalysis() {
    return this.awardXP(XP_REWARDS.JOB_MATCH_ANALYSIS, 'Job match analysis completed');
  }

  trackProfileCompletion() {
    return this.awardXP(XP_REWARDS.PROFILE_COMPLETION, 'Profile section completed');
  }

  // Get current game data
  getGameData(): GameData {
    return { ...this.gameData };
  }

  // Reset game data (for testing)
  resetGameData() {
    this.gameData = this.getDefaultGameData();
    this.saveGameData();
  }

  // Get level badge info
  getLevelBadge() {
    const level = this.gameData.currentLevel;
    if (level >= 15) return { level: 'Grandmaster', icon: '👑', color: 'text-purple-600 bg-purple-100' };
    if (level >= 12) return { level: 'Master', icon: '🏆', color: 'text-yellow-600 bg-yellow-100' };
    if (level >= 9) return { level: 'Expert', icon: '⭐', color: 'text-blue-600 bg-blue-100' };
    if (level >= 6) return { level: 'Advanced', icon: '🚀', color: 'text-green-600 bg-green-100' };
    if (level >= 3) return { level: 'Intermediate', icon: '📈', color: 'text-orange-600 bg-orange-100' };
    if (level >= 1) return { level: 'Beginner', icon: '🌱', color: 'text-teal-600 bg-teal-100' };
    return { level: 'Starter', icon: '✨', color: 'text-gray-600 bg-gray-100' };
  }
}

export default GamificationService.getInstance();
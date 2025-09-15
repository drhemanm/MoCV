// src/services/gamificationService.ts
import { GameData, Achievement } from '../types';

interface XPResult {
  levelUp: boolean;
  newLevel?: number;
  achievements?: string[];
}

class GamificationService {
  private storageKey = 'mocv_game_data';
  private listeners: Set<(data: GameData) => void> = new Set();

  // XP thresholds for each level
  private levelThresholds = [
    0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000,
    13000, 16500, 20500, 25000, 30000, 35500, 41500, 48000, 55000, 62500
  ];

  // Achievement definitions
  private achievementDefinitions: Achievement[] = [
    {
      id: 'first_cv',
      name: 'CV Creator',
      description: 'Created your first CV',
      icon: '🎯',
      rarity: 'common',
      maxProgress: 1
    },
    {
      id: 'template_explorer',
      name: 'Template Explorer',
      description: 'Selected 5 different templates',
      icon: '🎨',
      rarity: 'common',
      maxProgress: 5
    },
    {
      id: 'ai_powered',
      name: 'AI Powered',
      description: 'Used AI assistant to generate content',
      icon: '🤖',
      rarity: 'common',
      maxProgress: 1
    },
    {
      id: 'analyzer_pro',
      name: 'Analyzer Pro',
      description: 'Analyzed 10 CVs',
      icon: '📊',
      rarity: 'rare',
      maxProgress: 10
    },
    {
      id: 'job_matcher',
      name: 'Job Matcher',
      description: 'Completed 5 job match analyses',
      icon: '🎯',
      rarity: 'rare',
      maxProgress: 5
    },
    {
      id: 'interview_ready',
      name: 'Interview Ready',
      description: 'Completed interview preparation',
      icon: '💼',
      rarity: 'rare',
      maxProgress: 1
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieved a CV score of 95+',
      icon: '⭐',
      rarity: 'epic',
      maxProgress: 1
    },
    {
      id: 'power_user',
      name: 'Power User',
      description: 'Created 20 CVs',
      icon: '🚀',
      rarity: 'epic',
      maxProgress: 20
    },
    {
      id: 'master_builder',
      name: 'Master Builder',
      description: 'Reached level 10',
      icon: '👑',
      rarity: 'legendary',
      maxProgress: 1
    },
    {
      id: 'cv_legend',
      name: 'CV Legend',
      description: 'Earned 10,000 XP',
      icon: '🏆',
      rarity: 'legendary',
      maxProgress: 1
    }
  ];

  constructor() {
    this.initializeGameData();
  }

  private initializeGameData(): void {
    const existing = this.getGameData();
    if (!existing.level) {
      const initialData: GameData = {
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        totalXP: 0,
        achievements: this.achievementDefinitions.map(def => ({
          ...def,
          progress: 0,
          unlockedAt: undefined
        })),
        streaks: {
          daily: 0,
          weekly: 0
        },
        stats: {
          cvsCreated: 0,
          templatesUsed: 0,
          analysisCompleted: 0,
          interviewsPrepped: 0
        }
      };
      this.saveGameData(initialData);
    }
  }

  getGameData(): GameData {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Merge with achievement definitions to handle new achievements
        const mergedAchievements = this.achievementDefinitions.map(def => {
          const existing = data.achievements?.find((a: Achievement) => a.id === def.id);
          return existing ? { ...def, ...existing } : { ...def, progress: 0 };
        });
        
        return {
          ...data,
          achievements: mergedAchievements
        };
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
    
    return {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalXP: 0,
      achievements: this.achievementDefinitions.map(def => ({ ...def, progress: 0 })),
      streaks: { daily: 0, weekly: 0 },
      stats: {
        cvsCreated: 0,
        templatesUsed: 0,
        analysisCompleted: 0,
        interviewsPrepped: 0
      }
    };
  }

  private saveGameData(data: GameData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.notifyListeners(data);
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  }

  subscribe(listener: (data: GameData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(data: GameData): void {
    this.listeners.forEach(listener => listener(data));
  }

  awardXP(xpGain: number): XPResult {
    const data = this.getGameData();
    const oldLevel = data.level;
    
    data.xp += xpGain;
    data.totalXP += xpGain;
    
    // Check for level up
    let newLevel = oldLevel;
    while (newLevel < this.levelThresholds.length - 1 && 
           data.totalXP >= this.levelThresholds[newLevel]) {
      newLevel++;
    }
    
    const levelUp = newLevel > oldLevel;
    if (levelUp) {
      data.level = newLevel;
      data.xp = data.totalXP - this.levelThresholds[newLevel - 1];
    }
    
    // Calculate XP to next level
    if (newLevel < this.levelThresholds.length - 1) {
      data.xpToNextLevel = this.levelThresholds[newLevel] - data.totalXP;
    } else {
      data.xpToNextLevel = 0; // Max level reached
    }
    
    this.saveGameData(data);
    
    return {
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      achievements: this.checkAchievements(data)
    };
  }

  private checkAchievements(data: GameData): string[] {
    const newAchievements: string[] = [];
    
    data.achievements.forEach(achievement => {
      if (achievement.unlockedAt) return; // Already unlocked
      
      let shouldUnlock = false;
      let progress = achievement.progress || 0;
      
      switch (achievement.id) {
        case 'first_cv':
          progress = data.stats.cvsCreated;
          shouldUnlock = data.stats.cvsCreated >= 1;
          break;
        case 'template_explorer':
          progress = data.stats.templatesUsed;
          shouldUnlock = data.stats.templatesUsed >= 5;
          break;
        case 'ai_powered':
          // This would be tracked separately when AI is used
          break;
        case 'analyzer_pro':
          progress = data.stats.analysisCompleted;
          shouldUnlock = data.stats.analysisCompleted >= 10;
          break;
        case 'job_matcher':
          // This would be tracked separately for job matches
          break;
        case 'interview_ready':
          progress = data.stats.interviewsPrepped;
          shouldUnlock = data.stats.interviewsPrepped >= 1;
          break;
        case 'perfectionist':
          // This would be tracked when a high score is achieved
          break;
        case 'power_user':
          progress = data.stats.cvsCreated;
          shouldUnlock = data.stats.cvsCreated >= 20;
          break;
        case 'master_builder':
          progress = data.level >= 10 ? 1 : 0;
          shouldUnlock = data.level >= 10;
          break;
        case 'cv_legend':
          progress = data.totalXP >= 10000 ? 1 : 0;
          shouldUnlock = data.totalXP >= 10000;
          break;
      }
      
      achievement.progress = progress;
      
      if (shouldUnlock) {
        achievement.unlockedAt = new Date();
        newAchievements.push(achievement.name);
      }
    });
    
    return newAchievements;
  }

  // Specific action tracking methods
  trackCVCreation(): XPResult {
    const data = this.getGameData();
    data.stats.cvsCreated++;
    this.saveGameData(data);
    return this.awardXP(100);
  }

  trackTemplateSelection(): XPResult {
    const data = this.getGameData();
    data.stats.templatesUsed++;
    this.saveGameData(data);
    return this.awardXP(15);
  }

  trackCVAnalysis(score: number): XPResult {
    const data = this.getGameData();
    data.stats.analysisCompleted++;
    this.saveGameData(data);
    
    // Bonus XP for high scores
    let xpGain = 50;
    if (score >= 95) {
      xpGain += 25; // Bonus for perfectionist score
      // Award perfectionist achievement
      const perfectionist = data.achievements.find(a => a.id === 'perfectionist');
      if (perfectionist && !perfectionist.unlockedAt) {
        perfectionist.unlockedAt = new Date();
        perfectionist.progress = 1;
      }
    } else if (score >= 85) {
      xpGain += 15;
    } else if (score >= 75) {
      xpGain += 10;
    }
    
    this.saveGameData(data);
    return this.awardXP(xpGain);
  }

  trackJobMatchAnalysis(): XPResult {
    const data = this.getGameData();
    
    // Track job matcher achievement
    const jobMatcher = data.achievements.find(a => a.id === 'job_matcher');
    if (jobMatcher) {
      jobMatcher.progress = (jobMatcher.progress || 0) + 1;
      if (jobMatcher.progress >= 5 && !jobMatcher.unlockedAt) {
        jobMatcher.unlockedAt = new Date();
      }
    }
    
    this.saveGameData(data);
    return this.awardXP(60);
  }

  trackProfileCompletion(): XPResult {
    const data = this.getGameData();
    
    // Track AI powered achievement
    const aiPowered = data.achievements.find(a => a.id === 'ai_powered');
    if (aiPowered && !aiPowered.unlockedAt) {
      aiPowered.unlockedAt = new Date();
      aiPowered.progress = 1;
    }
    
    this.saveGameData(data);
    return this.awardXP(30);
  }

  trackInterviewPrep(): XPResult {
    const data = this.getGameData();
    data.stats.interviewsPrepped++;
    this.saveGameData(data);
    return this.awardXP(40);
  }

  // Utility methods
  getAchievementProgress(achievementId: string): { current: number; max: number; unlocked: boolean } {
    const data = this.getGameData();
    const achievement = data.achievements.find(a => a.id === achievementId);
    
    if (!achievement) {
      return { current: 0, max: 1, unlocked: false };
    }
    
    return {
      current: achievement.progress || 0,
      max: achievement.maxProgress || 1,
      unlocked: !!achievement.unlockedAt
    };
  }

  getUnlockedAchievements(): Achievement[] {
    const data = this.getGameData();
    return data.achievements.filter(a => a.unlockedAt);
  }

  getLevelProgress(): { current: number; max: number; percentage: number } {
    const data = this.getGameData();
    const currentLevelXP = data.level > 1 ? this.levelThresholds[data.level - 1] : 0;
    const nextLevelXP = this.levelThresholds[data.level] || data.totalXP;
    const progressInLevel = data.totalXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    
    return {
      current: progressInLevel,
      max: xpNeededForLevel,
      percentage: (progressInLevel / xpNeededForLevel) * 100
    };
  }

  // Reset methods (for testing/development)
  resetGameData(): void {
    localStorage.removeItem(this.storageKey);
    this.initializeGameData();
  }

  exportGameData(): string {
    return JSON.stringify(this.getGameData(), null, 2);
  }

  importGameData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveGameData(data);
      return true;
    } catch (error) {
      console.error('Error importing game data:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const gamificationService = new GamificationService();
export default gamificationService;

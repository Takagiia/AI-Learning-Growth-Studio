package com.ailearning.backend.service;

import com.ailearning.backend.entity.Achievement;
import com.ailearning.backend.entity.User;
import com.ailearning.backend.exception.ApiException;
import com.ailearning.backend.repository.AchievementRepository;
import com.ailearning.backend.repository.NoteRepository;
import com.ailearning.backend.repository.ResourceRepository;
import com.ailearning.backend.repository.UserRepository;
import com.ailearning.backend.repository.WrongQuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AchievementService {
    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;
    private final NoteRepository noteRepository;
    private final ResourceRepository resourceRepository;
    private final WrongQuestionRepository wrongQuestionRepository;

    public AchievementService(AchievementRepository achievementRepository,
                              UserRepository userRepository,
                              NoteRepository noteRepository,
                              ResourceRepository resourceRepository,
                              WrongQuestionRepository wrongQuestionRepository) {
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
        this.noteRepository = noteRepository;
        this.resourceRepository = resourceRepository;
        this.wrongQuestionRepository = wrongQuestionRepository;
    }

    @Transactional
    public List<Achievement> list(Long userId) {
        return syncAchievements(userId);
    }

    @Transactional
    public Map<String, Object> stats(Long userId) {
        List<Achievement> list = syncAchievements(userId);
        User user = getUser(userId);
        long unlockedCount = list.stream().filter(Achievement::isUnlocked).count();
        int totalPoints = list.stream().filter(Achievement::isUnlocked).mapToInt(Achievement::getPoints).sum();

        List<Map<String, Object>> recentUnlocked = list.stream()
                .filter(Achievement::isUnlocked)
                .sorted(Comparator.comparing(Achievement::getUnlockedAt).reversed())
                .limit(5)
                .map(a -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", a.getId());
                    m.put("name", a.getTitle());
                    m.put("icon", a.getIcon());
                    m.put("points", a.getPoints());
                    m.put("unlockedAt", a.getUnlockedAt() != null ? a.getUnlockedAt().toString() : null);
                    return m;
                })
                .toList();

        Map<String, Object> data = new HashMap<>();
        data.put("total", list.size());
        data.put("unlocked", unlockedCount);
        data.put("totalPoints", totalPoints);
        data.put("unlockedCount", unlockedCount);
        data.put("streak", user.getStudyDays());
        data.put("longestStreak", user.getStudyDays());
        data.put("recentUnlocked", recentUnlocked);
        return data;
    }

    @Transactional
    public void unlock(Long userId, Long id) {
        Achievement a = achievementRepository.findById(id)
                .filter(ach -> ach.getUserId().equals(userId))
                .orElseThrow(() -> new ApiException(404, "成就不存�?));
        if (!a.isUnlocked()) {
            a.setUnlocked(true);
            a.setUnlockedAt(LocalDateTime.now());
            a.setProgress(a.getTarget());
            achievementRepository.save(a);
        }
    }

    @Transactional
    public void initAchievements(Long userId) {
        initAchievements(userId, false);
    }

    @Transactional
    public void initAchievements(Long userId, boolean reset) {
        List<Achievement> existing = achievementRepository.findByUserId(userId);
        if (!existing.isEmpty()) {
            if (!reset) {
                syncAchievements(userId, existing);
                return;
            }
            achievementRepository.deleteAll(existing);
        }
        achievementRepository.saveAll(buildAchievements(userId));
        syncAchievements(userId);
    }

    private Achievement createAchievement(Long userId, String title, String description, String icon, String category, String rarity, int points, int target, int progress) {
        Achievement a = new Achievement();
        a.setUserId(userId);
        a.setTitle(title);
        a.setDescription(description);
        a.setIcon(icon);
        a.setCategory(category);
        a.setRarity(rarity);
        a.setPoints(points);
        a.setTarget(target);
        a.setProgress(progress);
        a.setUnlocked(false);
        return a;
    }

    @Transactional
    public void updateProgress(Long userId, String category, int increment) {
        List<Achievement> list = syncAchievements(userId).stream()
                .filter(a -> !a.isUnlocked() && category.equals(a.getCategory()))
                .toList();

        for (Achievement a : list) {
            int newProgress = a.getProgress() + increment;
            a.setProgress(Math.min(newProgress, a.getTarget()));
            if (a.getProgress() >= a.getTarget()) {
                a.setUnlocked(true);
                a.setUnlockedAt(LocalDateTime.now());
            }
            achievementRepository.save(a);
        }
    }

    @Transactional
    public List<Achievement> syncAchievements(Long userId) {
        return syncAchievements(userId, achievementRepository.findByUserId(userId));
    }

    private List<Achievement> syncAchievements(Long userId, List<Achievement> achievements) {
        List<Achievement> current = achievements;
        if (current.isEmpty()) {
            current = achievementRepository.saveAll(buildAchievements(userId));
        }

        User user = getUser(userId);
        int studyCount = Math.max(user.getStudyDays(), 0);
        int noteCount = noteRepository.findByUserIdOrderByUpdatedAtDesc(userId).size();
        int wrongQuestionCount = wrongQuestionRepository.findByUserIdOrderByUpdatedAtDesc(userId).size();
        int resourceCount = resourceRepository.findByUserIdOrderByCreatedAtDesc(userId).size();

        Map<String, Integer> progressMap = new HashMap<>();
        progressMap.put("学习新手", Math.min(studyCount, 1));
        progressMap.put("知识探索�?, Math.min(studyCount, 3));
        progressMap.put("笔记达人", noteCount);
        progressMap.put("错题收集�?, wrongQuestionCount);
        progressMap.put("持续学习", Math.min(studyCount, 7));
        progressMap.put("资源大师", resourceCount);
        progressMap.put("学习狂人", studyCount);

        boolean changed = false;
        for (Achievement achievement : current) {
            Integer actualProgress = progressMap.get(achievement.getTitle());
            if (actualProgress == null) {
                continue;
            }

            int nextProgress = Math.min(actualProgress, achievement.getTarget());
            if (achievement.getProgress() != nextProgress) {
                achievement.setProgress(nextProgress);
                changed = true;
            }

            boolean shouldUnlock = nextProgress >= achievement.getTarget();
            if (achievement.isUnlocked() != shouldUnlock) {
                achievement.setUnlocked(shouldUnlock);
                achievement.setUnlockedAt(shouldUnlock ? LocalDateTime.now() : null);
                changed = true;
            } else if (!shouldUnlock && achievement.getUnlockedAt() != null) {
                achievement.setUnlockedAt(null);
                changed = true;
            }
        }

        long unlockedWithoutLegend = current.stream()
                .filter(achievement -> !"传奇学�?.equals(achievement.getTitle()))
                .filter(Achievement::isUnlocked)
                .count();
        for (Achievement achievement : current) {
            if (!"传奇学�?.equals(achievement.getTitle())) {
                continue;
            }

            int nextProgress = (int) Math.min(unlockedWithoutLegend, achievement.getTarget());
            if (achievement.getProgress() != nextProgress) {
                achievement.setProgress(nextProgress);
                changed = true;
            }

            boolean shouldUnlock = unlockedWithoutLegend >= current.size() - 1;
            if (achievement.isUnlocked() != shouldUnlock) {
                achievement.setUnlocked(shouldUnlock);
                achievement.setUnlockedAt(shouldUnlock ? LocalDateTime.now() : null);
                changed = true;
            } else if (!shouldUnlock && achievement.getUnlockedAt() != null) {
                achievement.setUnlockedAt(null);
                changed = true;
            }
            break;
        }

        if (changed) {
            return achievementRepository.saveAll(current);
        }
        return current;
    }

    private List<Achievement> buildAchievements(Long userId) {
        return Arrays.asList(
                createAchievement(userId, "学习新手", "完成第一次学�?, "CircleCheck", "成长", "common", 10, 1, 0),
                createAchievement(userId, "知识探索�?, "完成3次学�?, "List", "学习", "uncommon", 20, 3, 0),
                createAchievement(userId, "笔记达人", "创建5条笔�?, "Document", "创作", "uncommon", 25, 5, 0),
                createAchievement(userId, "错题收集�?, "添加10道错�?, "Warning", "学习", "rare", 30, 10, 0),
                createAchievement(userId, "持续学习", "连续7天学�?, "Timer", "坚持", "epic", 50, 7, 0),
                createAchievement(userId, "资源大师", "上传20个资�?, "Folder", "任务", "rare", 35, 20, 0),
                createAchievement(userId, "学习狂人", "完成50次学�?, "Timer", "学习", "epic", 60, 50, 0),
                createAchievement(userId, "传奇学�?, "解锁所有成�?, "Trophy", "特殊", "legendary", 100, 7, 0)
        );
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(404, "用户不存�?));
    }
}

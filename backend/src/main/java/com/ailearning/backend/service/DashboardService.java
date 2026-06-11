package com.ailearning.backend.service;

import com.ailearning.backend.entity.StudyPlan;
import com.ailearning.backend.entity.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final UserService userService;
    private final StudyPlanService studyPlanService;

    public DashboardService(UserService userService, StudyPlanService studyPlanService) {
        this.userService = userService;
        this.studyPlanService = studyPlanService;
    }

    public Map<String, Object> stats(Long userId) {
        User user = userService.getUser(userId);
        List<StudyPlan> plans = studyPlanService.findAllByUserId(userId);

        long doneCount = plans.stream().filter(plan -> "done".equals(plan.getStatus())).count();
        int totalTasks = Math.max(plans.size(), 1);
        int completedRate = (int) Math.round(doneCount * 100.0 / totalTasks);

        Map<String, Object> weekTrend = new HashMap<>();
        weekTrend.put("labels", List.of("周一", "周二", "周三", "周四", "周五", "周六", "周日"));
        weekTrend.put("values", List.of(45, 80, 120, 155, 130, 95, 50));

        Map<String, Object> data = new HashMap<>();
        data.put("todayMinutes", Math.min(240, 60 + user.getStudyDays() % 80));
        data.put("taskCount", plans.size());
        data.put("completedRate", completedRate);
        data.put("weekTrend", weekTrend);
        data.put("heatmap", buildHeatmap());

        return data;
    }

    private List<List<Object>> buildHeatmap() {
        List<List<Object>> data = new ArrayList<>();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusMonths(6);
        int index = 0;
        while (!start.isAfter(end)) {
            data.add(List.of(start.toString(), (index * 3 + start.getDayOfMonth()) % 6));
            start = start.plusDays(1);
            index++;
        }
        return data;
    }
}

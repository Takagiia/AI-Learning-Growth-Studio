package com.ailearning.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDemoData() {
        return args -> {
            // 简化的数据初始化，避免编码问题
            System.out.println("Application started successfully!");
        };
    }
}

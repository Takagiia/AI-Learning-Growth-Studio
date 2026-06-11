# Database Setup Guide

## Overview

This guide will help you set up the database for the AI Learning Platform.

## Prerequisites

- MySQL 5.7+ or MySQL 8.0+ installed
- MySQL service running
- A MySQL user with sufficient privileges (e.g., root)

## Database Configuration

### Default Configuration

The application uses the following default database configuration (in `application.yml`):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ai_learning?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&createDatabaseIfNotExist=true
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### Custom Configuration

If you need to change the database credentials, modify the `application.yml` file:

1. Open `src/main/resources/application.yml`
2. Update the datasource section with your actual database credentials

## Database Setup Options

### Option 1: Automatic Setup (Recommended)

The application will automatically create and initialize the database on startup if:
- You have MySQL running locally
- The credentials in `application.yml` are correct
- The SQL files are in place (`schema.sql` and `data.sql`)

The application is already configured to automatically run the SQL scripts on startup.

### Option 2: Manual Setup

If you prefer to set up the database manually:

1. **Connect to MySQL**
   ```bash
   mysql -u root -p
   ```

2. **Create the database** (if not exists)
   ```sql
   CREATE DATABASE IF NOT EXISTS ai_learning
   DEFAULT CHARACTER SET utf8mb4
   DEFAULT COLLATE utf8mb4_unicode_ci;
   ```

3. **Use the database**
   ```sql
   USE ai_learning;
   ```

4. **Execute the schema script**
   ```bash
   mysql -u root -p ai_learning < src/main/resources/schema.sql
   ```

5. **(Optional) Execute the data script**
   ```bash
   mysql -u root -p ai_learning < src/main/resources/data.sql
   ```

## Database Schema

The database includes the following tables:

| Table Name | Description |
|------------|-------------|
| `users` | User account information |
| `course` | Course information |
| `course_chapter` | Course chapters |
| `course_knowledge_point` | Knowledge points for each course |
| `study_plan` | Study plans created by users |
| `resources` | Learning resources uploaded by users |
| `notes` | User notes |
| `achievements` | User achievements |
| `wrong_questions` | Wrong questions for practice |

## Default Credentials

A demo user is automatically created with these credentials:

- **Username**: `admin`
- **Password**: `123456`

## Troubleshooting

### Connection Issues
- Verify MySQL is running: `services.msc` (Windows) or `systemctl status mysql` (Linux)
- Check if the port 3306 is open and not blocked by firewall
- Verify the credentials in `application.yml`

### Character Encoding Issues
The database is created with `utf8mb4` character set to support all Unicode characters including emojis.

### JPA DDL Auto Settings
The configuration is set to `validate` to ensure the schema matches the entity definitions. If you want JPA to create tables automatically:
- Change `ddl-auto: validate` to `ddl-auto: update` or `ddl-auto: create`

## Backup and Restore

### Backup
```bash
mysqldump -u root -p ai_learning > backup.sql
```

### Restore
```bash
mysql -u root -p ai_learning < backup.sql
```

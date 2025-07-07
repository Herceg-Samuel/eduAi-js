class EduAI {
  constructor() {
    this.students = new Map();
    this.sessions = new Map();
    this.notifications = [];
    this.aiModels = {
      engagementPredictor: this.initializeEngagementModel(),
      scheduleOptimizer: this.initializeScheduleModel(),
    };
    this.systemMetrics = {
      totalNotifications: 0,
      engagementScore: 0,
      schedulingConflicts: 0,
    };
  }

  initializeEngagementModel() {
    // Simple AI model weights for engagement prediction
    return {
      attendanceWeight: 0.4,
      notificationResponseWeight: 0.3,
      conflictHistoryWeight: 0.2,
      timePreferenceWeight: 0.1,
    };
  }

  initializeScheduleModel() {
    return {
      timeSlotWeights: new Map([
        ["morning", 0.8],
        ["afternoon", 0.6],
        ["evening", 0.4],
      ]),
    };
  }

  // Main scheduling management function with nested subprograms
  manageSchedule(studentId, courseId, preferences = {}) {
    // Outer scope variables accessible to nested functions
    const studentData =
      this.students.get(studentId) || this.createStudent(studentId);
    const systemConfig = {
      maxConflicts: 3,
      notificationDelay: 15,
      engagementThreshold: 0.7,
    };
    let schedulingAttempts = 0;
    const sessionHistory = studentData.sessionHistory || [];

    console.log(
      `Managing schedule for student ${studentId} in course ${courseId}`
    );

    // Nested function 1: Session allocation
    const allocateSession = (timeSlot, duration) => {
      // Access outer scope variables
      const conflictData = {
        existingConflicts: studentData.conflicts || [],
        preferredTimes: preferences.timeSlots || ["morning", "afternoon"],
        maxDuration: preferences.maxDuration || 120,
      };

      schedulingAttempts++;
      console.log(`  Allocation attempt ${schedulingAttempts} for ${timeSlot}`);

      // Check for conflicts using outer scope data
      const hasConflict = conflictData.existingConflicts.some(
        (conflict) => conflict.timeSlot === timeSlot && conflict.active
      );

      if (hasConflict) {
        this.systemMetrics.schedulingConflicts++;
        return null;
      }

      // Create session using outer scope variables
      const sessionId = `${studentId}_${courseId}_${Date.now()}`;
      const session = {
        id: sessionId,
        studentId: studentId,
        courseId: courseId,
        timeSlot: timeSlot,
        duration: duration,
        timestamp: new Date(),
        conflicts: conflictData.existingConflicts.length,
      };

      this.sessions.set(sessionId, session);
      console.log(`  Session allocated: ${sessionId} at ${timeSlot}`);
      return session;
    };

    // Nested function 2: Update notifications with deeply nested AI module
    const sendUpdate = (session, updateType = "scheduled") => {
      // Access outer scope variables
      const notificationPreferences = studentData.notificationPreferences || {
        email: true,
        sms: false,
        push: true,
        frequency: "immediate",
      };

      const attendancePatterns = studentData.attendanceHistory || [];
      const engagementHistory = studentData.engagementMetrics || {
        averageScore: 0.5,
        lastUpdate: new Date(),
        trendDirection: "stable",
      };

      console.log(`  Sending ${updateType} update for session ${session.id}`);

      // Deeply nested AI module for engagement prediction
      const predictEngagement = (analysisMode = "comprehensive") => {
        // Access variables from multiple outer scopes
        const aiModel = this.aiModels.engagementPredictor;
        const currentSession = session;
        const studentHistory = sessionHistory;
        const systemSettings = systemConfig;

        console.log(`    AI Analysis Mode: ${analysisMode}`);
        console.log(
          `    Analyzing ${attendancePatterns.length} attendance records`
        );

        // Nested analysis functions within AI module
        const analyzeAttendancePattern = () => {
          if (attendancePatterns.length === 0) return 0.5;

          const recentAttendance = attendancePatterns.slice(-10);
          const attendanceRate =
            recentAttendance.filter((a) => a.attended).length /
            recentAttendance.length;

          console.log(
            `      Attendance rate: ${(attendanceRate * 100).toFixed(1)}%`
          );
          return attendanceRate;
        };

        const analyzeNotificationResponse = () => {
          const notificationHistory = studentData.notificationHistory || [];
          if (notificationHistory.length === 0) return 0.5;

          const responseRate =
            notificationHistory.filter((n) => n.responded).length /
            notificationHistory.length;
          console.log(
            `      Notification response rate: ${(responseRate * 100).toFixed(
              1
            )}%`
          );
          return responseRate;
        };

        const analyzeConflictHistory = () => {
          const conflictScore = Math.max(
            0,
            1 -
              (studentData.conflicts?.length || 0) / systemSettings.maxConflicts
          );
          console.log(`      Conflict score: ${conflictScore.toFixed(2)}`);
          return conflictScore;
        };

        const analyzeTimePreference = () => {
          const preferredTime = preferences.timeSlots?.[0] || "morning";
          const timeMatch = currentSession.timeSlot === preferredTime ? 1 : 0.5;
          console.log(`      Time preference match: ${timeMatch}`);
          return timeMatch;
        };

        // Calculate weighted engagement score using nested analysis
        const attendanceScore = analyzeAttendancePattern();
        const notificationScore = analyzeNotificationResponse();
        const conflictScore = analyzeConflictHistory();
        const timeScore = analyzeTimePreference();

        const engagementScore =
          attendanceScore * aiModel.attendanceWeight +
          notificationScore * aiModel.notificationResponseWeight +
          conflictScore * aiModel.conflictHistoryWeight +
          timeScore * aiModel.timePreferenceWeight;

        console.log(
          `    Calculated engagement score: ${engagementScore.toFixed(3)}`
        );

        // Dynamic strategy adjustment based on engagement prediction
        const adjustEngagementStrategy = () => {
          const strategies = {
            high: { frequency: "low", personalization: "minimal" },
            medium: { frequency: "medium", personalization: "moderate" },
            low: { frequency: "high", personalization: "maximum" },
          };

          let strategyLevel;
          if (engagementScore > 0.7) strategyLevel = "high";
          else if (engagementScore > 0.4) strategyLevel = "medium";
          else strategyLevel = "low";

          console.log(`    Engagement strategy: ${strategyLevel}`);
          return strategies[strategyLevel];
        };

        const strategy = adjustEngagementStrategy();

        // Update system metrics using outer scope
        this.systemMetrics.engagementScore = engagementScore;

        return {
          score: engagementScore,
          strategy: strategy,
          analysisMode: analysisMode,
          factors: {
            attendance: attendanceScore,
            notifications: notificationScore,
            conflicts: conflictScore,
            timePreference: timeScore,
          },
        };
      };

      // Execute AI prediction and create notification
      const aiPrediction = predictEngagement("comprehensive");

      const notification = {
        id: `notif_${Date.now()}`,
        studentId: studentId,
        sessionId: session.id,
        type: updateType,
        message: this.generateNotificationMessage(session, aiPrediction),
        preferences: notificationPreferences,
        aiPrediction: aiPrediction,
        timestamp: new Date(),
        sent: false,
      };

      this.notifications.push(notification);
      this.systemMetrics.totalNotifications++;

      // Send notification based on preferences and AI recommendation
      if (this.shouldSendNotification(aiPrediction, notificationPreferences)) {
        this.deliverNotification(notification);
        console.log(`  Notification sent: ${notification.id}`);
      } else {
        console.log(`  Notification queued: ${notification.id}`);
      }

      return notification;
    };

    // Main scheduling logic using nested functions
    const requestedTimeSlot = preferences.preferredTime || "morning";
    const sessionDuration = preferences.duration || 60;

    console.log(
      `Attempting to schedule ${sessionDuration}min session at ${requestedTimeSlot}`
    );

    // Try to allocate session
    let session = allocateSession(requestedTimeSlot, sessionDuration);

    // If failed, try alternative time slots
    if (!session && schedulingAttempts < systemConfig.maxConflicts) {
      const alternativeSlots = ["morning", "afternoon", "evening"].filter(
        (slot) => slot !== requestedTimeSlot
      );

      for (const altSlot of alternativeSlots) {
        session = allocateSession(altSlot, sessionDuration);
        if (session) break;
      }
    }

    if (session) {
      // Update student data with new session
      studentData.sessionHistory.push(session);
      this.students.set(studentId, studentData);

      // Send notification using nested function with AI
      const notification = sendUpdate(session, "scheduled");

      console.log(`Schedule management completed for student ${studentId}`);
      return {
        success: true,
        session: session,
        notification: notification,
        attempts: schedulingAttempts,
      };
    } else {
      console.log(`Failed to schedule session for student ${studentId}`);
      return {
        success: false,
        error: "No available time slots",
        attempts: schedulingAttempts,
      };
    }
  }

  // Helper methods
  createStudent(studentId) {
    const student = {
      id: studentId,
      sessionHistory: [],
      attendanceHistory: [],
      notificationHistory: [],
      conflicts: [],
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        frequency: "immediate",
      },
      engagementMetrics: {
        averageScore: 0.5,
        lastUpdate: new Date(),
        trendDirection: "stable",
      },
    };
    this.students.set(studentId, student);
    return student;
  }

  generateNotificationMessage(session, aiPrediction) {
    const baseMessage = `Your session for ${session.courseId} is scheduled for ${session.timeSlot}`;
    const engagementLevel =
      aiPrediction.score > 0.7
        ? "high"
        : aiPrediction.score > 0.4
        ? "medium"
        : "low";

    const personalizedTips = {
      high: "Keep up the great work!",
      medium: "Don't forget to prepare your materials in advance.",
      low: "We've customized this session based on your preferences. Need help with preparation?",
    };

    return `${baseMessage}. ${personalizedTips[engagementLevel]}`;
  }

  shouldSendNotification(aiPrediction, preferences) {
    if (!preferences.email && !preferences.sms && !preferences.push)
      return false;

    // Send immediately for low engagement students
    if (aiPrediction.score < 0.4) return true;

    // Respect frequency preferences for others
    return (
      preferences.frequency === "immediate" ||
      (preferences.frequency === "medium" && aiPrediction.score < 0.7)
    );
  }

  deliverNotification(notification) {
    notification.sent = true;
    notification.deliveredAt = new Date();

    // Update student notification history
    const student = this.students.get(notification.studentId);
    if (student) {
      student.notificationHistory.push({
        id: notification.id,
        timestamp: notification.timestamp,
        responded: Math.random() > 0.3, // Simulate response
      });
    }
  }

  // Analytics and reporting methods
  getSystemAnalytics() {
    return {
      totalStudents: this.students.size,
      totalSessions: this.sessions.size,
      totalNotifications: this.notifications.length,
      averageEngagement: this.systemMetrics.engagementScore,
      conflictRate: this.systemMetrics.schedulingConflicts / this.sessions.size,
      notificationDeliveryRate:
        this.notifications.filter((n) => n.sent).length /
        this.notifications.length,
    };
  }

  getStudentAnalytics(studentId) {
    const student = this.students.get(studentId);
    if (!student) return null;

    return {
      studentId: studentId,
      totalSessions: student.sessionHistory.length,
      attendanceRate:
        student.attendanceHistory.length > 0
          ? student.attendanceHistory.filter((a) => a.attended).length /
            student.attendanceHistory.length
          : 0,
      notificationResponseRate:
        student.notificationHistory.length > 0
          ? student.notificationHistory.filter((n) => n.responded).length /
            student.notificationHistory.length
          : 0,
      currentEngagement: student.engagementMetrics.averageScore,
      conflictCount: student.conflicts.length,
    };
  }

  // Demonstration method
  demonstrateSystem() {
    console.log("EduAI Student Support System Demo \n");

    // Create sample students with different profiles
    const students = [
      { id: "student_001", profile: "high_engagement" },
      { id: "student_002", profile: "medium_engagement" },
      { id: "student_003", profile: "low_engagement" },
    ];

    students.forEach(({ id, profile }) => {
      console.log(`\nProcessing ${id} (${profile}) `);

      // Create student with simulated history
      const student = this.createStudent(id);

      // Simulate different engagement patterns
      switch (profile) {
        case "high_engagement":
          student.attendanceHistory = Array(10)
            .fill()
            .map((_, i) => ({ attended: i < 8 }));
          student.notificationHistory = Array(5)
            .fill()
            .map((_, i) => ({ responded: i < 4 }));
          break;
        case "medium_engagement":
          student.attendanceHistory = Array(10)
            .fill()
            .map((_, i) => ({ attended: i < 6 }));
          student.notificationHistory = Array(5)
            .fill()
            .map((_, i) => ({ responded: i < 3 }));
          break;
        case "low_engagement":
          student.attendanceHistory = Array(10)
            .fill()
            .map((_, i) => ({ attended: i < 3 }));
          student.notificationHistory = Array(5)
            .fill()
            .map((_, i) => ({ responded: i < 1 }));
          student.conflicts = [{ timeSlot: "morning", active: true }];
          break;
      }

      // Schedule session with nested function execution
      const result = this.manageSchedule(id, "COMP_SCI_101", {
        preferredTime: "morning",
        duration: 90,
        timeSlots: ["morning", "afternoon"],
      });

      console.log(`Result: ${result.success ? "SUCCESS" : "FAILED"}`);
      if (result.success) {
        console.log(`  Session: ${result.session.id}`);
        console.log(`  Notification: ${result.notification.id}`);
        console.log(
          `  AI Engagement Score: ${result.notification.aiPrediction.score.toFixed(
            3
          )}`
        );
      }
    });

    // Display system analytics
    console.log("\nSystem Analytics.");
    const analytics = this.getSystemAnalytics();
    Object.entries(analytics).forEach(([key, value]) => {
      console.log(
        `${key}: ${typeof value === "number" ? value.toFixed(3) : value}`
      );
    });

    return analytics;
  }
}

// Initialize and run the EduAI system
const eduAI = new EduAI();
eduAI.demonstrateSystem();

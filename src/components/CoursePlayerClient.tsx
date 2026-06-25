"use client";

import React, { useState, useEffect } from "react";
import { Play, Check, ChevronRight, BookOpen, CheckSquare, Square, Award, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
}

interface CoursePlayerClientProps {
  course: Course;
  lessons: Lesson[];
  initialProgress: number;
  userId: string;
}

export default function CoursePlayerClient({
  course,
  lessons,
  initialProgress,
  userId,
}: CoursePlayerClientProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0] || null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Load local completion state per user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = `codemaster_completed_${userId}_${course.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setCompletedLessonIds(JSON.parse(saved));
      } else {
        // Fallback: estimate from database progress
        const countToComplete = Math.round((initialProgress / 100) * lessons.length);
        const autoCompleted = lessons.slice(0, countToComplete).map((l) => l.id);
        setCompletedLessonIds(autoCompleted);
        localStorage.setItem(key, JSON.stringify(autoCompleted));
      }
    }
  }, [course.id, userId, lessons, initialProgress]);

  const toggleLessonComplete = async (lessonId: string) => {
    setSyncing(true);
    let updated: string[];

    if (completedLessonIds.includes(lessonId)) {
      updated = completedLessonIds.filter((id) => id !== lessonId);
    } else {
      updated = [...completedLessonIds, lessonId];
    }

    setCompletedLessonIds(updated);
    
    // Save to localStorage
    const key = `codemaster_completed_${userId}_${course.id}`;
    localStorage.setItem(key, JSON.stringify(updated));

    // Calculate percentage and sync with DB
    const newProgress = Math.round((updated.length / lessons.length) * 100);
    try {
      await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, progress: newProgress }),
      });
    } catch (error) {
      console.error("Failed to sync progress", error);
    } finally {
      setSyncing(false);
    }
  };

  const currentProgress = Math.round((completedLessonIds.length / lessons.length) * 100);

  return (
    <div className="player-grid">
      {/* Left Column: Video & Lesson content */}
      <div>
        {activeLesson ? (
          <div>
            {/* Embedded video */}
            <div className="video-container">
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title & Complete Checkbox */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border)"
            }}>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--accent-blue)", fontWeight: 600 }}>
                  Lesson {activeLesson.order} of {lessons.length}
                </span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "4px", color: "#fff" }}>
                  {activeLesson.title}
                </h2>
              </div>

              <button
                onClick={() => toggleLessonComplete(activeLesson.id)}
                className={`btn ${completedLessonIds.includes(activeLesson.id) ? "btn-green" : "btn-secondary"}`}
                style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "180px", justifyContent: "center" }}
                disabled={syncing}
              >
                {syncing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : completedLessonIds.includes(activeLesson.id) ? (
                  <>
                    <CheckSquare size={16} />
                    Completed
                  </>
                ) : (
                  <>
                    <Square size={16} />
                    Mark Completed
                  </>
                )}
              </button>
            </div>

            {/* Written Markdown Contents */}
            <div className="lesson-details-card markdown-body">
              <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="card-glass" style={{ padding: "80px", textAlign: "center" }}>
            <BookOpen size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
            <h3>No lessons found in this course.</h3>
          </div>
        )}
      </div>

      {/* Right Column: Playlist */}
      <div className="playlist-sidebar">
        <div className="playlist-header">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Course Lessons</h3>
          <div style={{ display: "flex", justifySelf: "space-between", alignItems: "center", marginTop: "8px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {completedLessonIds.length} / {lessons.length} completed
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-purple)" }}>
              {currentProgress}%
            </span>
          </div>
          <div className="progress-container" style={{ margin: "10px 0 0 0" }}>
            <div className="progress-bar" style={{ width: `${currentProgress}%` }} />
          </div>
        </div>

        <div className="playlist-scroll">
          {lessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isActive = activeLesson?.id === lesson.id;
            return (
              <div
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`playlist-item ${isActive ? "active" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                  <div style={{
                    color: isActive ? "var(--accent-purple)" : isCompleted ? "var(--accent-green)" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    {isCompleted ? <Check size={16} /> : <Play size={14} />}
                  </div>
                  <span style={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#fff" : "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden"
                  }}>
                    {lesson.title}
                  </span>
                </div>
                <ChevronRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>

        {/* Certificate banner */}
        {currentProgress === 100 && (
          <div style={{
            background: "rgba(16, 185, 129, 0.08)",
            borderTop: "1px solid rgba(16, 185, 129, 0.2)",
            padding: "16px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px"
          }}>
            <Award size={20} style={{ color: "var(--accent-green)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
              Course Completed!
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Certificate generated in your simulator database.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

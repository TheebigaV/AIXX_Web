"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/public/api";
import { fetchMyCourses, enrollInCourse, unenrollFromCourse, Course } from "@/services/studentService";
import { courses as catalogCourses, CourseItem } from "@/components/public/courseCatalogData";
import { FaGraduationCap, FaCheckCircle, FaSearch, FaUser, FaBookOpen, FaPlusCircle, FaArrowRight, FaShieldAlt, FaTrashAlt } from "react-icons/fa";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"enrolled" | "catalog">("enrolled");
  const [studentId, setStudentId] = useState<string>("");
  const [inputStudentId, setInputStudentId] = useState<string>("");
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null);
  const [courseToRemove, setCourseToRemove] = useState<Course | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>(catalogCourses);

  // Initialize session / student registration ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      const regId = localStorage.getItem("aixx_candidate_reg_id") || 
                    localStorage.getItem("aixx_student_token") || 
                    localStorage.getItem("aixx_certificate_token");
      const name = localStorage.getItem("aixx_candidate_name");

      if (regId) {
        setStudentId(regId);
        setInputStudentId(regId);
      }
      if (name) {
        setCandidateName(name);
      }
    }
  }, []);

  // Dynamically fetch Admin-created courses from backend
  useEffect(() => {
    const fetchAdminCourses = async () => {
      try {
        const res = await api.get("api/trainings/all");
        const adminItems = res.data?.data || res.data || [];
        if (Array.isArray(adminItems) && adminItems.length > 0) {
          const transformedAdminCourses: CourseItem[] = adminItems.map((item: any) => ({
            id: item.slug || `admin-course-${item.id}`,
            title: item.name,
            description: item.description || "AIXX Professional Course",
            duration: item.duration || "Self-Paced / Flexible",
            subModules: item.sub_modules ? item.sub_modules.split("\n") : ["Core AI Module", "Practical Lab"],
            domestic: item.domestic_fee || "Free",
            international: item.international_fee || "Free",
            keyHighlights: item.highlights ? item.highlights.split("\n") : ["Interactive curriculum"],
            rating: 4.8,
            ratingsCount: 50,
            attendees: 100,
            startDate: "Immediate Access",
            fullFee: item.domestic_fee || "Free",
            payableFee: item.international_fee || item.domestic_fee || "Free",
            discount: item.domestic_fee && item.domestic_fee !== "Free" ? "-$50" : "Free",
            institution: "AIXX ACADEMY",
            deliveryMethod: item.type === "free_courses" ? "Free E-Learning" : "Online / Campus",
          }));

          const merged = [...transformedAdminCourses];
          catalogCourses.forEach((catItem) => {
            if (!merged.some((m) => m.id === catItem.id || m.title.toLowerCase() === catItem.title.toLowerCase())) {
              merged.push(catItem);
            }
          });
          setAvailableCourses(merged);
        }
      } catch (err) {
        console.error("Failed to fetch admin courses:", err);
      }
    };
    fetchAdminCourses();
  }, []);

  // Fetch student's enrolled courses whenever studentId changes
  const loadStudentCourses = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    try {
      const data = await fetchMyCourses(idToFetch.trim());
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadStudentCourses(studentId);
    } else {
      setLoading(false);
    }
  }, [studentId]);

  const handleLookupStudentId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStudentId.trim()) return;
    setStudentId(inputStudentId.trim());
    if (typeof window !== "undefined") {
      localStorage.setItem("aixx_candidate_reg_id", inputStudentId.trim());
    }
    setNotification({
      type: "success",
      message: `Loaded courses for Student ID: ${inputStudentId.trim()}`,
    });
  };

  const handleEnroll = async (catalogCourse: CourseItem) => {
    const targetStudentId = studentId || inputStudentId.trim();
    if (!targetStudentId) {
      setNotification({
        type: "error",
        message: "Please enter or verify your Student Registration ID first.",
      });
      return;
    }

    setEnrollingId(catalogCourse.id);
    setNotification(null);

    try {
      const res = await enrollInCourse(targetStudentId, {
        id: catalogCourse.id,
        title: catalogCourse.title,
        description: catalogCourse.description,
      });

      setCourses(res.courses || []);
      if (res.candidate_name) {
        setCandidateName(res.candidate_name);
      }

      setNotification({
        type: "success",
        message: `Successfully enrolled ${targetStudentId} in "${catalogCourse.title}"!`,
      });

      // Switch to enrolled tab to display the new course
      setActiveTab("enrolled");
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Failed to enroll. Please check your Student Registration ID.";
      setNotification({ type: "error", message: errMsg });
    } finally {
      setEnrollingId(null);
    }
  };

  const handleUnenroll = (course: Course) => {
    setCourseToRemove(course);
  };

  const confirmUnenrollCourse = async () => {
    if (!courseToRemove) return;
    const targetStudentId = studentId || inputStudentId.trim();
    if (!targetStudentId) return;

    const courseIdToRemove = courseToRemove.course_id || courseToRemove.title;
    setUnenrollingId(courseIdToRemove);
    setNotification(null);

    try {
      const res = await unenrollFromCourse(targetStudentId, courseIdToRemove);
      setCourses(res.courses || []);
      setNotification({
        type: "success",
        message: `Successfully removed "${courseToRemove.title}" from your enrolled courses.`,
      });
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Failed to remove course.";
      setNotification({ type: "error", message: errMsg });
    } finally {
      setUnenrollingId(null);
      setCourseToRemove(null);
    }
  };

  const isEnrolledIn = (courseId: string) => {
    return courses.some((c) => c.course_id === courseId || c.title.toLowerCase() === courseId.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* ── Top Hero Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-green-600 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
              <FaGraduationCap className="w-4 h-4" /> AIXX Learning Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              My Enrolled Courses & Learning Hub
            </h1>
            <p className="text-brand-100 text-sm sm:text-base max-w-xl">
              Access your enrolled AI certifications, track your progress, and enroll in new modules using your Student Registration ID.
            </p>
          </div>

          {/* Student ID Card / Search box */}
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl text-white min-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                <FaUser className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-100 uppercase font-semibold">Student Account</p>
                <p className="font-bold text-base">{candidateName || "Candidate Portal"}</p>
              </div>
            </div>

            <form onSubmit={handleLookupStudentId} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputStudentId}
                  onChange={(e) => setInputStudentId(e.target.value)}
                  placeholder="Enter Student ID (e.g. AIXX-REG-1)"
                  className="w-full bg-white/20 placeholder-white/70 text-white text-xs rounded-xl px-3 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-brand-700 hover:bg-brand-50 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow flex items-center gap-1"
              >
                <FaSearch className="w-3 h-3" />
                Load
              </button>
            </form>
            {studentId && (
              <p className="mt-2 text-[11px] text-green-200 font-mono flex items-center gap-1">
                <FaShieldAlt className="w-3 h-3" /> Active Reg ID: <span className="font-bold">{studentId}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between shadow-lg transition-all animate-fade-in ${
              notification.type === "success"
                ? "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold underline ml-4 hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("enrolled")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "enrolled"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <FaBookOpen className="w-4 h-4" />
              My Enrolled Courses ({courses.length})
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "catalog"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <FaPlusCircle className="w-4 h-4" />
              Course Catalog & Enroll ({availableCourses.length})
            </button>
          </div>
        </div>

        {/* ── TAB 1: Enrolled Courses List ── */}
        {activeTab === "enrolled" && (
          <div>
            {loading ? (
              <div className="flex py-16 justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Enrolled Courses Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  You haven't enrolled in any custom courses yet. Browse our catalog to enroll using your Student Registration ID.
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  Explore Available Courses
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                  <div
                    key={course.course_id || idx}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide uppercase">
                          {course.status || "Enrolled"}
                        </span>
                        {course.passed && (
                          <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold flex items-center gap-1">
                            <FaCheckCircle className="w-3 h-3" /> Score: {course.test_score}%
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                        {course.description || "Comprehensive AI learning module and practical certification curriculum."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-gray-400">
                        ID: {course.registration_id}
                      </span>
                      
                      {course.course_id === "free-ai-certificate" ? (
                        <Link
                          href="/ai-certificate/test"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
                        >
                          Take Certificate Test →
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                            <FaCheckCircle className="w-3.5 h-3.5" /> Enrolled
                          </span>
                          <button
                            onClick={() => handleUnenroll(course)}
                            disabled={unenrollingId === (course.course_id || course.title)}
                            title="Remove / Un-enroll from this course"
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                          >
                            <FaTrashAlt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: Available Courses Catalog & Enrollment ── */}
        {activeTab === "catalog" && (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-50 to-green-50 dark:from-brand-900/20 dark:to-green-900/20 p-5 rounded-2xl border border-brand-100 dark:border-brand-800/30">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Enroll in Any Course with Student ID</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Target Student ID: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{studentId || inputStudentId || "Not set (enter above)"}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((c) => {
                const enrolled = isEnrolledIn(c.id);
                return (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-md flex flex-col justify-between hover:shadow-xl transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] font-semibold">
                          {c.duration}
                        </span>
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                          {c.payableFee}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                        {c.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="space-y-1 mb-4">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sub Modules:</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                          {c.subModules.slice(0, 2).map((sub, i) => (
                            <li key={i} className="truncate flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" />
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      {enrolled ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center justify-center gap-2 cursor-default"
                        >
                          <FaCheckCircle className="w-4 h-4" /> Already Enrolled
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(c)}
                          disabled={enrollingId === c.id}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {enrollingId === c.id ? (
                            <span>Enrolling...</span>
                          ) : (
                            <>
                              <FaPlusCircle className="w-3.5 h-3.5" />
                              Enroll using Student ID
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Un-enroll Confirmation Modal Popup ── */}
      {courseToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative text-center">
            {/* Warning Icon */}
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <FaTrashAlt className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Un-enroll Confirmation
              </h3>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                Are you sure you want to remove/un-enroll from &quot;<span className="font-bold text-gray-900 dark:text-white">{courseToRemove.title}</span>&quot;?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                This will remove the course module from your Student Registration ID (<span className="font-mono font-bold text-brand-600 dark:text-brand-400">{studentId || inputStudentId}</span>) learning dashboard.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCourseToRemove(null)}
                disabled={!!unenrollingId}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnenrollCourse}
                disabled={!!unenrollingId}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {unenrollingId ? (
                  <span>Removing...</span>
                ) : (
                  <>
                    <FaTrashAlt className="w-3.5 h-3.5" />
                    Yes, Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import api from "@/lib/public/api";

export interface StudentRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface StudentLoginPayload {
  email: string;
  password: string;
}

export interface StudentAuthResponse {
  message: string;
  token?: string;
  uuid?: string;
  name?: string;
  full_name?: string;
  email?: string;
  registration_id?: string;
  last_login_at?: string;
}

export async function registerStudent(payload: StudentRegisterPayload): Promise<StudentAuthResponse> {
  const { data } = await api.post<StudentAuthResponse>("api/student/register", payload);
  return data;
}

export async function loginStudent(payload: StudentLoginPayload): Promise<StudentAuthResponse> {
  const { data } = await api.post<StudentAuthResponse>("api/student/login", payload);
  return data;
}

export function persistStudentSession(data: StudentAuthResponse) {
  const token = data.token || data.uuid;
  if (token) {
    localStorage.setItem("aixx_student_token", token);
  }
  // Prefer full_name if provided, fallback to name
  const candidateName = data.full_name || data.name;
  if (candidateName) {
    localStorage.setItem("aixx_candidate_name", candidateName);
  }
  if (data.email) {
    localStorage.setItem("aixx_candidate_email", data.email);
  }
  if (data.registration_id) {
    localStorage.setItem("aixx_candidate_reg_id", data.registration_id);
  }
  window.dispatchEvent(new Event("aixx-auth-change"));
}

export function clearStudentSession() {
  localStorage.removeItem("aixx_student_token");
  localStorage.removeItem("aixx_candidate_name");
  localStorage.removeItem("aixx_candidate_email");
  localStorage.removeItem("aixx_candidate_reg_id");
  window.dispatchEvent(new Event("aixx-auth-change"));
}

// ─── Course helpers ────────────────────────────────────────
export interface Course {
  registration_id: string;
  course_id?: string;
  title: string;
  description: string;
  status?: string;
  passed?: boolean;
  test_score?: number | null;
  enrolled_at?: string | null;
}

/** Fetch a single course by its registration ID */
export async function fetchCourseById(registrationId: string): Promise<Course> {
  const { data } = await api.get<Course>("api/certificate/course-details", {
    params: { registration_id: registrationId },
  });
  return data;
}

/** Fetch all courses for a candidate by Student Registration ID or token */
export async function fetchMyCourses(registrationIdOrToken?: string): Promise<Course[]> {
  const token = registrationIdOrToken || (typeof window !== "undefined"
    ? (localStorage.getItem("aixx_candidate_reg_id") || localStorage.getItem("aixx_student_token") || localStorage.getItem("aixx_certificate_token"))
    : null);

  if (!token) return [];

  const { data } = await api.get<Course[]>("api/certificate/my-courses", {
    params: { registration_id: token, token },
  });
  return data;
}

/** Enroll candidate into a course using Student Registration ID or token */
export async function enrollInCourse(
  registrationIdOrToken: string,
  course: { id: string; title: string; description?: string }
): Promise<{ message: string; candidate_name?: string; registration_id?: string; courses: Course[] }> {
  const { data } = await api.post("api/certificate/enroll-course", {
    registration_id: registrationIdOrToken,
    token: registrationIdOrToken,
    course_id: course.id,
    course_title: course.title,
    description: course.description || "",
  });
  return data;
}

/** Remove / Un-enroll candidate from a course using Student Registration ID or token */
export async function unenrollFromCourse(
  registrationIdOrToken: string,
  courseId: string
): Promise<{ message: string; candidate_name?: string; registration_id?: string; courses: Course[] }> {
  const { data } = await api.post("api/certificate/unenroll-course", {
    registration_id: registrationIdOrToken,
    token: registrationIdOrToken,
    course_id: courseId,
  });
  return data;
}

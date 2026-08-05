// src/components/public/CourseCard.tsx

"use client";

import React from "react";
import Link from "next/link";

export interface Course {
  registration_id: string;
  title: string;
  description: string;
  // Additional fields can be added as needed
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {course.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
        {course.description}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Reg ID: {course.registration_id}</span>
        <Link
          href={`/ai-certificate?token=${course.registration_id}`}
          className="text-brand-600 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;

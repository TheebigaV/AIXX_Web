// src/components/common/ActiveToggle.tsx
"use client";
import React from "react";

interface ActiveToggleProps {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
  compact?: boolean; // For table view
}

const ActiveToggle: React.FC<ActiveToggleProps> = ({ isActive, onToggle, disabled = false, compact = false }) => {
  return (
    <div className={`flex items-center ${compact ? "space-x-2" : "space-x-3"}`}>
      <div
        onClick={disabled ? undefined : onToggle}
        className={`
          ${compact ? "w-10 h-5" : "w-14 h-7"}
          flex items-center rounded-full p-1 transition-colors duration-200
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          ${isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
        `}
        role="switch"
        aria-checked={isActive}
        aria-label={`Toggle ${isActive ? "active" : "inactive"} status`}
      >
        <div
          className={`
            bg-white rounded-full shadow-md transform transition-transform duration-200
            ${compact ? "w-3 h-3" : "w-5 h-5"}
            ${isActive ? (compact ? "translate-x-5" : "translate-x-7") : "translate-x-0"}
          `}
        />
      </div>
      {!compact && (
        <span className={`text-sm ${isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
          {isActive ? "Active" : "Inactive"}
        </span>
      )}
    </div>
  );
};

export default ActiveToggle;

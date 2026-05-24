"use client";
import { useEffect, useState } from "react";
import { fetchSettings, updateSettings, fetchPublicSettings } from "@/lib/settings";

export const useSettings = (isAdmin = false) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = isAdmin ? await fetchSettings() : await fetchPublicSettings();
      if (res?.data?.success) {
        setSettings(res.data.data || {});
      } else {
        setError("Failed to parse settings response");
      }
    } catch (err: any) {
      setError(err?.message || "Error fetching settings");
    } finally {
      setLoading(false);
    }
  };

  const save = async (data: Record<string, any>, files?: Record<string, File | null>) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
              formData.append(k, v);
          }
      });
      if (files) {
          Object.entries(files).forEach(([k, f]) => {
              if (f) {
                  formData.append(k, f);
              }
          });
      }

      const res = await updateSettings(formData);
      if (res?.data?.success) {
        setSettings(prev => ({ ...prev, ...data }));
        return { success: true };
      }
      return { success: false, error: "Save settings failed" };
    } catch (err: any) {
      return { success: false, error: err?.message || "Error saving settings" };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [isAdmin]);

  const getSetting = (key: string, fallback = ""): string => {
    return settings[key] !== undefined ? settings[key] : fallback;
  };

  return { settings, loading, error, save, getSetting, refresh: loadSettings };
};

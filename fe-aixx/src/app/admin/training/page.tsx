"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Switch from "@/components/form/switch/Switch";
import { useSettings } from "@/hooks/useSettings";

export default function TrainingSettingsPage() {
  const { settings, loading, error, save } = useSettings(true);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormState(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles && inputFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: inputFiles[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    const result = await save(formState, files);
    if (result.success) {
      setSaveStatus({ success: true, message: "Settings saved successfully!" });
      setTimeout(() => setSaveStatus(null), 3000);
      setFiles({});
    } else {
      setSaveStatus({ success: false, message: result.error || "Failed to save settings" });
    }
  };

  if (loading && Object.keys(formState).length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle="Training Page Settings" />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800" role="alert">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {saveStatus && (
        <div
          className={`mb-4 rounded-lg p-4 text-sm ${
            saveStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
          role="alert"
        >
          <span className="font-semibold">{saveStatus.success ? "Success:" : "Error:"}</span>{" "}
          {saveStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ComponentCard title="Training Page Configurations">
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800">Training Page Status</h3>
                <Switch
                  label="Active"
                  defaultChecked={formState.training_page_active === "true"}
                  onChange={(checked) =>
                    setFormState((prev) => ({ ...prev, training_page_active: checked ? "true" : "false" }))
                  }
                />
              </div>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="mb-4 text-base font-bold text-gray-800">Training Banner Content</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Title</label>
                  <input
                    type="text"
                    name="training_banner_title"
                    value={formState.training_banner_title || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Training & Certification"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Subtitle</label>
                  <textarea
                    name="training_banner_subtitle"
                    value={formState.training_banner_subtitle || ""}
                    onChange={handleChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Explore our certification programs..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Image</label>
                  <input
                    type="file"
                    name="training_banner_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none bg-white"
                  />
                  {formState.training_banner_image && !files.training_banner_image && (
                    <div className="mt-2 text-sm text-gray-500">
                      Current image uploaded. 
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

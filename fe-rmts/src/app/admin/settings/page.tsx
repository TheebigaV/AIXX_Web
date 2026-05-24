"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useSettings } from "@/hooks/useSettings";

type Tab = "general" | "home" | "about" | "contact";

export default function SettingsPage() {
  const { settings, loading, error, save, refresh } = useSettings(true);
  const [activeTab, setActiveTab] = useState<Tab>("general");
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "general", label: "General & Footer" },
    { id: "home", label: "Home Page" },
    { id: "about", label: "About Us Page" },
    { id: "contact", label: "Contact Us Page" },
  ];

  if (loading && Object.keys(formState).length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle="Website Settings" />

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

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Navigation Tabs */}
        <div className="w-full shrink-0 lg:w-64">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <nav className="flex flex-row gap-2 lg:flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-50 text-brand-600 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "general" && (
              <ComponentCard title="General & Footer Configuration">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#00245A]">Footer About Paragraph</label>
                    <textarea
                      name="footer_text"
                      value={formState.footer_text || ""}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                      placeholder="AIXX brings next-generation AI, quantum..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#00245A]">Copyright Statement</label>
                    <input
                      type="text"
                      name="footer_copyright"
                      value={formState.footer_copyright || ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                      placeholder="© 2026 AIXX"
                    />
                  </div>
                </div>
              </ComponentCard>
            )}

            {activeTab === "home" && (
              <ComponentCard title="Home Page Configuration">
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="mb-4 text-base font-bold text-gray-800">Home Banner Content</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Title</label>
                        <input
                          type="text"
                          name="home_banner_title"
                          value={formState.home_banner_title || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="Next-Generation Technology Solutions"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Subtitle</label>
                        <textarea
                          name="home_banner_subtitle"
                          value={formState.home_banner_subtitle || ""}
                          onChange={handleChange}
                          rows={2}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="Harnessing AI, Quantum computing..."
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Image</label>
                        <input
                          type="file"
                          name="home_banner_image"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none bg-white"
                        />
                        {formState.home_banner_image && !files.home_banner_image && (
                          <div className="mt-2 text-sm text-gray-500">
                            Current image uploaded. 
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="mb-4 text-base font-bold text-gray-800">Home About Us Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">About Section Title</label>
                        <input
                          type="text"
                          name="home_about_title"
                          value={formState.home_about_title || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="A Futuristic AI & Quantum Technology Integrator"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">About Section Subtitle (Supports Linebreaks)</label>
                        <textarea
                          name="home_about_subtitle"
                          value={formState.home_about_subtitle || ""}
                          onChange={handleChange}
                          rows={4}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="AIXX is a forward‑looking technology integrator..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-base font-bold text-gray-800">Home Contact Call-to-Action</h3>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-[#00245A]">CTA Heading</label>
                          <input
                            type="text"
                            name="home_contact_title"
                            value={formState.home_contact_title || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="Ready to Build the Future With AIXX?"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-[#00245A]">CTA Subtitle</label>
                          <textarea
                            name="home_contact_subtitle"
                            value={formState.home_contact_subtitle || ""}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="Partner with AIXX to deliver AI, Quantum, cybersecurity..."
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-[#00245A]">CTA Image</label>
                          <input
                            type="file"
                            name="home_contact_image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none bg-white"
                          />
                          {formState.home_contact_image && !files.home_contact_image && (
                            <div className="mt-2 text-sm text-gray-500">
                              Current image uploaded. 
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ComponentCard>
            )}

            {activeTab === "about" && (
              <ComponentCard title="About Us Page Configuration">
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="mb-4 text-base font-bold text-gray-800">About Page Banner</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Title</label>
                        <input
                          type="text"
                          name="about_banner_title"
                          value={formState.about_banner_title || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="Engineering the Future of AI & Quantum Integration"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Description</label>
                        <textarea
                          name="about_banner_subtitle"
                          value={formState.about_banner_subtitle || ""}
                          onChange={handleChange}
                          rows={2}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="AIXX unites next-generation intelligence..."
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Banner Image</label>
                        <input
                          type="file"
                          name="about_banner_image"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none bg-white"
                        />
                        {formState.about_banner_image && !files.about_banner_image && (
                          <div className="mt-2 text-sm text-gray-500">
                            Current image uploaded. 
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="mb-4 text-base font-bold text-gray-800">About Content Block</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Content Headline</label>
                        <input
                          type="text"
                          name="about_content_title"
                          value={formState.about_content_title || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="The Intelligence Behind AIXX"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Content Tagline</label>
                        <input
                          type="text"
                          name="about_content_tagline"
                          value={formState.about_content_tagline || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="Architecting Tomorrow"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#00245A]">Content Description</label>
                        <textarea
                          name="about_content_desc"
                          value={formState.about_content_desc || ""}
                          onChange={handleChange}
                          rows={4}
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                          placeholder="AIXX partners with global enterprises to integrate AI..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-base font-bold text-gray-800">Our Mission</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#00245A]">Mission Title</label>
                          <input
                            type="text"
                            name="about_mission_title"
                            value={formState.about_mission_title || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="Mission"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#00245A]">Mission Statement</label>
                          <textarea
                            name="about_mission_desc"
                            value={formState.about_mission_desc || ""}
                            onChange={handleChange}
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="To accelerate intelligent transformation..."
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-base font-bold text-gray-800">Our Vision</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#00245A]">Vision Title</label>
                          <input
                            type="text"
                            name="about_vision_title"
                            value={formState.about_vision_title || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="Vision"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#00245A]">Vision Statement</label>
                          <textarea
                            name="about_vision_desc"
                            value={formState.about_vision_desc || ""}
                            onChange={handleChange}
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                            placeholder="To shape the shared future by designing..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ComponentCard>
            )}

            {activeTab === "contact" && (
              <ComponentCard title="Contact Page Configurations">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#00245A]">Contact Phone Number</label>
                      <input
                        type="text"
                        name="contact_phone"
                        value={formState.contact_phone || ""}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                        placeholder="+65 9771 0677"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#00245A]">Contact Email Address</label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formState.contact_email || ""}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                        placeholder="cs@aixx.com.sg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#00245A]">Office Location/Address</label>
                    <input
                      type="text"
                      name="contact_address"
                      value={formState.contact_address || ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
                      placeholder="Singapore"
                    />
                  </div>
                </div>
              </ComponentCard>
            )}



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
      </div>
    </div>
  );
}

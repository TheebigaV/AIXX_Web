import { useState, useEffect } from "react";
import { TrainingFormData } from "@/types/training";
import { createTraining, updateTraining } from "@/lib/training";
import useTrainings from "@/hooks/training/useTrainings";

export const useTrainingForm = (trainingId?: string, onSuccess?: () => void) => {
  const { getTraining } = useTrainings();

  const [formData, setFormData] = useState<TrainingFormData>({
    name: "",
    type: "seminars",
    description: "",
    image: null,
    is_active: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
      Partial<Record<keyof TrainingFormData, string>>
  >({});
  const [serverError, setServerError] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  // Load existing training for edit
  useEffect(() => {
    if (trainingId) {
      setLoading(true);
      getTraining(trainingId)
          .then((res) => {
            setFormData({
              ...res.data,
              is_active: !!res.data.is_active,
            });
            if (res.data.image?.url) setExistingImageUrl(res.data.image.url);
          })
          .catch(() => setServerError("Failed to fetch training"))
          .finally(() => setLoading(false));
    }
  }, [trainingId]);

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.type) newErrors.type = "Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field: keyof TrainingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validate()) return false;

    setLoading(true);
    try {
      const payload = new FormData();
      if (trainingId) {
        payload.append("_method", "PUT");
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "image") {
            if (value instanceof File) {
              payload.append(key, value);
            }
          } else if (key === "is_active") {
            payload.append(key, value ? "1" : "0");
          } else {
            payload.append(key, value);
          }
        }
      });

      trainingId
          ? await updateTraining(trainingId, payload)
          : await createTraining(payload);

      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setServerError("Something went wrong");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    serverError,
    loading,
    existingImageUrl,
    handleChange,
    handleSubmit,
  };
};

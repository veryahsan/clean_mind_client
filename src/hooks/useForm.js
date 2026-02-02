import { useState, useCallback, useMemo } from "react";

// Compare current form state to initial; true if something changed
function getIsDirty(values, initialValues, files) {
  const allKeys = new Set([
    ...Object.keys(initialValues || {}),
    ...Object.keys(values || {}),
  ]);
  for (const key of allKeys) {
    const current = values?.[key];
    const initial = initialValues?.[key];
    if (current === initial) continue;
    if (
      Array.isArray(current) &&
      Array.isArray(initial) &&
      current.length === initial.length &&
      current.every(
        (item, i) =>
          item === initial[i] ||
          (item?.id != null && initial[i]?.id === item.id)
      )
    ) {
      continue;
    }
    return true;
  }
  return Object.keys(files || {}).length > 0;
}

export function useForm(initialValues, validationRules = {}, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  // Validate a single field
  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      if (rules.required && !value && value !== 0) {
        return typeof rules.required === "string"
          ? rules.required
          : `${name} is required`;
      }

      if (rules.minLength && value.length < rules.minLength.value) {
        return rules.minLength.message;
      }

      if (rules.maxLength && value.length > rules.maxLength.value) {
        return rules.maxLength.message;
      }

      if (rules.pattern && !rules.pattern.value.test(value)) {
        return rules.pattern.message;
      }

      if (rules.custom) {
        return rules.custom(value, values);
      }

      return "";
    },
    [validationRules, values]
  );

  // Validate file
  const validateFile = useCallback(
    (name, file) => {
      const rules = validationRules[name];
      if (!rules) return "";

      if (rules.required && !file) {
        return typeof rules.required === "string"
          ? rules.required
          : `${name} is required`;
      }

      if (file && rules.maxSize && file.size > rules.maxSize.value) {
        return rules.maxSize.message;
      }

      if (
        file &&
        rules.fileTypes &&
        !rules.fileTypes.value.includes(file.type)
      ) {
        return rules.fileTypes.message;
      }

      return "";
    },
    [validationRules]
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach((name) => {
      if (files[name]) {
        const error = validateFile(name, files[name]);
        if (error) newErrors[name] = error;
      } else if (values[name] !== undefined || validationRules[name].required) {
        const error = validateField(name, values[name]);
        if (error) newErrors[name] = error;
      }
    });
    return newErrors;
  }, [validationRules, files, values, validateField, validateFile]);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));

      if (touched[name] && errors[name]) {
        const error = validateField(name, newValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, errors, validateField]
  );

  // Handle file change
  const handleFileChange = useCallback(
    (e) => {
      const { name } = e.target;
      const file = e.target.files[0];

      setFiles((prev) => ({ ...prev, [name]: file }));
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateFile(name, file);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateFile]
  );

  // Handle list item selection (single)
  const handleSelectItem = useCallback(
    (name, item) => {
      setSelectedItems((prev) => ({ ...prev, [name]: item }));
      setValues((prev) => ({ ...prev, [name]: item }));

      if (touched[name] && errors[name]) {
        const error = validateField(name, item);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, errors, validateField]
  );

  // Handle list item selection (multiple)
  const handleSelectMultiple = useCallback(
    (name, item) => {
      setSelectedItems((prev) => {
        const current = prev[name] || [];
        const exists = current.some((i) => i === item || i.id === item.id);

        const updated = exists
          ? current.filter((i) => i !== item && i.id !== item.id)
          : [...current, item];

        setValues((v) => ({ ...v, [name]: updated }));
        return { ...prev, [name]: updated };
      });

      if (touched[name] && errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [touched, errors]
  );

  // Check if item is selected
  const isSelected = useCallback(
    (name, item) => {
      const selected = selectedItems[name];
      if (!selected) return false;
      if (Array.isArray(selected)) {
        return selected.some((i) => i === item || i.id === item.id);
      }
      return selected === item || selected.id === item.id;
    },
    [selectedItems]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (files[name]) {
        const error = validateFile(name, files[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      } else {
        const error = validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [files, values, validateField, validateFile]
  );

  // Set a specific value programmatically
  const setValue = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  // Set multiple values at once
  const setFormValues = useCallback((newValues) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Set server errors (from API responses)
  const setServerErrors = useCallback((serverErrors) => {
    const formattedErrors = {};

    Object.keys(serverErrors).forEach((key) => {
      if (Array.isArray(serverErrors[key])) {
        formattedErrors[key] = serverErrors[key][0];
      } else {
        formattedErrors[key] = serverErrors[key];
      }
    });

    setErrors((prev) => ({ ...prev, ...formattedErrors }));
  }, []);

  // Clear a specific error
  const clearError = useCallback((name) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Whether the form has changed from initial values (enables submit)
  const isDirty = useMemo(
    () => getIsDirty(values, initialValues, files),
    [values, initialValues, files]
  );

  // Current validation result; used to gate submit and avoid backend hits
  const formErrors = useMemo(
    () => validateForm(),
    [validateForm, values, files]
  );

  // Submit only when something changed and all validation rules pass
  const canSubmit =
    isDirty &&
    Object.keys(formErrors).length === 0 &&
    !isSubmitting;

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Avoid backend hit when nothing changed
      if (!getIsDirty(values, initialValues, files)) {
        return { success: false, errors: {}, skipped: "no_changes" };
      }

      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Validate form
      const errors = validateForm();
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      setIsSubmitting(true);
      try {
        await onSubmit({ ...values, files });
        return { success: true };
      } catch (error) {
        console.error("Submission error:", error);
        return { success: false, error };
      } finally {
        setIsSubmitting(false);
      }
    },
    [validationRules, validateForm, onSubmit, values, initialValues, files]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setFiles({});
    setSelectedItems({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    files,
    selectedItems,
    isDirty,
    canSubmit,
    handleChange,
    handleFileChange,
    handleSelectItem,
    handleSelectMultiple,
    isSelected,
    handleBlur,
    handleSubmit,
    setValue,
    setFormValues,
    setServerErrors,
    clearError,
    clearErrors,
    reset,
  };
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormData } from "@/types";

const STORAGE_KEY = "para_games_form_data";

const EMPTY_FORM_DATA: FormData = {
  step1: {
    npc: "",
    reportedBy: "",
    dateOfReport: "",
    email: "",
    phone: "",
  },
  step2: {
    injuries: [],
    illnesses: [],
  },
};

interface FormContextValue {
  formData: FormData;
  setStep1: (step1: FormData["step1"]) => void;
  setStep2: (step2: FormData["step2"]) => void;
  saveAndResumeLater: () => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {
        // ignore malformed saved data
      }
    }
  }, []);

  const setStep1 = useCallback((step1: FormData["step1"]) => {
    setFormData((prev) => ({ ...prev, step1 }));
  }, []);

  const setStep2 = useCallback((step2: FormData["step2"]) => {
    setFormData((prev) => ({ ...prev, step2 }));
  }, []);

  const saveAndResumeLater = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(EMPTY_FORM_DATA);
  }, []);

  return (
    <FormContext.Provider
      value={{ formData, setStep1, setStep2, saveAndResumeLater, resetForm }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return ctx;
}

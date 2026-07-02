"use client";

import { FormEvent, useState } from "react";
import { getCmsAssetUrl } from "@/lib/cms-display";
import { submitAdmissionApplication } from "@/services/cms";
import type { AdmissionApplicationPayload, HomepageSection } from "@/types/cms";

const initialFormState: AdmissionApplicationPayload = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  country: "",
  city: "",
  zip_code: "",
  date_of_birth: "",
  message: "",
};

type FormErrors = Partial<Record<keyof AdmissionApplicationPayload, string[]>>;

type FieldConfig = {
  name: keyof AdmissionApplicationPayload;
  label: string;
  type?: string;
  required?: boolean;
};

const fields: FieldConfig[] = [
  { name: "first_name", label: "First Name", required: true },
  { name: "last_name", label: "Last Name", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", required: true },
  { name: "address", label: "Address" },
  { name: "country", label: "Country" },
  { name: "city", label: "City" },
  { name: "zip_code", label: "Zip Code" },
  { name: "date_of_birth", label: "Date of Birth", type: "date" },
];

export function AdmissionsSection({
  section,
}: Readonly<{
  section: HomepageSection;
}>) {
  const [form, setForm] = useState<AdmissionApplicationPayload>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const imageUrl = getCmsAssetUrl(section.image_path);
  const submitLabel = section.button_text?.trim() || "Apply Now";

  const updateField = (name: keyof AdmissionApplicationPayload, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setErrors({});

    const result = await submitAdmissionApplication(form);

    setIsSubmitting(false);

    if (result.success) {
      setForm(initialFormState);
      setShowSuccess(true);
      setStatusMessage(result.message);
      return;
    }

    setErrors(result.errors as FormErrors);
    setStatusMessage(result.message);
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f3ea] py-20 sm:py-24 lg:py-28" data-section="admissions">
      <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 xl:grid-cols-[minmax(0,0.98fr)_minmax(420px,0.86fr)]">
        <div className="min-w-0">
          {section.subtitle ? (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
              {section.subtitle}
            </p>
          ) : null}
          {section.title ? (
            <h2 className="mt-3 max-w-[680px] font-serif text-[clamp(2.35rem,7vw,3.6rem)] font-bold leading-[1.05] tracking-normal text-[#061f3f]">
              {section.title}
            </h2>
          ) : null}
          {section.content ? (
            <p className="mt-5 max-w-[650px] text-base leading-8 text-slate-600 sm:text-[17px]">
              {section.content}
            </p>
          ) : null}

          <div className="mt-9 overflow-hidden rounded-[18px] bg-[#061f3f] shadow-[0_24px_70px_rgba(2,6,23,0.16)] lg:mt-11">
            <div
              className="min-h-[260px] bg-cover bg-[center_35%] sm:min-h-[340px] lg:min-h-[430px]"
              style={{
                backgroundImage: imageUrl
                  ? `linear-gradient(180deg,rgba(6,31,63,0.02),rgba(6,31,63,0.18)),url(${imageUrl})`
                  : "radial-gradient(circle at 26% 20%,rgba(250,204,21,0.22),transparent 28%),linear-gradient(135deg,#061f3f,#0b4d7a 58%,#11345c)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="relative lg:pt-8">
          <form
            className="relative overflow-hidden rounded-[18px] border border-white/10 bg-[#061f3f] p-6 text-white shadow-[0_28px_80px_rgba(2,6,23,0.28)] sm:p-8"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-yellow-400" aria-hidden="true" />
            <div className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-300">
                Admissions
              </p>
              <h3 className="mt-2 font-serif text-[clamp(1.75rem,5vw,2.4rem)] font-bold leading-tight tracking-normal">
                Application Form
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={field.name === "address" ? "sm:col-span-2" : ""}>
                  <span className="mb-2 block text-sm font-bold text-blue-50">
                    {field.label}
                    {field.required ? <span className="text-yellow-300"> *</span> : null}
                  </span>
                  <input
                    name={field.name}
                    type={field.type ?? "text"}
                    value={form[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    required={field.required}
                    className="min-h-12 w-full rounded-[8px] border border-white/10 bg-white/[0.08] px-4 text-sm text-white outline-none transition duration-300 placeholder:text-blue-100/50 focus:border-yellow-300 focus:bg-white/[0.12] focus:ring-4 focus:ring-yellow-300/15"
                    aria-invalid={errors[field.name] ? "true" : "false"}
                  />
                  <FieldError messages={errors[field.name]} />
                </label>
              ))}
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-blue-50">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                rows={4}
                className="w-full rounded-[8px] border border-white/10 bg-white/[0.08] px-4 py-3 text-sm leading-6 text-white outline-none transition duration-300 placeholder:text-blue-100/50 focus:border-yellow-300 focus:bg-white/[0.12] focus:ring-4 focus:ring-yellow-300/15"
                aria-invalid={errors.message ? "true" : "false"}
              />
              <FieldError messages={errors.message} />
            </label>

            {statusMessage && !showSuccess ? (
              <p className="mt-5 rounded-[8px] border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm font-semibold leading-6 text-red-100">
                {statusMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="btn-public-primary mt-7 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Submitting..." : submitLabel}</span>
              <span className="btn-public-dot" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>

      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-5 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="admission-success-title">
          <div className="w-full max-w-md rounded-[18px] bg-white p-7 text-center shadow-[0_30px_90px_rgba(2,6,23,0.28)] sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300 text-[#061f3f]" aria-hidden="true">
              <span className="text-2xl font-black">✓</span>
            </div>
            <h3 id="admission-success-title" className="mt-5 font-serif text-3xl font-bold leading-tight text-[#061f3f]">
              Application Successful
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {statusMessage ?? "Application submitted successfully. We will contact you soon."}
            </p>
            <button
              type="button"
              className="btn-public-primary mt-7"
              onClick={() => setShowSuccess(false)}
            >
              <span>Close</span>
              <span className="btn-public-dot" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FieldError({
  messages,
}: Readonly<{
  messages?: string[];
}>) {
  if (!messages?.length) {
    return null;
  }

  return (
    <span className="mt-1.5 block text-xs font-semibold leading-5 text-red-100">
      {messages[0]}
    </span>
  );
}

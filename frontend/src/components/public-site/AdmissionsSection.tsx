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
  { name: "country", label: "Country" },
  { name: "city", label: "City" },
  { name: "zip_code", label: "Zip Code" },
  { name: "date_of_birth", label: "Date of Birth", type: "date" },
  { name: "address", label: "Address" },
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
  const formEyebrow = section.subtitle?.trim() || "ADMISSIONS";

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
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-white/45" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(390px,0.78fr)] lg:items-start lg:gap-0 lg:px-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.74fr)]">
        <div className="min-w-0 lg:pr-10 xl:pr-14">
          {section.subtitle ? (
            <p className="text-[0.72rem] font-black uppercase leading-none tracking-[0.22em] text-[#0b4d7a]">
              {section.subtitle}
            </p>
          ) : null}
          {section.title ? (
            <h2 className="mt-4 max-w-[700px] font-serif text-[clamp(2.55rem,6.5vw,3.5rem)] font-bold leading-[1.05] tracking-normal text-[#061f3f]">
              {section.title}
            </h2>
          ) : null}
          {section.content ? (
            <p className="mt-5 max-w-[610px] text-[15.5px] leading-8 text-slate-600 sm:text-[16.5px]">
              {section.content}
            </p>
          ) : null}

          <div className="mt-9 overflow-hidden rounded-[14px] bg-[#e9dfca] shadow-[0_24px_70px_rgba(2,6,23,0.14)] ring-1 ring-[#061f3f]/10 sm:mt-10 lg:mt-12">
            {imageUrl ? (
              <div
                className="h-[270px] bg-cover bg-[center_36%] sm:h-[350px] lg:h-[440px] xl:h-[470px]"
                data-admissions-media="cms-image"
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <div
                className="h-[270px] bg-[radial-gradient(circle_at_18%_18%,rgba(255,204,0,0.34),transparent_24%),radial-gradient(circle_at_82%_74%,rgba(11,77,122,0.26),transparent_30%),linear-gradient(135deg,#f2ead8_0%,#d9e3e9_46%,#082f55_100%)] sm:h-[350px] lg:h-[440px] xl:h-[470px]"
                data-admissions-media="fallback"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <div className="relative lg:-ml-10 lg:pt-[108px] xl:-ml-14 xl:pt-[118px]">
          <form
            className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[14px] border border-white/10 bg-[#061f3f] p-6 text-white shadow-[0_30px_86px_rgba(2,6,23,0.32)] sm:p-8 lg:mx-0 xl:p-9"
            data-admissions-card
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ffcc00]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(255,204,0,0.12),transparent_28%)]" aria-hidden="true" />
            <div className="relative mb-7 flex items-start gap-4">
              <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-yellow-300/35 bg-white/[0.08] text-yellow-300" aria-hidden="true">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 8.5 12 4l8.5 4.5L12 13 3.5 8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="M6.5 11v4.4c0 2 2.5 3.6 5.5 3.6s5.5-1.6 5.5-3.6V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M20.5 8.5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[0.7rem] font-black uppercase leading-none tracking-[0.2em] text-yellow-300">
                  {formEyebrow}
                </p>
                <h3 className="mt-2 font-serif text-[clamp(1.9rem,5vw,2.55rem)] font-bold leading-[1.08] tracking-normal">
                  Application Form
                </h3>
              </div>
            </div>

            <div className="relative grid gap-x-4 gap-y-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={field.name === "address" ? "sm:col-span-2" : ""}>
                  <span className="mb-2 block text-[0.82rem] font-bold text-blue-50">
                    {field.label}
                    {field.required ? <span className="text-yellow-300"> *</span> : null}
                  </span>
                  <input
                    name={field.name}
                    type={field.type ?? "text"}
                    value={form[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    required={field.required}
                    className="min-h-[50px] w-full rounded-[6px] border border-white/10 bg-[#0b335d] px-4 text-[15px] font-medium text-white outline-none transition duration-300 placeholder:text-blue-100/60 focus:border-yellow-300 focus:bg-[#0e3c6a] focus:ring-4 focus:ring-yellow-300/15"
                    aria-invalid={errors[field.name] ? "true" : "false"}
                  />
                  <FieldError messages={errors[field.name]} />
                </label>
              ))}
            </div>

            <label className="relative mt-4 block">
              <span className="mb-2 block text-[0.82rem] font-bold text-blue-50">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                rows={4}
                className="w-full rounded-[6px] border border-white/10 bg-[#0b335d] px-4 py-3 text-[15px] font-medium leading-6 text-white outline-none transition duration-300 placeholder:text-blue-100/60 focus:border-yellow-300 focus:bg-[#0e3c6a] focus:ring-4 focus:ring-yellow-300/15"
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
              className="btn-public-primary relative mt-7 w-full px-7 sm:w-auto"
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
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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

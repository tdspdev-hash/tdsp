"use client";

import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile, type AuthResult } from "@/lib/auth/client";
import type { Profile } from "@/lib/data/profile";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { AREA_KEYS, GENDER_KEYS, createProfileSchema, type ProfileValues } from "@/lib/validation/auth";
import { Alert } from "../forms/Alert";
import ui from "../ui.module.css";
import lg from "./LoginContent.module.css";

type Props = {
  userId: string;
  profile: Profile;
  dict: { join: Dictionary["join"]; form: Dictionary["form"]; profile: Dictionary["accountPage"]["member"]["profile"] };
};

const TEXT_FIELDS = [
  { id: "fullName", max: 200, optional: false },
  { id: "region", max: 100, optional: false },
  { id: "district", max: 100, optional: false },
  { id: "ward", max: 100, optional: false },
  { id: "village", max: 100, optional: true },
  { id: "occupation", max: 200, optional: true },
] as const;

/** The signed-in user's own details. Row Level Security allows updating their own row only. */
export function ProfileForm({ userId, profile, dict }: Props) {
  const { join, form } = dict;
  const schema = useMemo(
    () => createProfileSchema({ ...join.errors, fullNameRequired: dict.profile.fullNameRequired }),
    [join.errors, dict.profile.fullNameRequired],
  );
  const [result, setResult] = useState<AuthResult | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.full_name,
      phone: profile.phone?.replace(/^\+255/, "") ?? "",
      gender: GENDER_KEYS.find((k) => k === profile.gender) ?? "",
      region: profile.region ?? "",
      district: profile.district ?? "",
      ward: profile.ward ?? "",
      village: profile.village ?? "",
      occupation: profile.occupation ?? "",
      areas: AREA_KEYS.filter((k) => profile.participation_areas.includes(k)),
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    setResult(null);
    const res = await updateProfile(userId, values);
    setResult(res);
    if (res.status === "ok") router.refresh();
  };

  const labels = { fullName: dict.profile.fullName, region: join.fields.region, district: join.fields.district, ward: join.fields.ward, village: join.fields.village, occupation: join.fields.occupation };
  const attrs = (id: keyof ProfileValues) => ({ id: `pf-${id}`, "aria-invalid": errors[id] ? ("true" as const) : undefined, "aria-describedby": errors[id] ? `pf-${id}-error` : undefined });
  const error = (id: keyof ProfileValues) =>
    errors[id] && <p id={`pf-${id}-error`} role="alert" className={lg.error}>{errors[id]?.message as string}</p>;
  const mark = (optional: boolean) =>
    optional ? <span className={ui.optional}>({form.optional})</span> : <span className={lg.star} aria-hidden="true">*</span>;

  const phoneField = (
    <div className={lg.field}>
      <label htmlFor="pf-phone">{join.fields.phone} {mark(false)}</label>
      <span className={`${lg.control} ${errors.phone ? lg.invalid : ""}`}>
        <span title={join.hints.countryCode}>+255</span>
        <input {...attrs("phone")} type="tel" inputMode="tel" autoComplete="tel-national" {...register("phone")} />
      </span>
      {error("phone")}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={lg.form}>
      {TEXT_FIELDS.map(({ id, max, optional }) => (
        <Fragment key={id}>
        <div className={lg.field}>
          <label htmlFor={`pf-${id}`}>{labels[id]} {mark(optional)}</label>
          <span className={`${lg.control} ${errors[id] ? lg.invalid : ""}`}>
            <input {...attrs(id)} maxLength={max} {...register(id)} />
          </span>
          {error(id)}
        </div>
        {id === "fullName" && phoneField}
        </Fragment>
      ))}

      <div className={ui.field} role="radiogroup" aria-label={join.fields.gender}>
        <span className={ui.label}>{join.fields.gender} {mark(true)}</span>
        <div className={ui.choices}>
          {GENDER_KEYS.map((key) => (
            <label key={key} className={ui.choice}><input type="radio" value={key} {...register("gender")} /><span>{join.gender[key]}</span></label>
          ))}
        </div>
      </div>

      <fieldset className={ui.fieldset}>
        <legend className={ui.legend}>{join.sections.interests}</legend>
        <div className={ui.choices}>
          {AREA_KEYS.map((key) => (
            <label key={key} className={ui.choice}><input type="checkbox" value={key} {...register("areas")} /><span>{join.areas[key]}</span></label>
          ))}
        </div>
      </fieldset>

      {result && (
        <Alert kind={result.status === "ok" ? "success" : "error"}>
          {result.status === "ok" ? dict.profile.saved : result.status === "not_configured" ? form.notConfigured : form.genericError}
        </Alert>
      )}

      <button type="submit" className={lg.submit} disabled={isSubmitting}>
        {isSubmitting ? form.sending : dict.profile.save}
      </button>
    </form>
  );
}

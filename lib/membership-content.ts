/**
 * Membership page content that is NOT yet TDSP-approved policy.
 *
 * TDSP's documents name "Membership Categories" and "Member Benefits" as page
 * labels but define neither the categories nor the requirements. The three
 * categories and five requirements on the page come from the design mockup.
 * Their only partial support is Form 01 (application, declaration to follow
 * the Constitution and rules, true information, joining fee). Until TDSP
 * approves them, the page shows a visible "awaiting TDSP approval" note.
 *
 * To publish: get TDSP's written approval (and correct wording), edit the
 * texts in the dictionaries under `membership`, then set this to true.
 */
export const membershipContentApproved = false;

export const MEMBERSHIP_CATEGORIES = ["individual", "groups", "institutions"] as const;
export const MEMBERSHIP_REQUIREMENTS = ["rules", "form", "contact", "fee", "participate"] as const;

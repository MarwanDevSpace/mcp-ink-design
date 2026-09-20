/**
 * CSS Logical Properties & Optical Alignment Auditor (TypeScript Domain)
 * Enforces modern Bi-directional (RTL/LTR) standards, detects centering abuse and overflow leaks.
 */

export interface LogicalPropertyFinding {
  property: string;
  recommended: string;
  reason: string;
}

export interface BidiAlignmentReport {
  score: number; // 0 - 100
  isFullyLogical: boolean;
  hasArabicContent: boolean;
  hasLatinContent: boolean;
  isBilingual: boolean;
  bidiIsolationPassed: boolean;
  opticalAlignmentPassed: boolean;
  findings: LogicalPropertyFinding[];
  remediationSnippet: string;
}

export function auditLogicalProperties(sourceCssOrHtml: string): BidiAlignmentReport {
  const findings: LogicalPropertyFinding[] = [];

  const checks = [
    {
      regex: /\bmargin-left\b/i,
      property: "margin-left",
      recommended: "margin-inline-start",
      reason: "Hardcoded margin-left does not flip automatically in RTL contexts."
    },
    {
      regex: /\bmargin-right\b/i,
      property: "margin-right",
      recommended: "margin-inline-end",
      reason: "Hardcoded margin-right does not flip automatically in RTL contexts."
    },
    {
      regex: /\bpadding-left\b/i,
      property: "padding-left",
      recommended: "padding-inline-start",
      reason: "Hardcoded padding-left breaks symmetric gutters across RTL and LTR."
    },
    {
      regex: /\bpadding-right\b/i,
      property: "padding-right",
      recommended: "padding-inline-end",
      reason: "Hardcoded padding-right breaks symmetric gutters across RTL and LTR."
    },
    {
      regex: /text-align:\s*left\b/i,
      property: "text-align: left",
      recommended: "text-align: start",
      reason: "text-align: left fails to align Arabic text to the right naturally."
    }
  ];

  for (const check of checks) {
    if (check.regex.test(sourceCssOrHtml)) {
      findings.push({
        property: check.property,
        recommended: check.recommended,
        reason: check.reason
      });
    }
  }

  const hasArabicContent = /[\u0600-\u06FF]/.test(sourceCssOrHtml);
  const hasLatinContent = /[a-zA-Z]/.test(sourceCssOrHtml);
  const isBilingual = hasArabicContent && hasLatinContent;

  const bidiIsolationPassed = !isBilingual || sourceCssOrHtml.includes("<bdi") || sourceCssOrHtml.includes("unicode-bidi");
  const opticalAlignmentPassed = !/p\s*\{[^}]*text-align:\s*center/i.test(sourceCssOrHtml);

  let score = 100 - findings.length * 10;
  if (!bidiIsolationPassed) score -= 10;
  if (!opticalAlignmentPassed) score -= 10;
  score = Math.max(0, Math.min(100, score));

  const isFullyLogical = findings.length === 0;

  const remediationSnippet = `
/* Ink Design Logical Properties Boilerplate */
[dir="rtl"], [dir="ltr"] {
  /* Use logical inline margins and paddings */
  margin-inline-start: auto;
  margin-inline-end: auto;
  padding-inline: 1.5rem;
  text-align: start;
}

/* Bidi Isolation for Mixed Language Chips & Numbers */
bdi, .ink-bidi-isolate {
  unicode-bidi: isolate;
  direction: ltr; /* Keeps latin terms/codes aligned */
}
`.trim();

  return {
    score,
    isFullyLogical,
    hasArabicContent,
    hasLatinContent,
    isBilingual,
    bidiIsolationPassed,
    opticalAlignmentPassed,
    findings,
    remediationSnippet
  };
}

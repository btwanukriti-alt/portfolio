// Contact details and links shared by the header, hero and footer.
export const EMAIL = 'hey@anukritimishra.xyz'
// Every "email me" link opens Gmail's compose window, addressed, in a new tab.
export const EMAIL_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`
/** Spread onto an <a>. */
export const EMAIL_LINK = { href: EMAIL_HREF, target: '_blank', rel: 'noopener noreferrer' } as const
export const LINKEDIN = 'https://www.linkedin.com/in/anukritimishra5'
export const LINKEDIN_ID = 'anukritimishra5'
// The resume PDF lives in public/.
export const RESUME = '/resume.pdf'

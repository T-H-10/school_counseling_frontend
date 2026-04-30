// TypeScript
export function formatHebrewDate(d: Date, opts?: Intl.DateTimeFormatOptions) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    try {
      // שימוש ב־Unicode extension כדי לשנות ל־Hebrew calendar
      const formatter = new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...opts,
      });
      return formatter.format(d);
    } catch {
      // אם הדפדפן לא תומך, נחזיר מחרוזת ריקה כדי שלא לשבור את ה־UI
      return "";
    }
  }
  
  export function formatHebrewDayShort(d: Date) {
    try {
      const formatter = new Intl.DateTimeFormat("he-IL-u-ca-hebrew", { day: "numeric", month: "short" });
      return formatter.format(d);
    } catch {
      return "";
    }
  }
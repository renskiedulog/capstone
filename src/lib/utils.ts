import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedDate = `${formattedHours}:${formattedMinutes} ${meridiem} ${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return formattedDate;
};

export const generateRandomString = (length: any) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function formatInputDate(dateString?: string | Date) {
  if (!dateString) return "";
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isEqual(a: any, b: any) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Converts an ISO 8601 timestamp to a human-readable date format.
 *
 * The output format is "HH:MM AM/PM - Month Day, Year", e.g., "10:46 PM - August 8, 2024".
 *
 * @param timestamp - An ISO 8601 formatted date string (e.g., "2024-08-21T00:57:13.497+00:00").
 * @returns A formatted date string in the form of "HH:MM AM/PM - Month Day, Year".
 */
export function formatDateToReadable(timestamp: string | Date): string {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${hour12}:${minutes} ${ampm} - ${month} ${day}, ${year}`;
}

export const getTimeElapsed = (startDate: any) => {
  const now: any = new Date();
  const elapsed = Math.floor((now - new Date(startDate)) / 1000); // Time in seconds

  const days = Math.floor(elapsed / (3600 * 24));
  const hours = Math.floor((elapsed % (3600 * 24)) / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  if (days > 0) {
    return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
};

export const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getWeekRange = () => {
  const start = new Date();
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getMonthRange = () => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setMonth(start.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getYearRange = () => {
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
  return { start, end };
};

export const getDateRange = (range: string) => {
  switch (range) {
    case "today":
      return getTodayRange();
    case "this-week":
      return getWeekRange();
    case "this-month":
      return getMonthRange();
    case "this-year":
      return getYearRange();
    default:
      throw new Error(
        "Invalid range. Use 'today', 'this-week', 'this-month', or 'this-year'."
      );
  }
};

export const getPreviousRange = (range: string) => {
  const { start, end } = getDateRange(range);
  const previousStart = new Date(start);
  const previousEnd = new Date(end);

  switch (range) {
    case "today":
      previousStart.setDate(previousStart.getDate() - 1);
      previousEnd.setDate(previousEnd.getDate() - 1);
      break;
    case "this-week":
      previousStart.setDate(previousStart.getDate() - 7);
      previousEnd.setDate(previousEnd.getDate() - 7);
      break;
    case "this-month":
      previousStart.setMonth(previousStart.getMonth() - 1);
      previousEnd.setMonth(previousEnd.getMonth() - 1);
      break;
    case "this-year":
      previousStart.setFullYear(previousStart.getFullYear() - 1);
      previousEnd.setFullYear(previousEnd.getFullYear() - 1);
      break;
    default:
      throw new Error("Invalid range. Cannot calculate previous range.");
  }

  return { start: previousStart, end: previousEnd };
};

export const formatTime = (seconds: number) => {
  if (seconds < 60) {
    return `${Math.round(seconds)} secs`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min ${Math.round(seconds % 60)} sec`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} min`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} day${days > 1 ? "s" : ""} ${hours} hr`;
  }
};

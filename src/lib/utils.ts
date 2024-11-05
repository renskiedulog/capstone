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

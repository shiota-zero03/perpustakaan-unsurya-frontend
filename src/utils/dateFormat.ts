import { DateValue } from "@nextui-org/react";

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateDMY = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateDMYIn = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formattedDate;
};

export const formatDateYMD = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-CA", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return formattedDate;
};

export const formatDateMYIn = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return formattedDate;
};

export const formatedDate = (timestamp: string) => {
  const dateObj = new Date(timestamp);

  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${formattedDate}`;
};

export const formatedTimestamp = (timestamp: string) => {
  const dateObj = new Date(timestamp);

  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate}, ${formattedTime}`;
};

export const formatedTimestampWitoutWeekday = (timestamp: string, separator? : string) => {
  const dateObj = new Date(timestamp);

  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate}${separator ? ` ${separator} ` : ', '}${formattedTime}`;
};

export const returnFormatDate = (dateValue: DateValue | null): string => {
  if (!dateValue) return "";
  const dateObj = new Date(dateValue.year, dateValue.month - 1, dateValue.day);
  return dateObj.toLocaleDateString("en-CA");
};

export const ISOFormat = (dateValue: string) => {
  const dateObj = new Date(dateValue);
  const datetimeISO = dateObj.toISOString();
  return datetimeISO;
};

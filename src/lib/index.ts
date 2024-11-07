import { TIMEOUT_SEC } from "@/config";

const timeout = function (sec: number): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${sec} second`)),
      sec * 1000
    )
  );
};

export const getJSON = async <T>(url: string) => {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data: T = await res.json();

    if (!res.ok) throw new Error(`${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async <T>(url: string, uploadData: unknown) => {
  try {
    const fetchPromise = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data: T = await res.json();

    if (!res.ok) throw new Error(`${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

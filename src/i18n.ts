import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { fetcher } from './lib/functions';

export const maxDuration = 50;

// Can be imported from a shared config
const locales = ['en', 'tr'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  let endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/translations`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 seconds
  let messages = (await import(`../messages/${locale}.json`)).default;
  try {
    const response = await fetch(endpoint, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    clearTimeout(timeoutId); // Clear the timeout if fetch is successful

    if (data?.data?.length > 0) {
      messages = data?.data[0]?.attributes?.[`${locale}`];
    }

    return {
      messages,
    };
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('Fetch aborted due to timeout');
      // Handle timeout, e.g., return default messages or show an error
      return {
        messages,
      };
    } else {
      console.error('Fetch error:', error);
      return {
        messages,
      };
      throw error; // Re-throw the error to prevent unexpected behavior
    }
  }
});

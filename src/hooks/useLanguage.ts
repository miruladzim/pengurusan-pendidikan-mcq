import { useEffect, useState } from "react";
import { getLanguage, setLanguage as setStoredLanguage, subscribeLanguage, type Language } from "../utils/language";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("bm");

  useEffect(() => {
    setLanguageState(getLanguage());
    return subscribeLanguage(setLanguageState);
  }, []);

  return { language, setLanguage: setStoredLanguage };
}

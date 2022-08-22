import { FC } from "react";
interface ILocale {
  flag: "kr" | "gb" | "fr" | "tr" | "cn" | "ae" | "es" | "vn" | "de" | "pl" | "ru" | "ko" | "ja" | "th";
  plurals: (n: number | string, ord?: boolean) => "zero" | "one" | "two" | "few" | "many" | "other";
  direction: "inherit" | "rtl";
}
interface ILocales {
  [locale: string]: ILocale;
}
export interface OHMLocaleSwitcherProps {
  initialLocale: string;
  locales: ILocales;
  onLocaleChange: (locale: string) => void;
  label?: string;
}
declare const LocaleSwitcher: FC<OHMLocaleSwitcherProps>;
export default LocaleSwitcher;

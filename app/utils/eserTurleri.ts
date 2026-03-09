export type EserTuruValue = "yazi" | "siir" | "resim";

export interface EserTuruItem {
  value: EserTuruValue;
  title: string;
  icon: string;
  color: string;
}

export const ESER_TURLERI: EserTuruItem[] = [
  { value: "yazi", title: "Yazı", icon: "mdi-pencil", color: "primary" },
  { value: "siir", title: "Şiir", icon: "mdi-format-quote-close", color: "secondary" },
  { value: "resim", title: "Resim / Görsel", icon: "mdi-image-outline", color: "success" },
];

export function getEserTuru(value?: string): EserTuruItem | undefined {
  return ESER_TURLERI.find((t) => t.value === value);
}

export function getEserTuruLabel(value?: string): string {
  return getEserTuru(value)?.title ?? value ?? "—";
}

export function getEserTuruIcon(value?: string): string {
  return getEserTuru(value)?.icon ?? "mdi-file-document-outline";
}

export function getEserTuruColor(value?: string): string {
  return getEserTuru(value)?.color ?? "default";
}

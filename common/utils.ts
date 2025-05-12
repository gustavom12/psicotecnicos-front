export const cx = (...cls: (string | boolean | undefined)[]) =>
  cls.filter(Boolean).join(" ");

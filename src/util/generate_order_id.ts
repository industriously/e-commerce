const ABC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * 랜덤 문자열 생성
 *
 * YYMMDD + 알파벳 3개
 */
export const generateCode = (): string => {
  const now = new Date();
  const YYMMDD = now.toISOString().slice(2, 10).replaceAll('-', '');
  const a = Math.floor(Math.random() * 52);
  const b = Math.floor(Math.random() * 52);
  const c = Math.floor(Math.random() * 52);

  return `${YYMMDD}${ABC[a]}${ABC[b]}${ABC[c]}`;
};

import { AppUser } from './types';

export type StoredAccount = {
  id: string;
  name: string;
  normalizedName: string;
  role: AppUser['role'];
  studentClass?: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export const ACCOUNT_STORAGE_KEY = 'physilearn_accounts_v1';

export function normalizeAccountName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi-VN');
}

export function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item.name === 'string' && typeof item.passwordHash === 'string')
      .map((item) => ({
        id: typeof item.id === 'string' ? item.id : `account-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: item.name.trim(),
        normalizedName: typeof item.normalizedName === 'string' ? item.normalizedName : normalizeAccountName(item.name),
        role: item.role === 'teacher' ? 'teacher' : 'student',
        studentClass: typeof item.studentClass === 'string' ? item.studentClass : undefined,
        passwordHash: item.passwordHash,
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
      }));
  } catch (error) {
    console.error('Error reading accounts from localStorage:', error);
    return [];
  }
}

export function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Error writing accounts to localStorage:', error);
    throw new Error('Không thể lưu tài khoản trên trình duyệt này. Vui lòng kiểm tra quyền lưu trữ hoặc thử trình duyệt khác.');
  }
}

function fallbackHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a_${(hash >>> 0).toString(16)}`;
}

export async function hashPassword(password: string, normalizedName: string): Promise<string> {
  const source = `physilearn-account-v1::${normalizedName}::${password}`;
  try {
    if (globalThis.crypto?.subtle) {
      const data = new TextEncoder().encode(source);
      const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
      return `sha256_${Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')}`;
    }
  } catch (error) {
    console.warn('Web Crypto is unavailable. Falling back to demo hash.', error);
  }

  return fallbackHash(source);
}

export function findStoredAccountByName(name: string): StoredAccount | undefined {
  const normalizedName = normalizeAccountName(name);
  return getStoredAccounts().find((account) => account.normalizedName === normalizedName);
}

export function hasStoredAccountForUser(user?: AppUser | null): boolean {
  if (!user?.name) return false;
  return Boolean(findStoredAccountByName(user.name));
}

import type { User } from '../types';

const AUTH_KEY     = 'apexsport_user';
const ACCOUNTS_KEY = 'apexsport_accounts';

export const DEMO_USER = {
  fname: 'Alex', lname: 'Laurent',
  email: 'alex@apexsport.com',
  password: 'demo1234',
  sport: 'running', level: 'amateur',
  program: 'Half-Marathon Prep',
};

export function getUser(): User | null {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); }
  catch { return null; }
}

export function saveUser(data: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

interface Account {
  fname: string; lname: string; email: string; password: string;
  sport: string; level: string; program: string;
}

function getAccounts(): Account[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); }
  catch { return []; }
}

export function addAccount(user: Account): void {
  const accounts = getAccounts();
  accounts.push(user);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function loginWithCredentials(email: string, password: string): User | null {
  const accounts = getAccounts();
  const match = accounts.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  const isDemo =
    email.toLowerCase() === DEMO_USER.email.toLowerCase() && password === DEMO_USER.password;

  if (match || isDemo) {
    const src = match || DEMO_USER;
    return { fname: src.fname, lname: src.lname, email: src.email,
             sport: src.sport, level: src.level, program: src.program };
  }
  return null;
}

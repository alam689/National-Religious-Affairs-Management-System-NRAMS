// Prototype session flag — there is no backend, so "signed in" only means the officer went through the login
// screen in this browser tab. sessionStorage keeps it across reloads and clears it when the tab is closed, so
// every fresh visit starts at /login.
const KEY = 'nrams.session'
let memory = false // fallback when storage is blocked (private mode, strict settings)

export function isSignedIn(): boolean {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return memory }
}
export function signIn(): void {
  memory = true
  try { sessionStorage.setItem(KEY, '1') } catch { /* keep the in-memory flag */ }
}
export function signOut(): void {
  memory = false
  try { sessionStorage.removeItem(KEY) } catch { /* nothing stored */ }
}

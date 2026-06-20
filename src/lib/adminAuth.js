// 20/06/2026
const ADMIN_CREDENTIALS = {
  email: 'admin@mythicstore.com',
  password: 'Mythic@2024'
};

export function verifyAdmin(email, password) {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem('mythic_admin') === 'true';
}

export function loginAdmin() {
  sessionStorage.setItem('mythic_admin', 'true');
}

export function logoutAdmin() {
  sessionStorage.removeItem('mythic_admin');
}
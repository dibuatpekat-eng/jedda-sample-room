// Auth helpers
async function getSession() {
  const { data: { session } } = await db.auth.getSession()
  return session
}

async function getProfile() {
  const session = await getSession()
  if (!session) return null
  const { data } = await db.from('profiles').select('*').eq('id', session.user.id).single()
  return data
}

async function requireAuth(allowedRoles = []) {
  const session = await getSession()
  if (!session) { window.location.href = 'index.html'; return null }
  const profile = await getProfile()
  if (!profile) { window.location.href = 'index.html'; return null }
  if (allowedRoles.length && !allowedRoles.includes(profile.role)) {
    redirectByRole(profile.role)
    return null
  }
  return profile
}

function redirectByRole(role) {
  if (role === 'head') window.location.href = 'dashboard-head.html'
  else if (role === 'designer') window.location.href = 'dashboard-designer.html'
  else if (role === 'supervisor') window.location.href = 'dashboard-supervisor.html'
}

async function logout() {
  await db.auth.signOut()
  window.location.href = 'index.html'
}

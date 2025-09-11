// User ID storage using localStorage
export const setCurrentUserId = (userId: string | null) => {
  if (userId) {
    localStorage.setItem('userId', userId)
  } else {
    localStorage.removeItem('userId')
  }
}

export const getCurrentUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId')
  }
  return null
}
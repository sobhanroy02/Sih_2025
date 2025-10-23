import { redirect } from 'next/navigation'

export default function LoginRedirect() {
  // Redirect legacy /login path to the combined auth page at /signup
  redirect('/signup')
}

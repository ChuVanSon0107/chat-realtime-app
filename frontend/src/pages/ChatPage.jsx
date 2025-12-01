import { useAuthStore } from '../stores/useAuthStore'

export const ChatPage = () => {
  const { signout } = useAuthStore();
  return (
    <div>
      <button onClick={signout}>Sign out</button>
    </div>
  )
}

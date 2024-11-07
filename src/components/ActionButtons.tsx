interface ActionButtonsProps {
  isCurrentUser: boolean;
  onEditProfile: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
  onLogout?: () => void;
}

export default function ActionButtons({
  isCurrentUser,
  onEditProfile,
  onLogout,
  onFollow,
  onMessage,
}: ActionButtonsProps) {
  if (isCurrentUser) {
    return (
      <div className="flex gap-3">
        <button
          onClick={onEditProfile}
          className="btn btn-secondary px-10 py-1 border hover:bg-gray-100 transition-colors"
        >
          Edit Profile
        </button>
        <button
          onClick={onLogout}
          className="btn btn-secondary px-10 py-1 border hover:bg-gray-100 transition-colors w-[150px]"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={onFollow}
        className="btn btn-primary px-10 py-1 border hover:opacity-90 transition-opacity"
      >
        Follow
      </button>
      <button
        onClick={onMessage}
        className="btn btn-secondary px-10 py-1 border hover:bg-gray-100 transition-colors"
      >
        Message
      </button>
    </div>
  );
}

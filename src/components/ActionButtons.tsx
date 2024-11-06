interface ActionButtonsProps {
  isCurrentUser: boolean;
  onEditProfile: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
}

export default function ActionButtons({
  isCurrentUser,
  onEditProfile,
  onFollow,
  onMessage,
}: ActionButtonsProps) {
  if (isCurrentUser) {
    return (
      <button
        onClick={onEditProfile}
        className="btn btn-secondary px-10 py-1 border hover:bg-gray-100 transition-colors"
      >
        Edit Profile
      </button>
    );
  }

  return (
    <div className="flex gap-2">
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

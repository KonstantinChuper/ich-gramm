interface ActionButtonsProps {
  isCurrentUser: boolean;
  isFollowing?: boolean;
  onEditProfile: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
  onLogout?: () => void;
}

export default function ActionButtons({
  isCurrentUser,
  isFollowing,
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
          className="btn btn-secondary px-10 py-1 hover:bg-gray-100 transition-colors"
        >
          Edit Profile
        </button>
        <button
          onClick={onLogout}
          className="btn btn-secondary px-10 py-1 hover:bg-gray-100 transition-colors w-[150px]"
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
        className={`btn px-10 py-1 transition-colors ${
          isFollowing ? "btn-secondary hover:bg-gray-100" : "btn-primary hover:opacity-90"
        }`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
      <button
        onClick={onMessage}
        className="btn btn-secondary px-10 py-1 hover:bg-gray-100 transition-colors"
      >
        Message
      </button>
    </div>
  );
}

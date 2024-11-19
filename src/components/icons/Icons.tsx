import React from "react";

interface IconProps {
  isFilled?: boolean;
}

export function HomeIcon({ isFilled = false }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-[#262626] dark:stroke-white"
    >
      {isFilled ? (
        <path
          d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"
          className="fill-[#262626] dark:fill-white"
        />
      ) : (
        <path
          d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997h0A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function SearchIcon({ isFilled = false }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-[#262626] dark:stroke-white"
    >
      {isFilled ? (
        <path
          d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5ZM16.511 16.511 22 22"
          className="fill-[#262626] dark:fill-white"
        />
      ) : (
        <path
          d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5ZM16.511 16.511 22 22"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function ExploreIcon({ isFilled = false }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-[#262626] dark:stroke-white"
    >
      {isFilled ? (
        <>
          <path
            d="M13.173 13.164L14.664 9.335L10.834 10.825L13.173 13.164ZM12.001 0.5C9.7265 0.5 7.50309 1.17446 5.61192 2.4381C3.72076 3.70174 2.24677 5.49779 1.37637 7.59914C0.505959 9.70049 0.278221 12.0128 0.721951 14.2435C1.16568 16.4743 2.26095 18.5234 3.86925 20.1317C5.47756 21.74 7.52666 22.8353 9.75744 23.279C11.9882 23.7228 14.3005 23.495 16.4018 22.6246C18.5032 21.7542 20.2992 20.2802 21.5629 18.3891C22.8265 16.4979 23.501 14.2745 23.501 12C23.4975 8.95107 22.2848 6.028 20.1289 3.87207C17.973 1.71615 15.0499 0.503441 12.001 0.5ZM17.351 7.943L14.873 14.312C14.8226 14.4412 14.7459 14.5585 14.6478 14.6564C14.5497 14.7544 14.4322 14.8309 14.303 14.881L7.94298 17.351C7.76218 17.4211 7.56488 17.4372 7.37511 17.3972C7.18535 17.3572 7.0113 17.2629 6.87417 17.1258C6.73703 16.9887 6.64274 16.8146 6.60275 16.6249C6.56277 16.4351 6.57883 16.2378 6.64898 16.057L9.12898 9.688C9.17935 9.55882 9.25604 9.44153 9.35417 9.34358C9.45229 9.24562 9.56972 9.16915 9.69898 9.119L16.058 6.649C16.2388 6.57885 16.4361 6.56279 16.6259 6.60277C16.8156 6.64275 16.9897 6.73705 17.1268 6.87418C17.2639 7.01132 17.3582 7.18536 17.3982 7.37513C17.4382 7.5649 17.4211 7.7622 17.351 7.943Z"
            strokeWidth="0.5"
            className="fill-[#262626] dark:fill-white"
          />
        </>
      ) : (
        <>
          <path
            d="M13.9411 13.953L7.58105 16.424L10.0601 10.056L16.4201 7.58496L13.9411 13.953Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0601 10.056L13.9491 13.945L7.58105 16.424L10.0601 10.056Z"
            fill="black"
          />
          <path
            d="M12.001 22.505C17.8 22.505 22.501 17.804 22.501 12.005C22.501 6.20602 17.8 1.505 12.001 1.505C6.20199 1.505 1.50098 6.20602 1.50098 12.005C1.50098 17.804 6.20199 22.505 12.001 22.505Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

export function MessagesIcon({ isFilled = false }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-[#262626] dark:stroke-white"
    >
      {isFilled ? (
        <>
          <path
            d="M12.003 1.95924C14.7478 1.87786 17.4563 2.81219 19.5154 4.72925C21.5745 6.64631 22.7931 9.27675 22.7931 11.9997C22.7931 14.7227 21.5745 17.3531 19.5154 19.2702C17.4563 21.1873 14.7478 22.1216 12.003 22.0402C10.5157 22.0439 9.04255 21.7641 7.67493 21.2161L3.51493 22.3161C3.26636 22.3883 3.00449 22.3787 2.76173 22.2885C2.51897 22.1983 2.30816 22.0322 2.1609 21.8125C2.01364 21.5928 1.93838 21.3307 1.94687 21.0648C1.95535 20.799 2.04706 20.5426 2.20993 20.3331L3.77993 18.2861C2.91959 17.0893 2.32421 15.7468 2.02903 14.3331C1.73385 12.9193 1.74478 11.4634 2.06093 10.0541C2.37708 8.64473 2.99316 7.31223 3.87138 6.12846C4.7496 4.94469 5.87133 3.93751 7.16793 3.16867C8.46452 2.39983 9.90686 1.88441 11.4099 1.65388C11.6066 1.62038 11.8047 1.59274 12.003 1.95924Z"
            className="fill-[#262626] dark:fill-white stroke-none"
          />
          <path
            d="M17.7901 10.132C17.8736 10.0008 17.9081 9.8444 17.8875 9.6903C17.8668 9.5362 17.7923 9.39437 17.6772 9.28989C17.562 9.1854 17.4137 9.12499 17.2583 9.11933C17.1029 9.11368 16.9505 9.16314 16.8281 9.25897L14.2721 11.309C14.1631 11.3915 14.0302 11.4364 13.8934 11.4367C13.7567 11.4371 13.6235 11.3929 13.5141 11.311L11.0601 9.46998C10.886 9.33963 10.6868 9.24673 10.4751 9.19712C10.2633 9.14752 10.0436 9.14227 9.82969 9.18172C9.61581 9.22117 9.41242 9.30446 9.2323 9.42635C9.05218 9.54824 8.89924 9.7061 8.7831 9.88998L6.2161 13.87C6.13181 14.001 6.09667 14.1576 6.11691 14.3121C6.13716 14.4666 6.21147 14.6089 6.32666 14.7138C6.44185 14.8187 6.59048 14.8793 6.74617 14.8851C6.90185 14.8908 7.05453 14.8411 7.1771 14.745L9.7331 12.696C9.8422 12.6132 9.97531 12.5682 10.1123 12.5678C10.2492 12.5675 10.3826 12.6118 10.4921 12.694L12.9441 14.534C13.1182 14.6645 13.3175 14.7575 13.5293 14.8072C13.7412 14.8569 13.9611 14.8622 14.1751 14.8228C14.3891 14.7833 14.5926 14.7 14.7728 14.578C14.953 14.456 15.106 14.298 15.2221 14.114L17.7901 10.132Z"
            className="fill-white dark:fill-[#262626]"
          />
        </>
      ) : (
        <>
          <path
            d="M12.003 2.00098C13.303 1.95924 14.5981 2.17924 15.8115 2.64792C17.0248 3.11661 18.1315 3.8244 19.0659 4.72925C20.0003 5.63411 20.7432 6.71755 21.2506 7.91521C21.758 9.11286 22.0194 10.4003 22.0194 11.701C22.0194 13.0017 21.758 14.2891 21.2506 15.4868C20.7432 16.6844 20.0003 17.7679 19.0659 18.6727C18.1315 19.5776 17.0248 20.2854 15.8115 20.754C14.5981 21.2227 13.303 21.4427 12.003 21.401C11.0251 21.4037 10.0513 21.2745 9.10796 21.017C8.93097 20.9687 8.74274 20.9828 8.57496 21.057L6.59096 21.933C6.47099 21.9857 6.33992 22.0082 6.20923 21.9985C6.07854 21.9888 5.95223 21.9472 5.84137 21.8773C5.73052 21.8074 5.6385 21.7114 5.5734 21.5977C5.50829 21.4839 5.47209 21.356 5.46796 21.225L5.41396 19.445C5.40945 19.3369 5.38322 19.2308 5.33683 19.133C5.29045 19.0353 5.22485 18.9478 5.14396 18.876C4.14013 17.9723 3.34075 16.8649 2.79926 15.6275C2.25776 14.3902 1.98662 13.0515 2.00396 11.701C1.99636 10.3995 2.25209 9.10999 2.75579 7.90993C3.25948 6.70987 4.00071 5.6241 4.9349 4.71794C5.86909 3.81178 6.97693 3.10395 8.19177 2.63703C9.4066 2.17011 10.7023 1.95376 12.003 2.00098Z"
            strokeWidth="1.739"
            strokeMiterlimit="10"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.7901 10.132C17.8736 10.0008 17.9081 9.8444 17.8875 9.6903C17.8668 9.5362 17.7923 9.39437 17.6772 9.28989C17.562 9.1854 17.4137 9.12499 17.2583 9.11933C17.1029 9.11368 16.9505 9.16314 16.8281 9.25897L14.2721 11.309C14.1631 11.3915 14.0302 11.4364 13.8934 11.4367C13.7567 11.4371 13.6235 11.3929 13.5141 11.311L11.0601 9.46998C10.886 9.33963 10.6868 9.24673 10.4751 9.19712C10.2633 9.14752 10.0436 9.14227 9.82969 9.18172C9.61581 9.22117 9.41242 9.30446 9.2323 9.42635C9.05218 9.54824 8.89924 9.7061 8.7831 9.88998L6.2161 13.87C6.13181 14.001 6.09667 14.1576 6.11691 14.3121C6.13716 14.4666 6.21147 14.6089 6.32666 14.7138C6.44185 14.8187 6.59048 14.8793 6.74617 14.8851C6.90185 14.8908 7.05453 14.8411 7.1771 14.745L9.7331 12.696C9.8422 12.6132 9.97531 12.5682 10.1123 12.5678C10.2492 12.5675 10.3826 12.6118 10.4921 12.694L12.9441 14.534C13.1182 14.6645 13.3175 14.7575 13.5293 14.8072C13.7412 14.8569 13.9611 14.8622 14.1751 14.8228C14.3891 14.7833 14.5926 14.7 14.7728 14.578C14.953 14.456 15.106 14.298 15.2221 14.114L17.7901 10.132Z"
            className="fill-[#262626] dark:fill-white"
          />
        </>
      )}
    </svg>
  );
}

export function NotificationsIcon({ isFilled = false }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-[#262626] dark:stroke-white"
    >
      {isFilled ? (
        <path
          d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938"
          className="fill-[#262626] dark:fill-white stroke-none"
        />
      ) : (
        <path
          d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function CreateIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-none stroke-[#262626] dark:stroke-white"
    >
      <path
        d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.545 12.001h10.91M12.003 6.545v10.91"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MessageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.2441 14.9222C19.2907 13.1118 19.6424 10.9823 19.2336 8.93148C18.8247 6.88068 17.6832 5.04887 16.0223 3.77826C14.3614 2.50765 12.2948 1.88515 10.2085 2.02705C8.12212 2.16895 6.1588 3.06555 4.68527 4.54934C3.21174 6.03314 2.32879 8.00264 2.20137 10.0899C2.07395 12.1772 2.71077 14.2395 3.99288 15.8915C5.27498 17.5435 7.11467 18.6722 9.16825 19.0669C11.2218 19.4615 13.3489 19.095 15.152 18.0358L19.4017 19.2219L18.2441 14.9222Z"
        stroke-width="1.72264"
        stroke-linejoin="round"
        className="fill-none stroke-[#262626] dark:stroke-white"
      />
    </svg>
  );
}

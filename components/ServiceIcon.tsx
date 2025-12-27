interface ServiceIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function ServiceIcon({ name, className = "", size = 48 }: ServiceIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ color: "currentColor" }}
      fill="none"
    >
      <use href={`/icons/domp-icons.svg#${name}`} />
    </svg>
  );
}


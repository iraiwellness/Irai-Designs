import { cn } from '../lib/utils';

const SIZES = {
  sm: { box: 'w-9 h-9', pad: 'p-1', radius: 'rounded-xl' },
  md: { box: 'w-16 h-16', pad: 'p-2', radius: 'rounded-2xl' },
  lg: { box: 'w-20 h-20', pad: 'p-3', radius: 'rounded-2xl' },
  xl: { box: 'w-[72px] h-[72px]', pad: 'p-3', radius: 'rounded-full' },
} as const;

interface BrandLogoProps {
  size?: keyof typeof SIZES;
  className?: string;
  centered?: boolean;
  variant?: 'on-dark' | 'on-light';
}

export default function BrandLogo({
  size = 'md',
  className,
  centered = true,
  variant = 'on-dark',
}: BrandLogoProps) {
  const s = SIZES[size];
  const surface = variant === 'on-dark'
    ? 'border-white/10 bg-white/5'
    : 'border-brand-border bg-white';

  return (
    <div
      className={cn(
        'flex items-center justify-center shrink-0 overflow-hidden border',
        s.box,
        s.pad,
        s.radius,
        surface,
        centered && 'mx-auto',
        className,
      )}
    >
      <img src="/irai_logo.png" alt="IRAI" className="w-full h-full object-contain" />
    </div>
  );
}

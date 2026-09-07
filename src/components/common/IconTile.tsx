import React from 'react';
import { SemanticVariant } from './semanticTokens';

export type IconTileTone = SemanticVariant | 'primary';
export type IconTileSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconTileProps {
 /** Tone / semantic variant: neutral, success, warning, correction, danger, info, smart, primary */
 tone?: IconTileTone;
 /** Size of the tile container: xs (24px), sm (32px), md (40px), lg (48px), xl (56px) */
 size?: IconTileSize;
 /** Lucide Icon component */
 icon?: React.ComponentType<{ className?: string }>;
 /** Direct icon or element children */
 children?: React.ReactNode;
 /** Additional container classes */
 className?: string;
}

const TONE_STYLES: Record<IconTileTone, { container: string; iconColor: string }> = {
 neutral: {
 container: 'bg-white border border-zinc-300 text-zinc-700 shadow-2xs',
 iconColor: 'text-zinc-700',
 },
 success: {
 container: 'bg-white border border-emerald-600 text-emerald-700 shadow-2xs',
 iconColor: 'text-emerald-700',
 },
 warning: {
 container: 'bg-white border border-amber-500 text-amber-600 shadow-2xs',
 iconColor: 'text-amber-600',
 },
 correction: {
 container: 'bg-white border border-orange-500 text-orange-600 shadow-2xs',
 iconColor: 'text-orange-600',
 },
 danger: {
 container: 'bg-white border border-rose-500 text-rose-600 shadow-2xs',
 iconColor: 'text-rose-600',
 },
 info: {
 container: 'bg-white border border-blue-500 text-blue-600 shadow-2xs',
 iconColor: 'text-blue-600',
 },
 smart: {
 container: 'bg-white border border-purple-500 text-purple-600 shadow-2xs',
 iconColor: 'text-purple-600',
 },
 primary: {
 container: 'bg-white border border-rose-500 text-rose-600 shadow-2xs',
 iconColor: 'text-rose-600',
 },
};

const SIZE_STYLES: Record<IconTileSize, { container: string; icon: string }> = {
 xs: {
 container: 'w-6 h-6 rounded-lg',
 icon: 'w-3 h-3',
 },
 sm: {
 container: 'w-8 h-8 rounded-xl',
 icon: 'w-4 h-4',
 },
 md: {
 container: 'w-10 h-10 rounded-xl',
 icon: 'w-5 h-5',
 },
 lg: {
 container: 'w-12 h-12 rounded-2xl',
 icon: 'w-6 h-6',
 },
 xl: {
 container: 'w-14 h-14 rounded-2xl',
 icon: 'w-7 h-7',
 },
};

export const IconTile: React.FC<IconTileProps> = ({
 tone = 'neutral',
 size = 'md',
 icon: Icon,
 children,
 className = '',
}) => {
 const toneStyle = TONE_STYLES[tone] || TONE_STYLES.neutral;
 const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

 return (
 <div
 className={`inline-flex items-center justify-center shrink-0 ${sizeStyle.container} ${toneStyle.container} ${className}`}
 >
 {Icon ? (
 <Icon className={`${sizeStyle.icon} ${toneStyle.iconColor}`} />
 ) : (
 children
 )}
 </div>
 );
};

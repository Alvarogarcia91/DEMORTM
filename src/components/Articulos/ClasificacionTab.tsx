import React, { useState } from 'react';
import { 
 FolderTree, 
 Folder, 
 Layers, 
 Tag, 
 Plus, 
 Edit2, 
 Check, 
 X,
 ChevronRight,
 Sparkles
} from 'lucide-react';
import { 
 MOCK_ARTICLE_CLASSES, 
 MOCK_ARTICLE_GROUPS, 
 MOCK_ARTICLE_SUBGROUPS, 
 ArticleClass, 
 ArticleGroup, 
 ArticleSubgroup 
} from '../../data/mockArticlesData';

interface ClasificacionTabProps {
 onShowToast: (message: string) => void;
}

export const ClasificacionTab: React.FC<ClasificacionTabProps> = ({ onShowToast }) => {
 const [classes, setClasses] = useState<ArticleClass[]>(MOCK_ARTICLE_CLASSES);
 const [groups, setGroups] = useState<ArticleGroup[]>(MOCK_ARTICLE_GROUPS);
 const [subgroups, setSubgroups] = useState<ArticleSubgroup[]>(MOCK_ARTICLE_SUBGROUPS);

 const [selectedClassId, setSelectedClassId] = useState<string>('all');
 const [selectedGroupId, setSelectedGroupId] = useState<string>('all');

 // Filtered lists
 const filteredGroups = selectedClassId === 'all'
 ? groups
 : groups.filter(g => g.classId === selectedClassId);

 const filteredSubgroups = selectedGroupId === 'all'
 ? subgroups
 : subgroups.filter(sg => sg.groupId === selectedGroupId);

 const toggleClassActive = (classId: string) => {
 setClasses(prev => prev.map(c => c.id === classId ? { ...c, isActive: !c.isActive } : c));
 onShowToast('Estado de clase actualizado correctamente');
 };

 const toggleGroupActive = (groupId: string) => {
 setGroups(prev => prev.map(g => g.id === groupId ? { ...g, isActive: !g.isActive } : g));
 onShowToast('Estado de grupo actualizado correctamente');
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 
 {/* Top Overview Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider">Clases Maestras</span>
 <p className="text-xl font-extrabold text-theme-main">{classes.length} clases</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
 <FolderTree className="w-5 h-5" />
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider">Grupos Operativos</span>
 <p className="text-xl font-extrabold text-theme-main">{groups.length} grupos</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-white text-blue-600 border border-blue-500 shadow-2xs flex items-center justify-center">
 <Folder className="w-5 h-5" />
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider">Subgrupos / Familias</span>
 <p className="text-xl font-extrabold text-theme-main">{subgroups.length} subgrupos</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 border border-emerald-600 shadow-2xs flex items-center justify-center">
 <Layers className="w-5 h-5" />
 </div>
 </div>
 </div>

 {/* Main Hierarchy 3-Column Split View (Like ADS Classification) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Column 1: Clases */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-5 shadow-xs space-y-4">
 <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
 <div className="flex items-center gap-2">
 <FolderTree className="w-4 h-4 text-theme-primary" />
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">1. Clases</h3>
 </div>
 <span className="text-[10px] text-theme-muted font-mono">{classes.length} regs</span>
 </div>

 <div className="space-y-2">
 <button
 onClick={() => {
 setSelectedClassId('all');
 setSelectedGroupId('all');
 }}
 className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
 selectedClassId === 'all'
 ? 'bg-theme-primary text-white shadow-xs font-bold'
 : 'bg-theme-muted/50 text-theme-main hover:bg-theme-muted'
 }`}
 >
 <span>(Todas las Clases)</span>
 <ChevronRight className="w-3.5 h-3.5 opacity-60" />
 </button>

 {classes.map((cls) => {
 const isSelected = selectedClassId === cls.id;
 return (
 <div
 key={cls.id}
 onClick={() => {
 setSelectedClassId(cls.id);
 setSelectedGroupId('all');
 }}
 className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
 isSelected
 ? 'border-theme-primary bg-theme-muted ring-2 ring-theme-primary/20 shadow-xs'
 : 'border-theme-subtle hover:border-theme-strong bg-theme-surface'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-full border border-rose-600 shadow-2xs">
 {cls.code}
 </span>
 <span className="text-[10px] text-theme-muted font-medium">
 {cls.totalArticles} artículos
 </span>
 </div>
 <p className="text-xs font-bold text-theme-main">{cls.name}</p>
 <p className="text-[11px] text-theme-muted leading-tight">{cls.description}</p>
 </div>
 );
 })}
 </div>
 </div>

 {/* Column 2: Grupos */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-5 shadow-xs space-y-4">
 <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
 <div className="flex items-center gap-2">
 <Folder className="w-4 h-4 text-blue-600" />
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">2. Grupos</h3>
 </div>
 <span className="text-[10px] text-theme-muted font-mono">{filteredGroups.length} regs</span>
 </div>

 <div className="space-y-2">
 <button
 onClick={() => setSelectedGroupId('all')}
 className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
 selectedGroupId === 'all'
 ? 'bg-blue-600 text-white shadow-xs font-bold'
 : 'bg-theme-muted/50 text-theme-main hover:bg-theme-muted'
 }`}
 >
 <span>(Todos los Grupos)</span>
 <ChevronRight className="w-3.5 h-3.5 opacity-60" />
 </button>

 {filteredGroups.map((grp) => {
 const isSelected = selectedGroupId === grp.id;
 return (
 <div
 key={grp.id}
 onClick={() => setSelectedGroupId(grp.id)}
 className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
 isSelected
 ? 'border-blue-600 bg-theme-muted ring-2 ring-blue-600/20 shadow-xs'
 : 'border-theme-subtle hover:border-theme-strong bg-theme-surface'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-full border border-blue-500 shadow-2xs">
 {grp.code}
 </span>
 <span className="text-[10px] text-theme-muted font-medium">
 {grp.totalArticles} artículos
 </span>
 </div>
 <p className="text-xs font-bold text-theme-main">{grp.name}</p>
 <p className="text-[11px] text-theme-muted leading-tight">{grp.description}</p>
 </div>
 );
 })}
 </div>
 </div>

 {/* Column 3: Subgrupos / Familias */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-5 shadow-xs space-y-4">
 <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
 <div className="flex items-center gap-2">
 <Layers className="w-4 h-4 text-emerald-600" />
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">3. Subgrupos</h3>
 </div>
 <span className="text-[10px] text-theme-muted font-mono">{filteredSubgroups.length} regs</span>
 </div>

 <div className="space-y-2">
 {filteredSubgroups.length === 0 ? (
 <div className="p-8 text-center text-xs text-theme-muted">
 No hay subgrupos definidos para este grupo.
 </div>
 ) : (
 filteredSubgroups.map((sub) => (
 <div
 key={sub.id}
 className="p-3 rounded-xl border border-theme-subtle bg-theme-surface space-y-1.5"
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-bold text-zinc-900 bg-white border border-emerald-600 px-2 py-0.5 rounded-full shadow-2xs">
 {sub.code}
 </span>
 <span className="text-[10px] text-theme-muted font-medium">
 {sub.totalArticles} artículos
 </span>
 </div>
 <p className="text-xs font-bold text-theme-main">{sub.name}</p>
 <p className="text-[11px] text-theme-muted leading-tight">{sub.description}</p>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 </div>
 );
};

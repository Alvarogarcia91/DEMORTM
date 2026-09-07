import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';

const money = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', notation: 'compact', maximumFractionDigits: 1 }).format(value);
const palette = ['#2450a4', '#008f6a', '#e69a20', '#7c3aed', '#db4b4b', '#1394b8'];
const tooltipStyle = { background: 'var(--theme-surface, white)', border: '1px solid var(--theme-subtle, #d9dce5)', borderRadius: 12, fontSize: 12 };

export type ChartOpportunity = { id:string; account:string; title:string; stage:string; amount:number; probability:number; days:number; risk:string; seller:string; line:string };

export const OpportunityFunnel = ({ opportunities, onStage }: { opportunities: ChartOpportunity[]; onStage: (stage:string)=>void }) => {
  const stages = ['Calificado', 'Levantamiento', 'Cotización', 'Negociación', 'Ganada'];
  const values = stages.map((stage, index) => ({ stage, amount: opportunities.filter(o => o.stage === stage).reduce((sum, o) => sum + o.amount, 0), count: opportunities.filter(o => o.stage === stage).length, fill: palette[index] }));
  const base = Math.max(...values.map(v => v.amount), 1);
  return <div className="space-y-3 pt-2">{values.map((item, index) => <button key={item.stage} onClick={() => onStage(item.stage)} className="group flex w-full items-center gap-3 text-left">
    <span className="w-24 text-[11px] font-bold">{item.stage}</span>
    <div className="flex-1"><div className="h-9 overflow-hidden rounded-lg bg-theme-muted"><div className="flex h-full items-center rounded-lg px-3 text-[11px] font-bold text-white transition-all group-hover:brightness-110" style={{ width: `${Math.max(18, item.amount / base * 100)}%`, background: item.fill }}>{item.count} oportunidades</div></div></div>
    <span className="w-24 text-right font-mono text-[11px]">{money(item.amount)}</span>
    <span className="w-10 text-right text-[10px] text-theme-muted">{index ? `${Math.round(item.amount / Math.max(values[index - 1].amount, 1) * 100)}%` : '100%'}</span>
  </button>)}</div>;
};

export const PipelineStageChart = ({ opportunities, onStage }: { opportunities: ChartOpportunity[]; onStage:(stage:string)=>void }) => {
  const stages = ['Calificado', 'Levantamiento', 'Cotización', 'Negociación', 'Ganada'];
  const data = stages.map((stage, index) => ({ stage, amount: opportunities.filter(o => o.stage === stage).reduce((sum, o) => sum + o.amount, 0), count: opportunities.filter(o => o.stage === stage).length, fill: palette[index] }));
  return <ResponsiveContainer width="100%" height={270}><BarChart data={data} margin={{ top: 12, right: 10, left: 8, bottom: 10 }} onClick={(event:any) => event?.activePayload?.[0] && onStage(event.activePayload[0].payload.stage)}><CartesianGrid vertical={false} stroke="var(--theme-subtle, #e5e7eb)" /><XAxis dataKey="stage" tick={{ fontSize: 10, fill: 'currentColor' }} /><YAxis tickFormatter={(v:any) => money(Number(v))} tick={{ fontSize: 10, fill: 'currentColor' }} width={58} /><Tooltip formatter={(value:any, _name:any, item:any) => [money(Number(value || 0)), `${item.payload.count} oportunidades`]} contentStyle={tooltipStyle} cursor={{ fill: 'rgba(36,80,164,.08)' }} /><Bar dataKey="amount" radius={[7,7,0,0]}>{data.map(item => <Cell key={item.stage} fill={item.fill} cursor="pointer" />)}</Bar></BarChart></ResponsiveContainer>;
};

const forecastData = [
  { month: 'Abr', target: 1050000, won: 780000, commit: 130000, best: 860000, forecast: 990000 },
  { month: 'May', target: 1080000, won: 820000, commit: 170000, best: 910000, forecast: 1080000 },
  { month: 'Jun', target: 1100000, won: 760000, commit: 220000, best: 1020000, forecast: 1140000 },
  { month: 'Jul', target: 1120000, won: 900000, commit: 190000, best: 1090000, forecast: 1210000 },
  { month: 'Ago', target: 1150000, won: 860000, commit: 260000, best: 1080000, forecast: 1200000 },
  { month: 'Sep', target: 1200000, won: 442000, commit: 410000, best: 960000, forecast: 1130000 },
];
export const ForecastChart = () => <ResponsiveContainer width="100%" height={270}><ComposedChart data={forecastData} margin={{ top: 12, right: 12, left: 8, bottom: 5 }}><CartesianGrid vertical={false} stroke="var(--theme-subtle, #e5e7eb)"/><XAxis dataKey="month" tick={{fontSize:10,fill:'currentColor'}}/><YAxis tickFormatter={(v:any)=>money(Number(v))} tick={{fontSize:10,fill:'currentColor'}} width={58}/><Tooltip contentStyle={tooltipStyle} formatter={(v:any)=>money(Number(v || 0))}/><Legend wrapperStyle={{fontSize:11}}/><Bar dataKey="won" name="Cerrado ganado" fill="#008f6a" radius={[5,5,0,0]}/><Bar dataKey="commit" name="Commit" fill="#e69a20" radius={[5,5,0,0]}/><Line type="monotone" dataKey="target" name="Objetivo demo" stroke="#2450a4" strokeWidth={3} dot={false}/><Line type="monotone" dataKey="forecast" name="Forecast" stroke="#7c3aed" strokeWidth={3} dot={{r:3}}/></ComposedChart></ResponsiveContainer>;

export const LeadOriginChart = ({ onOrigin }: { onOrigin:(origin:string)=>void }) => {
  const data = [{ name:'Referido', value:5 }, { name:'Sitio web', value:4 }, { name:'Prospección', value:4 }, { name:'Evento / feria', value:3 }, { name:'Cliente existente', value:3 }];
  return <div className="relative h-[270px]"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={93} paddingAngle={3} onClick={(item:any)=>onOrigin(item.name)}>{data.map((item,index)=><Cell key={item.name} fill={palette[index]} cursor="pointer"/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend wrapperStyle={{fontSize:10}} layout="vertical" verticalAlign="middle" align="right"/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pr-24"><b className="text-xl">19</b><span className="text-[10px] text-theme-muted">prospectos</span></div></div>;
};

export const ActivityChart = () => {
  const data = [['Lun',4,2,1,1],['Mar',5,1,2,1],['Mié',3,3,1,2],['Jue',6,2,2,1],['Vie',4,2,3,2],['Sáb',1,0,0,1],['Dom',0,0,0,0]].map(([day,calls,meetings,followups,visits])=>({day,calls,meetings,followups,visits}));
  return <ResponsiveContainer width="100%" height={270}><BarChart data={data} margin={{top:12,right:8,left:-18,bottom:5}}><CartesianGrid vertical={false} stroke="var(--theme-subtle, #e5e7eb)"/><XAxis dataKey="day" tick={{fontSize:10,fill:'currentColor'}}/><YAxis allowDecimals={false} tick={{fontSize:10,fill:'currentColor'}}/><Tooltip contentStyle={tooltipStyle}/><Legend wrapperStyle={{fontSize:10}}/><Bar dataKey="calls" name="Llamadas" stackId="activity" fill="#2450a4"/><Bar dataKey="meetings" name="Reuniones" stackId="activity" fill="#008f6a"/><Bar dataKey="followups" name="Seguimientos" stackId="activity" fill="#e69a20"/><Bar dataKey="visits" name="Visitas" stackId="activity" fill="#7c3aed" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>;
};

export const OpportunityBubbleChart = ({ opportunities, onOpen }: { opportunities: ChartOpportunity[]; onOpen:(id:string)=>void }) => {
  const data = opportunities.filter(o=>!['Ganada','Perdida'].includes(o.stage)).map(o=>({...o, closeDays: Math.max(4, 38-o.days*2), size: Math.max(16, o.amount/9000), fill: o.risk==='Crítico'?'#db4b4b':o.risk==='Alto'?'#e69a20':'#2450a4'}));
  return <ResponsiveContainer width="100%" height={310}><ScatterChart margin={{top:18,right:18,bottom:8,left:0}} onClick={(event:any)=>event?.activePayload?.[0] && onOpen(event.activePayload[0].payload.id)}><CartesianGrid stroke="var(--theme-subtle, #e5e7eb)"/><XAxis dataKey="probability" name="Probabilidad" unit="%" type="number" domain={[0,100]} tick={{fontSize:10,fill:'currentColor'}}/><YAxis dataKey="closeDays" name="Días a cierre demo" type="number" tick={{fontSize:10,fill:'currentColor'}} width={75}/><ZAxis dataKey="size" range={[90,900]} name="Monto"/><Tooltip contentStyle={tooltipStyle} cursor={{strokeDasharray:'3 3'}} formatter={(value:any,name:any)=>name==='Monto'?money(Number(value)*9000):value} labelFormatter={(_:any,payload:any)=>payload?.[0]?.payload ? `${payload[0].payload.account} · ${payload[0].payload.title}` : ''}/><Scatter data={data}>{data.map(item=><Cell key={item.id} fill={item.fill} fillOpacity={.82} cursor="pointer"/>)}</Scatter></ScatterChart></ResponsiveContainer>;
};

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatMoney, getCumulativeBalance, getMonthlyExpense, getMonthlyIncome, getMonthlyNet, getTransactionsByMonth } from '../utils/finance';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isSameMonth, subMonths, addMonths, format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function Dashboard() {
  const currentDateState = useState(new Date());
  const currentDate = currentDateState[0];
  const setCurrentDate = currentDateState[1];
  const transactions = useStore(state => state.transactions);
  const userName = useStore(state => state.userName);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  const isCurrentMonth = isSameMonth(currentDate, new Date());

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (!parts.length || !parts[0]) return '👤';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const monthlyTxs = getTransactionsByMonth(transactions, currentDate);
  const income = getMonthlyIncome(transactions, currentDate);
  const expense = getMonthlyExpense(transactions, currentDate);
  const net = getMonthlyNet(transactions, currentDate);
  const cumulative = getCumulativeBalance(transactions, currentDate);

  const recentTxs = [...monthlyTxs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div className="pt-4 pb-8">
      {/* Header */}
      <header className="px-5 py-2 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-primary font-display tracking-tight">VekilHarç</h1>
          <p className="text-secondary text-xs mt-0.5 font-medium">Hoş geldin, {userName.split(' ')[0]}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
          {getInitials(userName)}
        </div>
      </header>

      {/* Month Selector */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-on-surface capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: tr })}
          </span>
          <button 
            onClick={nextMonth} 
            disabled={isCurrentMonth}
            className={`p-1 rounded-full transition-colors ${isCurrentMonth ? 'text-slate-200' : 'hover:bg-slate-50 text-slate-500'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="px-5 mb-6 grid grid-cols-2 gap-4">
        
        {/* Cumulative Balance Card */}
        <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-outline-variant flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Kümülatif Bakiye</span>
            </div>
            <h2 className="text-4xl font-bold font-display mt-4 tracking-tight">{formatMoney(cumulative)}</h2>
            <p className="text-secondary text-sm mt-1">Tüm ayların toplam birikimi</p>
          </div>
          <div className="h-16 flex items-end space-x-1.5 mt-8">
            <div className="flex-1 bg-primary h-1/2 rounded-t-sm opacity-20"></div>
            <div className="flex-1 bg-primary h-2/3 rounded-t-sm opacity-40"></div>
            <div className="flex-1 bg-primary h-3/4 rounded-t-sm opacity-60"></div>
            <div className="flex-1 bg-primary h-full rounded-t-sm opacity-100"></div>
            <div className="flex-1 bg-primary h-4/5 rounded-t-sm opacity-80"></div>
            <div className="flex-1 bg-primary h-5/6 rounded-t-sm opacity-90"></div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="col-span-1 bg-primary rounded-3xl p-5 text-white shadow-lg flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Aylık Gelir</span>
          <h3 className="text-xl font-bold font-display mt-2">{formatMoney(income)}</h3>
          <div className="mt-4 bg-white/20 p-2.5 rounded-xl">
            <p className="text-[10px]">Net: <span className="font-bold">{formatMoney(net)}</span></p>
          </div>
        </div>

        {/* Monthly Expense */}
        <div className="col-span-1 bg-white rounded-3xl p-5 shadow-sm border border-outline-variant flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Aylık Gider</span>
          <h3 className="text-xl font-bold font-display mt-2 text-error">{formatMoney(expense)}</h3>
          <div className="mt-4 flex justify-between items-center gap-2">
             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-error h-full" style={{ width: expense > 0 && income > 0 ? `${Math.min((expense/income)*100, 100)}%` : '0%' }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-5">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-semibold text-on-surface">Son İşlemler</h3>
        </div>
        
        {recentTxs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
            <p className="text-slate-400 font-medium">Bu aya ait işlem bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTxs.map(tx => {
              const isIncome = tx.type === 'income';
              
              return (
                <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {tx.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{tx.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold font-display ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                      {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{isIncome ? 'Gelen' : 'Giden'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

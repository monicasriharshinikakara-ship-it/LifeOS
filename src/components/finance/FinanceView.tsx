import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  DollarSign,
  TrendingUp,
  Plus,
  Target,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  X,
} from 'lucide-react';
import { PlannedPurchase } from '../../types/lifeos';

export const FinanceView: React.FC = () => {
  const { lifeState, addPlannedPurchase, askAI, setActiveSection } = useLifeOS();
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);

  // New purchase state
  const [purchaseTitle, setPurchaseTitle] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState(65000);
  const [targetMonths, setTargetMonths] = useState(3);
  const [purchaseCategory, setPurchaseCategory] = useState('Career Hardware');

  const { monthlyIncome, monthlyExpenses, expenseCategories, savingsGoal, plannedPurchases } = lifeState.finance;
  const remainingSurplus = monthlyIncome - monthlyExpenses;
  const savingsPct = Math.min(100, Math.round((savingsGoal.currentAmount / savingsGoal.targetAmount) * 100));

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseTitle.trim()) return;

    addPlannedPurchase({
      title: purchaseTitle,
      amount: purchaseAmount,
      targetMonths,
      category: purchaseCategory,
    });

    setPurchaseTitle('');
    setShowPurchaseModal(false);
  };

  const handleConsultAIAboutPurchase = (itemTitle: string, amount: number, months: number) => {
    setActiveSection('ai');
    askAI(`I want to buy ${itemTitle} in ${months} months for ₹${amount.toLocaleString()}. Can you check my budget and tell me if it fits my savings plan?`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Personal Financial Planning</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DDF3E4] text-emerald-900">
              Budget & Safety Buffer
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Personal planning for goals and career hardware. Not a banking app or financial advice.
          </p>
        </div>

        <button
          onClick={() => setShowPurchaseModal(true)}
          className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Add Planned Purchase</span>
        </button>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Monthly Income</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">₹{monthlyIncome.toLocaleString()}</p>
          <p className="text-[10px] text-stone-400">Stipend / Support</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Monthly Expenses</span>
            <div className="p-1.5 rounded-xl bg-rose-50 text-rose-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">₹{monthlyExpenses.toLocaleString()}</p>
          <p className="text-[10px] text-stone-400">{expenseCategories.length} categories tracked</p>
        </div>

        {/* Remaining Surplus */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Monthly Surplus</span>
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">₹{remainingSurplus.toLocaleString()}</p>
          <p className="text-[10px] text-stone-400">Available to allocate</p>
        </div>

        {/* Savings Goal Progress */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Savings Progress</span>
            <div className="p-1.5 rounded-xl bg-purple-50 text-purple-700">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{savingsPct}%</p>
          <p className="text-[10px] text-stone-400">₹{savingsGoal.currentAmount.toLocaleString()} / ₹{savingsGoal.targetAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Middle Row: Expenses Breakdown & Savings Goal Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expense Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Expense Allocation
          </h3>

          <div className="space-y-3">
            {expenseCategories.map((item, idx) => {
              const pct = Math.round((item.amount / monthlyExpenses) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-stone-700">{item.category}</span>
                    <span className="font-bold text-stone-900">
                      ₹{item.amount.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-stone-800 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Your living expenses are stabilized under 65% of income, ensuring you can maintain study routines without financial distraction.
            </p>
          </div>
        </div>

        {/* Savings Goal Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DDF3E4] text-emerald-900 border border-emerald-200">
                Primary Savings Goal
              </span>
              <span className="text-xs text-stone-400">Target Date: {savingsGoal.targetDate}</span>
            </div>

            <h3 className="text-lg font-extrabold text-stone-900">{savingsGoal.title}</h3>

            <div className="p-4 rounded-2xl bg-[#DDF3E4]/30 border border-emerald-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-600">Saved: ₹{savingsGoal.currentAmount.toLocaleString()}</span>
                <span className="font-extrabold text-stone-900">Goal: ₹{savingsGoal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-emerald-200/60 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${savingsPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                <span>Remaining: ₹{(savingsGoal.targetAmount - savingsGoal.currentAmount).toLocaleString()}</span>
                <span className="font-semibold text-emerald-800">~1.2 months at current surplus</span>
              </div>
            </div>
          </div>

          {/* AI Connection Note */}
          <div className="p-3.5 rounded-2xl bg-[#E9DDFB]/30 border border-purple-200/60 flex items-center justify-between text-xs text-purple-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>LifeOS checks surplus before approving large purchases</span>
            </div>
            <button
              onClick={() => {
                setActiveSection('ai');
                askAI('How is my savings goal progressing relative to my living costs?');
              }}
              className="text-[11px] font-bold underline text-purple-900"
            >
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* Planned Purchases Section */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-600" />
              <span>Planned Life & Career Purchases</span>
            </h3>
            <p className="text-xs text-stone-500">
              Items you want to acquire (e.g. Laptop, Certifications, Workspace gear)
            </p>
          </div>

          <button
            onClick={() => handleConsultAIAboutPurchase('a new laptop', 70000, 3)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FFF9F2] hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Scenario: "Buy Laptop in 3 Mo"</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedPurchases.map((purchase) => {
            const purchaseProgress = Math.round((purchase.savedSoFar / purchase.amount) * 100);
            return (
              <div
                key={purchase.id}
                className="p-4 rounded-2xl border border-stone-200 hover:border-purple-200 bg-stone-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      {purchase.category}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-1">{purchase.title}</h4>
                  </div>
                  <span className="text-sm font-extrabold text-stone-900">
                    ₹{purchase.amount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Funded: ₹{purchase.savedSoFar.toLocaleString()}</span>
                    <span className="font-bold text-stone-700">{purchaseProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${purchaseProgress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
                  <span className="text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    Target: {purchase.targetMonths} Months
                  </span>
                  <button
                    onClick={() => handleConsultAIAboutPurchase(purchase.title, purchase.amount, purchase.targetMonths)}
                    className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <span>Analyze with AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Planned Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-stone-900">Add Planned Purchase</h3>
              </div>
              <button onClick={() => setShowPurchaseModal(false)} className="p-1 rounded-xl text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPurchase} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Developer Laptop, Standing Desk, Course..."
                  value={purchaseTitle}
                  onChange={(e) => setPurchaseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Timeline</label>
                  <select
                    value={targetMonths}
                    onChange={(e) => setTargetMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    <option value={1}>1 Month</option>
                    <option value={2}>2 Months</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={purchaseCategory}
                  onChange={(e) => setPurchaseCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
                >
                  Add to Budget Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

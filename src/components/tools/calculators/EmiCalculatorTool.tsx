import React, { useState } from 'react';
import { Coins, PieChart, Table, ArrowRight } from 'lucide-react';

export const EmiCalculatorTool: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [showSchedule, setShowSchedule] = useState(false);

  const totalMonths = tenureType === 'years' ? tenureYears * 12 : tenureYears;
  const monthlyRate = interestRate / 12 / 100;

  let emi = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else if (totalMonths > 0) {
    emi = loanAmount / totalMonths;
  }

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const principalPercent = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const generateAmortization = () => {
    const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
    let balance = loanAmount;
    for (let m = 1; m <= Math.min(60, totalMonths); m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({
        month: m,
        principal: Math.round(principalPart),
        interest: Math.round(interestPart),
        balance: Math.round(balance),
      });
    }
    return schedule;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      {/* Inputs & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Loan Amount</span>
              <span className="text-blue-600 font-extrabold text-sm">${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="10000000"
              step="5000"
              value={loanAmount}
              onChange={e => setLoanAmount(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Annual Interest Rate (%)</span>
              <span className="text-blue-600 font-extrabold text-sm">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Loan Tenure</span>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-extrabold text-sm">{tenureYears} {tenureType}</span>
                <button
                  type="button"
                  onClick={() => setTenureType(tenureType === 'years' ? 'months' : 'years')}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-bold"
                >
                  Switch to {tenureType === 'years' ? 'Months' : 'Years'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max={tenureType === 'years' ? 30 : 360}
              step="1"
              value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {/* Results Card & Ratio Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly EMI</span>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 mt-1">
              ${Math.round(emi).toLocaleString()}
            </div>
            <span className="text-xs text-slate-500">Payable every month for {totalMonths} months</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Principal ({principalPercent.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                Interest ({interestPercent.toFixed(1)}%)
              </span>
            </div>

            {/* Proportion Bar */}
            <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div style={{ width: `${principalPercent}%` }} className="bg-blue-600 h-full" />
              <div style={{ width: `${interestPercent}%` }} className="bg-indigo-400 h-full" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
              <div>
                <span className="text-slate-500 block">Total Interest</span>
                <span className="font-bold text-slate-800 text-sm">${Math.round(totalInterest).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Payment</span>
                <span className="font-bold text-slate-800 text-sm">${Math.round(totalPayment).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table Toggle */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          <Table className="w-4 h-4" />
          <span>{showSchedule ? 'Hide Amortization Schedule' : 'View First 60 Months Amortization Schedule'}</span>
        </button>

        {showSchedule && (
          <div className="mt-4 overflow-x-auto max-h-72 border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Principal (A)</th>
                  <th className="p-3">Interest (B)</th>
                  <th className="p-3">Total (A+B)</th>
                  <th className="p-3">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {generateAmortization().map(row => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="p-3 font-sans font-bold text-slate-800">Month {row.month}</td>
                    <td className="p-3 text-emerald-600">${row.principal.toLocaleString()}</td>
                    <td className="p-3 text-indigo-600">${row.interest.toLocaleString()}</td>
                    <td className="p-3 font-bold text-slate-800">${Math.round(emi).toLocaleString()}</td>
                    <td className="p-3 text-slate-600">${row.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

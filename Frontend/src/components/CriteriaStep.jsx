import { useState } from 'react';
import { Filter, ChevronRight, ChevronLeft, CheckCircle2, Database, Settings2 } from 'lucide-react';

export default function CriteriaStep({ criteria, setCriteria, batch, setBatch, availableBatches, companyName, setCompanyName, onNext, onBack }) {
    const [showCompanyError, setShowCompanyError] = useState(false);

    const fields = [
        { label: '10th Percentage', key: 'ten', icon: Database, color: 'text-purple-600' },
        { label: '12th Percentage', key: 'twelve', icon: Database, color: 'text-blue-600' },
        { label: 'Diploma Percentage', key: 'dip', icon: Database, color: 'text-purple-600' },
        { label: 'Minimum CGPA', key: 'minCgpa', icon: CheckCircle2, color: 'text-blue-600' },
        { label: 'Current Arrears', key: 'currArr', icon: Settings2, color: 'text-blue-600' },
        { label: 'History of Arrears', key: 'histArr', icon: Settings2, color: 'text-purple-600' },
    ];

    const handleNext = () => {
        if (!companyName || companyName.trim() === '') {
            setShowCompanyError(true);
            return;
        }
        setShowCompanyError(false);
        onNext();
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-lg px-8 py-10">
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-md">
                            <Filter className="w-9 h-9" />
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                                Set Criteria
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Choose eligibility rules for this drive.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[220px]">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Batch</label>
                            <select
                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {(!availableBatches || availableBatches.length === 0) && (
                                    <option value="">No batches available</option>
                                )}
                                {availableBatches && availableBatches.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Company Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => {
                                    setCompanyName(e.target.value);
                                    if (showCompanyError && e.target.value.trim() !== '') setShowCompanyError(false);
                                }}
                                placeholder="Enter company name"
                                className={`w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    showCompanyError
                                        ? 'border-red-500 text-red-900 placeholder-red-400 focus:border-red-500'
                                        : 'border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                                }`}
                            />
                            {showCompanyError && (
                                <p className="text-xs text-red-600 mt-1">Company name is required.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {fields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <field.icon className={`w-5 h-5 ${field.color}`} />
                                {field.label}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={criteria[field.key]}
                                onChange={e => setCriteria({ ...criteria, [field.key]: parseFloat(e.target.value) || 0 })}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onBack}
                        className="rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 text-base font-semibold flex items-center gap-2 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                        Continue to Selection
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

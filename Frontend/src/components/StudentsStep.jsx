import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StudentsStep({
    filteredStudents,
    selectedStudents,
    setSelectedStudents,
    searchQuery,
    setSearchQuery,
    onBack,
    onNext
}) {

    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(sid => sid !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleSelectAll = () => {
        const allIds = filteredStudents.map((s) => s.id);
        const eligibleIds = filteredStudents.filter((s) => s.eligible).map((s) => s.id);
        const allSelected = allIds.length > 0 && allIds.every((id) => selectedStudents.includes(id));

        if (allSelected) {
            // Keep criteria-eligible students selected, remove only extra ones
            setSelectedStudents(eligibleIds);
        } else {
            // Select all visible students (eligible + manual)
            setSelectedStudents(allIds);
        }
    };

    const allCurrentlySelected =
        filteredStudents.length > 0 &&
        filteredStudents.every((s) => selectedStudents.includes(s.id));

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-lg px-8 py-8 h-[70vh] flex flex-col">
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-md">
                            <Users className="w-9 h-9" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Student Selection
                        </h3>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-11 pr-4 py-2 rounded-xl border border-slate-300 w-72 text-sm md:text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span>
                                <span className="font-semibold">Selected:</span> {selectedStudents.length}
                            </span>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="rounded-xl border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                {allCurrentlySelected ? 'Clear All' : 'Select All'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto rounded-2xl border border-slate-200">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">Select</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">Registration</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">CGPA</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">10th %</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">12th %</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredStudents.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 align-middle">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(s.id)}
                                            onChange={() => toggleStudent(s.id)}
                                            className="w-5 h-5 rounded cursor-pointer border-slate-300 text-blue-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3 align-middle font-semibold text-slate-900">{s.name}</td>
                                    <td className="px-4 py-3 align-middle text-slate-600 font-mono">{s.reg}</td>
                                    <td className="px-4 py-3 align-middle font-semibold text-blue-600">{s.cgpa}</td>
                                    <td className="px-4 py-3 align-middle text-slate-700">{s.ten}%</td>
                                    <td className="px-4 py-3 align-middle text-slate-700">{s.twelve}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center pt-6">
                    <button
                        onClick={onBack}
                        className="text-slate-600 hover:text-slate-900 text-base font-semibold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold shadow-md transition-colors"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

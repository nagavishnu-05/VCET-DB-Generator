import { useState } from 'react';
import { FileSpreadsheet, ChevronLeft, Columns3 } from 'lucide-react';

const AVAILABLE_COLUMNS = [
  { key: 'registerNo',       label: 'Register No' },
  { key: 'name',             label: 'Name' },
  { key: 'gender',           label: 'Gender' },
  { key: 'college',          label: 'College' },
  { key: 'department',       label: 'Department' },
  { key: 'dob_ddMmmYyyy',    label: 'DOB (dd-Mmm-yyyy)' },
  { key: 'dob_ddMmYyyy',     label: 'DOB (dd-MM-yyyy)' },
  { key: 'motherTongue',     label: 'Mother Tongue' },
  { key: 'yearOfGraduation', label: 'Year of Graduation' },
  { key: 'xPercentage',      label: '10th Percentage' },
  { key: 'xiiPercentage',    label: '12th Percentage' },
  { key: 'diplomaPercentage',label: 'Diploma Percentage' },
  { key: 'cgpa',             label: 'CGPA' },
  { key: 'standingArrears',  label: 'Standing Arrears' },
  { key: 'historyOfArrears', label: 'History of Arrears' },
  { key: 'primaryEmail',     label: 'Primary Email' },
  { key: 'alternateEmail',   label: 'Alternate Email' },
  { key: 'mobile1',          label: 'Mobile 1' },
  { key: 'mobile2',          label: 'Mobile 2' }
];

export default function ColumnsStep({ selectedColumns, setSelectedColumns, onBack, onExport }) {
  const [dragKey, setDragKey] = useState(null);
  const allSelected = AVAILABLE_COLUMNS.every((c) => selectedColumns.includes(c.key));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(AVAILABLE_COLUMNS.map((c) => c.key));
    }
  };

  const handleMoveToSelected = (key) => {
    if (!selectedColumns.includes(key)) {
      setSelectedColumns([...selectedColumns, key]);
    }
  };

  const handleMoveToAvailable = (key) => {
    if (selectedColumns.includes(key)) {
      setSelectedColumns(selectedColumns.filter((k) => k !== key));
    }
  };

  const handleDragStart = (key) => {
    setDragKey(key);
  };

  const handleDragOver = (event, targetKey) => {
    event.preventDefault();
    if (!dragKey || dragKey === targetKey) return;

    const fromIndex = selectedColumns.indexOf(dragKey);
    const toIndex = selectedColumns.indexOf(targetKey);
    if (fromIndex === -1 || toIndex === -1) return;

    const updated = [...selectedColumns];
    updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, dragKey);
    setSelectedColumns(updated);
  };

  const handleDragEnd = () => {
    setDragKey(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-lg px-8 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md">
            <Columns3 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
              Choose Columns
            </h3>
            <p className="text-slate-500 text-xs md:text-sm mt-1">
              Select the fields to include in the final Excel report.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-5 text-xs md:text-sm text-slate-600 flex flex-col gap-1">
          <span className="font-semibold text-slate-700">Note</span>
          <span>
            <span className="font-semibold">S.No</span> is generated automatically based on the order of selected students.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Selected Columns */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Selected Columns</h4>
            <div className="min-h-[80px] max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 flex flex-col gap-2">
              {selectedColumns.length === 0 && (
                <p className="text-xs text-slate-400">No columns selected yet.</p>
              )}
              {selectedColumns.map((key) => {
                const col = AVAILABLE_COLUMNS.find((c) => c.key === key);
                if (!col) return null;
                return (
                  <button
                    key={col.key}
                    type="button"
                    draggable
                    onDragStart={() => handleDragStart(col.key)}
                    onDragOver={(e) => handleDragOver(e, col.key)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleMoveToAvailable(col.key)}
                    className="w-full flex items-center justify-between rounded-xl bg-white px-3 py-1.5 text-xs md:text-sm text-slate-700 border border-slate-200 hover:bg-slate-100"
                  >
                    <span>{col.label}</span>
                    <span className="text-[10px] text-slate-400">Remove</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Columns */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Available Columns</h4>
            <div className="min-h-[80px] max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white px-3 py-2 flex flex-col gap-2">
              {AVAILABLE_COLUMNS.filter((c) => !selectedColumns.includes(c.key)).length === 0 && (
                <p className="text-xs text-slate-400">All columns are selected.</p>
              )}
              {AVAILABLE_COLUMNS.filter((c) => !selectedColumns.includes(c.key)).map((col) => (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => handleMoveToSelected(col.key)}
                  className="w-full flex items-center justify-between rounded-xl bg-slate-50 px-3 py-1.5 text-xs md:text-sm text-slate-700 border border-slate-100 hover:bg-slate-100"
                >
                  <span>{col.label}</span>
                  <span className="text-[10px] text-slate-400">Add</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-sm font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {allSelected ? 'Clear All' : 'Select All'}
            </button>
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-semibold shadow-md transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Generate Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

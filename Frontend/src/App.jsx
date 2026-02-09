import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { Database, FileSpreadsheet, ChevronRight } from 'lucide-react';
import AuthStep from "./components/AuthStep";
import CriteriaStep from "./components/CriteriaStep";
import StudentsStep from "./components/StudentsStep";
import ColumnsStep from "./components/ColumnsStep";

export default function App() {
  const [step, setStep] = useState('LANDING');
  const [criteria, setCriteria] = useState({
    ten: 80,
    twelve: 80,
    dip: 80,
    minCgpa: 8,
    currArr: 0,
    histArr: 0
  });
  const [batch, setBatch] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "registerNo",
    "name",
    "xPercentage",
    "xiiPercentage",
    "diplomaPercentage",
    "cgpa",
    "standingArrears",
    "historyOfArrears",
    "primaryEmail",
    "mobile1"
  ]);

  // Load available batches once
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/batches');
        if (!res.ok) throw new Error('Failed to load batches');
        const data = await res.json();
        setAvailableBatches(data || []);
        if (!batch && data && data.length > 0) {
          setBatch(data[0]);
        }
      } catch (err) {
        console.error(err);
        setAvailableBatches([]);
      }
    };

    fetchBatches();
  }, []);

  // Load students from backend whenever batch changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        setStudentsError("");
        if (!batch) {
          setStudents([]);
          setStudentsLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/students?batch=${encodeURIComponent(batch)}`);
        if (!res.ok) {
          throw new Error('Failed to load students');
        }
        const data = await res.json();
        setStudents(data || []);
      } catch (err) {
        setStudentsError(err.message || 'Failed to load students');
        setStudents([]);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [batch]);

  // Calculate eligibility based on criteria
  const processedStudents = useMemo(() => {
    return students.map(student => ({
      ...student,
      eligible: (
        student.cgpa >= criteria.minCgpa &&
        student.ten >= criteria.ten &&
        (student.twelve ? student.twelve >= criteria.twelve : true) &&
        (student.dip ? student.dip >= criteria.dip : true) &&
        student.currentArr <= criteria.currArr &&
        student.histArr <= criteria.histArr
      )
    }))
  }, [students, criteria]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    return processedStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.reg.includes(searchQuery)
    );
  }, [processedStudents, searchQuery]);

  // Initialize selection with eligible students
  const handleToSelection = () => {
    const eligibleIds = processedStudents.filter(s => s.eligible).map(s => s.id)
    setSelectedStudents(eligibleIds)
    setStep('STUDENTS')
  }

  // Export to Excel
  const handleExport = () => {
    const selectedList = filteredStudents.filter(s => selectedStudents.includes(s.id));

    const columnConfig = {
      sno: {
        label: 'S.No',
        value: (_s, index) => index + 1
      },
      registerNo: {
        label: 'Register No',
        value: (s) => s.registerNo
      },
      name: {
        label: 'Name',
        value: (s) => s.name
      },
      gender: {
        label: 'Gender',
        value: (s) => s.gender
      },
      college: {
        label: 'College',
        value: (s) => s.college
      },
      department: {
        label: 'Department',
        value: (s) => s.dept
      },
      xPercentage: {
        label: '10th %',
        value: (s) => s.xPercentage
      },
      xiiPercentage: {
        label: '12th %',
        value: (s) => s.xiiPercentage
      },
      diplomaPercentage: {
        label: 'Diploma %',
        value: (s) => s.diplomaPercentage
      },
      cgpa: {
        label: 'CGPA',
        value: (s) => s.cgpa
      },
      standingArrears: {
        label: 'Standing Arrears',
        value: (s) => s.standingArrears
      },
      historyOfArrears: {
        label: 'History of Arrears',
        value: (s) => s.historyOfArrears
      },
      dob_ddMmmYyyy: {
        label: 'DOB (dd-Mmm-yyyy)',
        value: (s) => s.dob_ddMmmYyyy
      },
      dob_ddMmYyyy: {
        label: 'DOB (dd-MM-yyyy)',
        value: (s) => s.dob_ddMmYyyy
      },
      motherTongue: {
        label: 'Mother Tongue',
        value: (s) => s.motherTongue
      },
      yearOfGraduation: {
        label: 'Year of Graduation',
        value: (s) => s.yearOfGraduation
      },
      primaryEmail: {
        label: 'Primary Email',
        value: (s) => s.primaryEmail
      },
      alternateEmail: {
        label: 'Alternate Email',
        value: (s) => s.alternateEmail
      },
      mobile1: {
        label: 'Mobile 1',
        value: (s) => s.mobile1
      },
      mobile2: {
        label: 'Mobile 2',
        value: (s) => s.mobile2 || ''
      }
    };

    const dataToExport = selectedList.map((s, index) => {
      const row = {};

      // Always include S.No first
      row[columnConfig.sno.label] = columnConfig.sno.value(s, index);

      // Then include the user-selected columns
      selectedColumns.forEach((key) => {
        const config = columnConfig[key];
        if (config) {
          row[config.label] = config.value(s, index);
        }
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    ws['!cols'] = new Array(dataToExport[0] ? Object.keys(dataToExport[0]).length : 10).fill({ wch: 20 });
    const year = new Date().getFullYear();
    const safeCompany = companyName ? companyName.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') : 'Company';
    XLSX.writeFile(wb, `${safeCompany}_${batch}_VCET_Student_DB_${year}.xlsx`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Simple centered header */}
      <header className="w-full py-5 px-6 border-b border-slate-200 bg-white flex justify-center">
        <div className="max-w-5xl w-full flex items-center justify-center gap-8">
          <div className="flex-shrink-0">
            <img
              src="/vcet-logo.jpg"
              alt="VCET Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Velammal College of Engineering and Technology
            </h1>
            <p className="text-sm md:text-base font-medium text-slate-600 mt-1">
              Department of Computer Science & Engineering
            </p>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              An automated platform for Student DB generation for Placement
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/cse-logo.jpg"
              alt="CSE Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center p-6">
        {step === 'LANDING' && (
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg px-8 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-6 mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                    <Database className="w-9 h-9" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                    Student Database Generator
                  </h2>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setStep('AUTH')}
                  className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 shadow-md transition-colors"
                >
                  <FileSpreadsheet className="w-6 h-6" />
                  Generate Report
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'AUTH' && (
          <AuthStep
            onNext={() => setStep('CRITERIA')}
            onBack={() => setStep('LANDING')}
          />
        )}

        {step === 'CRITERIA' && (
          <CriteriaStep
            criteria={criteria}
            setCriteria={setCriteria}
            batch={batch}
            setBatch={setBatch}
            availableBatches={availableBatches}
            companyName={companyName}
            setCompanyName={setCompanyName}
            onNext={handleToSelection}
            onBack={() => setStep('AUTH')}
          />
        )}

        {step === 'STUDENTS' && (
          <StudentsStep
            filteredStudents={filteredStudents}
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onBack={() => setStep('CRITERIA')}
            onNext={() => setStep('COLUMNS')}
          />
        )}

        {step === 'COLUMNS' && (
          <ColumnsStep
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            onBack={() => setStep('STUDENTS')}
            onExport={handleExport}
          />
        )}
      </main>
    </div>
  );
}

import { Database, FileSpreadsheet, ChevronRight } from 'lucide-react';

export default function LandingStep({ onNext }) {
    return (
        <div className="w-full max-w-4xl animate-fade-in-up" id="student-db-main">
            <div className="professional-card px-10 py-14 text-center relative overflow-visible">
                {/* Icon and Title */}
                <div className="mb-10 relative z-10">
                    <div className="flex items-center justify-center gap-5 mb-6">
                        <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl shadow-xl">
                            <Database className="w-10 h-10 text-white" />
                        </div>
                        <h2
                            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient-shift"
                            style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}
                        >
                            Student Database Generator
                        </h2>
                    </div>
                </div>

                {/* Primary CTA Button */}
                <div className="flex justify-center relative z-10">
                    <button
                        onClick={onNext}
                        className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white py-5 px-12 rounded-2xl text-xl md:text-2xl font-black flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)] hover:scale-105 transform overflow-hidden bg-[length:200%_auto] animate-gradient-shift"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        <FileSpreadsheet className="w-7 h-7 md:w-8 md:h-8 transform group-hover:rotate-12 transition-transform duration-300" />
                        Generate Report
                        <ChevronRight className="w-7 h-7 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
}

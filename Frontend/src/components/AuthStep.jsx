import { useEffect, useState } from 'react';
import { Lock, Users, Shield } from 'lucide-react';

export default function AuthStep({ onNext, onBack }) {
    const [staffs, setStaffs] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/staffs');
                if (!res.ok) throw new Error('Failed to load staffs');
                const data = await res.json();
                setStaffs(data || []);
            } catch (err) {
                console.error(err);
                setStaffs([]);
            }
        };

        fetchStaffs();
    }, []);

    const handleVerify = async () => {
        try {
            setError('');
            const res = await fetch('http://localhost:5000/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ staffName: selectedStaff, code }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.message || 'Verification failed');
                return;
            }

            onNext();
        } catch (err) {
            setError('Verification failed');
        }
    };
    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-lg px-8 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-md">
                        <Lock className="w-9 h-9" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Staff Verification
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Secure Access Control
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Staff Name
                        </label>
                        <select
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Staff</option>
                            {staffs.map((s) => (
                                <option key={s._id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-purple-600" />
                            Security Code
                        </label>
                        <input
                            type="password"
                            placeholder="Enter security code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    )}

                    <div className="flex gap-4 pt-6">
                        <button
                            onClick={onBack}
                            className="flex-1 rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 text-base font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleVerify}
                            className="flex-[1.5] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold shadow-md transition-colors"
                        >
                            Verify Identity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Header() {
    return (
        <header
            id="vcet-header"
            className="w-full bg-gradient-to-r from-white via-blue-50/30 to-white border-b-2 border-blue-200/40 py-5 px-6 shadow-md backdrop-blur-sm relative z-10 animate-fade-in-up"
        >
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto flex items-center justify-center gap-10 md:gap-16 relative z-10">
                {/* Left Logo */}
                <div className="flex-shrink-0 transition-all duration-500 hover:scale-105">
                    <img
                        src="/vcet-logo.jpg"
                        alt="VCET Logo"
                        className="h-20 w-20 md:h-20 md:w-20 object-contain drop-shadow-md"
                    />
                </div>

                {/* Center College Info */}
                <div className="flex-1 text-center px-2 md:px-4 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
                    <h1
                        className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 mb-1 leading-tight tracking-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        Velammal College of Engineering and Technology
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="h-[2px] w-10 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                        <p
                            className="text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wide"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Department of Computer Science & Engineering
                        </p>
                        <div className="h-[2px] w-10 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
                    </div>
                </div>

                {/* Right Logo */}
                <div className="flex-shrink-0 transition-all duration-500 hover:scale-105">
                    <img
                        src="/cse-logo.jpg"
                        alt="CSE Logo"
                        className="h-20 w-20 md:h-20 md:w-20 object-contain drop-shadow-md"
                    />
                </div>
            </div>
        </header>
    );
}

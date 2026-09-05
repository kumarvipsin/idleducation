
'use client';

export function ChatBot() {
  return (
    <a
      id="whatsapp-floating-btn"
      href="https://wa.me/918860040010"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] sm:bottom-6 sm:right-6 z-40 w-[54px] h-[54px] sm:w-[58px] sm:h-[58px] rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.32),0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.42),0_3px_8px_rgba(0,0,0,0.12)] border border-white/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-150 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] fill-current text-white"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.776.979-.951 1.179-.175.2-.351.226-.651.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.131-.612.136-.135.301-.351.451-.526.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.588-.492-.508-.676-.518-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.275.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.2 2.12 3.237 5.136 4.54.717.31 1.277.495 1.713.633.72.228 1.375.196 1.893.118.577-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.275-.2-.576-.35z" />
        <path d="M12.04 2c-5.464 0-9.91 4.446-9.91 9.91 0 1.75.457 3.456 1.325 4.96L2 22l5.253-1.378c1.454.793 3.09 1.21 4.787 1.21 5.464 0 9.91-4.446 9.91-9.91 0-5.464-4.446-9.91-9.91-9.91zm0 18.15c-1.477 0-2.926-.397-4.19-1.148l-.3-.178-3.116.818.832-3.037-.195-.312c-.825-1.314-1.261-2.836-1.261-4.403 0-4.542 3.696-8.238 8.24-8.238 4.543 0 8.24 3.696 8.24 8.238 0 4.543-3.697 8.24-8.24 8.24z" />
      </svg>
    </a>
  );
}

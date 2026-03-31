import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

export default function Navbar({onMenuClick,title}){
    return(
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
            <button
                onClick={onMenuClick}
                className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 xl:hidden"
            >
                <Bars3Icon className="h-5 w-5" />
            </button>

            <h1 className="text-lg font-semibold text-surface-900">{title}</h1>

        </header>
    );
}
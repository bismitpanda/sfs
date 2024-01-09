import { FolderOpen } from "lucide-react";

export const PathInput: React.FC<{ placeholder: string }> = ({
    placeholder,
}) => (
    <div className="flex w-full flex-row gap-0">
        <input
            className="input max-w-[calc(100%-36px)] rounded-r-none"
            placeholder={placeholder}
        />
        <span className="w-10 border-2 rounded-r-xl p-1.5 border-dark-600 border-l-0 bg-dark-200 cursor-pointer hover:bg-dark-400 transition-colors">
            <FolderOpen size={24} strokeWidth={1} color="#767676" />
        </span>
    </div>
);

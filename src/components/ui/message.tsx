
interface MessageProps {
    children: React.ReactNode;
}

export function Message({ children }: MessageProps) {
    return (
        <div className="flex items-center justify-center p-4 text-center">
            {children}
        </div>
    );
}

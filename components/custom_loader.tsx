import { OrbitalLoader } from './ui/orbital-loader'

interface CustomLoaderProps {
    message?: string;
    className?: string;
    isFixed?: boolean;
    containerClassName?: string;
}

function CustomLoader({
    message = "Please wait...",
    className = "size-20",
    isFixed = true,
    containerClassName = ""
}: CustomLoaderProps) {
    const containerClasses = containerClassName || (isFixed
        ? "flex justify-center items-center h-screen w-screen fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
        : "flex justify-center items-center h-full w-full p-4");

    return (
        <div className={containerClasses}>
            <OrbitalLoader message={message} className={className} />
        </div>
    );
}

export default CustomLoader

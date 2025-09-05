
'use client';
import Image from "next/image";

type TeacherCardProps = {
    name: string;
    designation: string;
    experience: string;
    avatar: string;
    avatarHint: string;
}

export function TeacherCard({ name, designation, experience, avatar, avatarHint }: TeacherCardProps) {
    return (
        <div className="p-4">
            <div className="relative w-48 mx-auto h-56 group">
                <div 
                    className="absolute bottom-0 left-0 right-0 h-32 bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-md"
                >
                    <div className="pt-16 px-2 text-center">
                        <h4 className="font-bold text-sm truncate">{name}</h4>
                        <p className="text-xs text-muted-foreground">{designation}</p>
                        <p className="text-xs text-muted-foreground">{experience}</p>
                    </div>
                </div>
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-36 rounded-t-[6rem] rounded-b-md overflow-hidden bg-muted flex items-center justify-center border-4 border-background shadow-lg"
                >
                    <Image
                        src={avatar}
                        alt={name}
                        data-ai-hint={avatarHint}
                        width={128}
                        height={144}
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                </div>
            </div>
        </div>
    );
}

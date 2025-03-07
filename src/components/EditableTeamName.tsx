"use client";

import { Pencil, Check, X } from "lucide-react";
import { useOptimistic, useState } from "react";
import { Input } from "./ui/input";
import { useFormStatus } from "react-dom";
import { updateName } from "@/lib/actions/updateName";

interface EditableTeamNameProps {
    initialName: string;
    teamId: string;
}

export function EditableTeamName({ initialName }: EditableTeamNameProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [optimisticName, setOptimisticName] = useOptimistic<string, string>(
        initialName,
        (prevName, newName) => {
            return newName;
        }
    );
    const { pending } = useFormStatus();

    console.log({ pending, optimisticName });
    const handleCancel = () => {
        setIsEditing(false);
    };

    const formAction = async (formData: FormData) => {
        setOptimisticName(formData.get("name") as string);
        setIsEditing(false);
        await updateName(formData);
    };

    if (isEditing) {
        return (
            <div className="max-w-xl mx-auto flex flex-col items-center">
                <p className="text text-muted-foreground">
                    Du kan kun endre lagnavnet èn gang!
                </p>
                <form
                    className="flex items-center gap-6 p-4 w-full"
                    action={formAction}
                >
                    <Input
                        placeholder={optimisticName}
                        name="name"
                        className="text-center bg-transparent border-green-400/50"
                    />
                    <button
                        type="submit"
                        disabled={pending}
                        className="text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                        <Check className="h-6 w-6" />
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={pending}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-6 pb-4">
            <h1 className="text-4xl font-bold">{optimisticName}</h1>
            <button
                onClick={() => setIsEditing(true)}
                className="text-green-400 hover:text-green-300 opacity-50 hover:opacity-100 transition-opacity"
            >
                <Pencil className="h-5 w-5" />
            </button>
        </div>
    );
}

import { useEffect, useState } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, set, onDisconnect, remove } from "firebase/database";
import { User } from "firebase/auth";

export function usePresence(roomId: string, user: User | null) {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (!user || !roomId) return;

        // References
        const userRef = ref(rtdb, `rooms/${roomId}/users/${user.uid}`);
        const roomRef = ref(rtdb, `rooms/${roomId}/users`);

        // Set user presence
        set(userRef, {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || "",
            joinedAt: Date.now()
        });

        // Handle disconnect
        onDisconnect(userRef).remove();

        // Listen for room users
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsers(Object.values(data));
            } else {
                setUsers([]);
            }
        });

        return () => {
            // Remove self on component unmount
            remove(userRef);
            unsubscribe();
        };
    }, [roomId, user]);

    return users;
}

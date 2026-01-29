import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type EmployeeStatus = "Ativo" | "Inativo";

export type EmployeeDoc = {
    name: string;
    email: string;
    department: string;
    status: EmployeeStatus;
    createdAt?: any;
};

export type EmployeeWithId = EmployeeDoc & { id: string };

const EMPLOYEES_COLLECTION = "employees";

export async function createEmployee(data: EmployeeDoc) {
    const ref = await addDoc(collection(db, EMPLOYEES_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
    });

    return ref.id;
}

export async function listEmployees(): Promise<EmployeeWithId[]> {
    const q = query(
        collection(db, EMPLOYEES_COLLECTION),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as EmployeeDoc),
    }));
}

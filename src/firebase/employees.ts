import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export type EmployeeStatus = "Ativo" | "Inativo";

export type HierarchyLevel = "Junior" | "Pleno" | "Senior" | "Gestor";

export type Employee = {
    name: string;
    email: string;
    departmentId: string;
    status: "Ativo" | "Inativo";
    avatar: string;
    role: string;
    admissionDate: string;
    level: HierarchyLevel;
    managerId: string;
    baseSalary: number;
};

export type EmployeeWithId = Employee & { id: string };

const EMPLOYEES_COLLECTION = "employees";


export async function createEmployee(data: Employee) {
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
        ...(doc.data() as Employee),
    }));
}

export async function getEmployeeById(id: string): Promise<EmployeeWithId | null> {
    const ref = doc(db, "employees", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as Employee;
    return { id: snap.id, ...data };
}

export async function updateEmployee(
    id: string,
    payload: Partial<Employee>
): Promise<void> {
    const ref = doc(db, "employees", id);
    await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
}

export async function deleteEmployee(id: string) {
    const EMPLOYEES = "employees";
    const DEPARTMENTS = "departments";

    const empRef = doc(db, EMPLOYEES, id);
    const snap = await getDoc(empRef);

    if (!snap.exists()) return;

    const data = snap.data() as { departmentId?: string };
    const departmentId = data.departmentId ?? "";

    const batch = writeBatch(db);

    if (departmentId) {
        const deptRef = doc(db, DEPARTMENTS, departmentId);
        batch.update(deptRef, {
            employeeIds: arrayRemove(id),
            updatedAt: serverTimestamp(),
        });
    }

    batch.delete(empRef);

    await batch.commit();
}

export async function saveEmployeeAndSyncDepartments(args: {
    employeeId?: string;
    payload: Employee;
}) {
    const { employeeId, payload } = args;

    const EMPLOYEES = "employees";
    const DEPARTMENTS = "departments";

    const batch = writeBatch(db);

    let id = employeeId;
    let prevDepartmentId = "";

    if (id) {
        const empRef = doc(db, EMPLOYEES, id);
        const snap = await getDoc(empRef);

        if (snap.exists()) {
            const data = snap.data() as { departmentId?: string };
            prevDepartmentId = data.departmentId ?? "";
        }
    }

    if (!id) {
        const empRef = doc(collection(db, EMPLOYEES));
        id = empRef.id;

        batch.set(empRef, {
            ...payload,
            createdAt: serverTimestamp(),
        });
    } else {
        const empRef = doc(db, EMPLOYEES, id);

        batch.update(empRef, {
            ...payload,
            updatedAt: serverTimestamp(),
        });
    }

    const nextDepartmentId = payload.departmentId ?? "";

    if (prevDepartmentId && prevDepartmentId !== nextDepartmentId) {
        const prevDeptRef = doc(db, DEPARTMENTS, prevDepartmentId);
        batch.update(prevDeptRef, {
            employeeIds: arrayRemove(id),
            updatedAt: serverTimestamp(),
        });
    }

    if (nextDepartmentId && prevDepartmentId !== nextDepartmentId) {
        const nextDeptRef = doc(db, DEPARTMENTS, nextDepartmentId);
        batch.update(nextDeptRef, {
            employeeIds: arrayUnion(id),
            updatedAt: serverTimestamp(),
        });
    }

    await batch.commit();
    return id;
}

export async function doesEmployeeEmailExist(args: {
    email: string;
    ignoreEmployeeId?: string;
}): Promise<boolean> {
    const emailNormalized = args.email.trim().toLowerCase();
    if (!emailNormalized) return false;

    const q = query(
        collection(db, EMPLOYEES_COLLECTION),
        where("email", "==", emailNormalized),
        limit(1)
    );

    const snap = await getDocs(q);

    if (snap.empty) return false;

    const foundId = snap.docs[0].id;
    if (args.ignoreEmployeeId && foundId === args.ignoreEmployeeId) {
        return false;
    }

    return true;
}

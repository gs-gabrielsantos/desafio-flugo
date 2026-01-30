import {
    addDoc,
    arrayRemove,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export type Department = {
    name: string;
    managerId: string;
    employeeIds: string[];
    employeesCount: number;
};

export type DepartmentWithId = Department & { id: string };

const DEPARTMENTS_COLLECTION = "departments";
const EMPLOYEES_COLLECTION = "employees";

export async function createDepartment(data: Department) {
    const ref = await addDoc(collection(db, DEPARTMENTS_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
    });

    return ref.id;
}

export async function listDepartments(): Promise<DepartmentWithId[]> {
    const q = query(
        collection(db, DEPARTMENTS_COLLECTION),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Department),
    }));
}

export async function getDepartmentById(id: string): Promise<DepartmentWithId | null> {
    const ref = doc(db, DEPARTMENTS_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as Department;
    return { id: snap.id, ...data };
}

export async function updateDepartment(
    id: string,
    payload: Partial<Department>
): Promise<void> {
    const ref = doc(db, DEPARTMENTS_COLLECTION, id);
    await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
}
export async function deleteDepartmentAndClearEmployees(departmentId: string) {
    const dept = await getDepartmentById(departmentId);

    const batch = writeBatch(db);

    for (const empId of dept?.employeeIds ?? []) {
        const empRef = doc(db, EMPLOYEES_COLLECTION, empId);
        batch.update(empRef, { departmentId: "" });
    }
    const deptRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    batch.delete(deptRef);

    await batch.commit();
}

export async function saveDepartmentAndSyncEmployees(args: {
    departmentId?: string;
    name: string;
    managerId: string;
    employeeIds: string[];
}) {
    const { departmentId, name, managerId, employeeIds } = args;

    const DEPARTMENTS = "departments";
    const EMPLOYEES = "employees";

    const batch = writeBatch(db);

    let id = departmentId;

    if (!id) {
        const deptRef = doc(collection(db, DEPARTMENTS));
        id = deptRef.id;

        batch.set(deptRef, {
            name,
            managerId,
            employeeIds,
            createdAt: serverTimestamp(),
        });
    } else {
        const deptRef = doc(db, DEPARTMENTS, id);

        batch.update(deptRef, {
            name,
            managerId,
            employeeIds,
            updatedAt: serverTimestamp(),
        });
    }

    const allDeptsSnap = await getDocs(collection(db, DEPARTMENTS));

    allDeptsSnap.docs.forEach((docSnap) => {
        const data = docSnap.data() as { employeeIds?: string[] };

        if (docSnap.id !== id && data.employeeIds?.length) {
            batch.update(docSnap.ref, {
                employeeIds: arrayRemove(...employeeIds),
                updatedAt: serverTimestamp(),
            });
        }
    });

    employeeIds.forEach((empId) => {
        const empRef = doc(db, EMPLOYEES, empId);
        batch.update(empRef, {
            departmentId: id,
            updatedAt: serverTimestamp(),
        });
    });

    await batch.commit();
    return id;
}

export async function deleteDepartment(id: string) {
    const ref = doc(db, DEPARTMENTS_COLLECTION, id);
    await deleteDoc(ref);
}
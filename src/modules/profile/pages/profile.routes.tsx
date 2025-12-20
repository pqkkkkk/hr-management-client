import { Route } from "react-router-dom"
import ProtectedRoute from "shared/components/ProtectedRoute"
import EmployeeListPage from "./EmployeeListPage"
import EmployeeUpdatePage from "./EmployeeUpdatePage"
import EmployeePersonalUpdatePage from "./EmployeePersonalUpdatePage"



export const ProfileRoutes = (
    <Route path="profile">
        <Route path="users" element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "MANAGER"]}>
                <EmployeeListPage />
            </ProtectedRoute>
        }
        />
        <Route path="users/:userId/for-hr" element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR", "MANAGER"]}>
                <EmployeeUpdatePage />
            </ProtectedRoute>
        } />
        <Route path="users/:userId/for-employee" element={
            <ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER", "HR", "ADMIN"]}>
                <EmployeePersonalUpdatePage />
            </ProtectedRoute>
        } />
    </Route>
)
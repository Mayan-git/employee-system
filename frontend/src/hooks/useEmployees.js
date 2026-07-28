import { useCallback, useEffect, useState } from "react";
import * as employeeService from "../services/employeeService.js";
import { getErrorMessage } from "../services/api.js";

const emptyPagination = { page: 1, limit: 20, total: 0, pages: 0 };

export function useEmployees({ name, department, page = 1, limit = 20 }) {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError("");

    employeeService
      .getEmployees({ name, department, page, limit })
      .then((data) => {
        if (cancelled) return;
        setEmployees(data.employees);
        setPagination(data.pagination);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [name, department, page, limit, version]);

  return { employees, pagination, status, error, refetch };
}

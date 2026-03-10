import React from "react";
import Table from "../../../components/common/Table";
import SpecialistAppointmentRow from "./SpecialistAppointmentRow";

const PastSection = ({ appointments, onUpdateAppointment }) => {
  const columns = [
    {
      key: "patient",
      label: "Patient",
      render: (_, row) => {
        const user = row.member;
        const name =
          [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
          user?.username ||
          "Patient";
        return (
          <div className="flex flex-col">
            <span className="font-medium text-neutral-900 dark:text-white">
              {name}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {row.member?.email}
            </span>
          </div>
        );
      },
    },
    {
      key: "scheduled_at",
      label: "Happened at",
      render: (value) => (
        <span className="text-sm text-neutral-800 dark:text-neutral-100">
          {value ? new Date(value).toLocaleString() : "Not scheduled"}
        </span>
      ),
    },
    {
      key: "appointment_type_display",
      label: "Type",
      render: (value, row) =>
        value || row.appointment_type || "—",
    },
    {
      key: "status_display",
      label: "Status",
      render: (value, row) => value || row.status || "—",
    },
    {
      key: "actions",
      label: "",
      className: "w-64 text-right",
      render: (_, row) => (
        <SpecialistAppointmentRow
          appointment={row}
          onUpdateLocal={(updated) => onUpdateAppointment(row.id, updated)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={appointments}
      emptyMessage="No past appointments yet."
      title="Past appointments"
      subtitle={`${appointments.length} completed`}
      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
    />
  );
};

export default PastSection;


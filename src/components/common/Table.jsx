import React from "react";

/**
 * Reusable table component.
 *
 * @param {Array<{ key: string, label: string, render?: (value, row) => ReactNode, className?: string }>} columns - Column config
 * @param {Array<object>} data - Row data
 * @param {string} [keyProp='id'] - Property to use as row key
 * @param {string} [emptyMessage] - Message when data is empty
 * @param {string} [title] - Optional section title above table
 * @param {string} [subtitle] - Optional section subtitle
 * @param {string} [className] - Wrapper class
 */
const Table = ({
  columns,
  data,
  keyProp = "id",
  emptyMessage = "No data to show.",
  title,
  subtitle,
  className = "",
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className={className}>
        {(title || subtitle) && (
          <div className="px-4 py-3 sm:px-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
            {title && (
              <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 py-6 px-4 text-center">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="px-4 py-3 sm:px-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
          {title && (
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 bg-neutral-50/80 dark:bg-neutral-800/50 ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row[keyProp]}
                className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-neutral-900 dark:text-white align-middle ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

import React from "react";

const DynamicTable = ({ headings, data, hasAction }) => {
  return (
    <table className="min-w-full border-collapse block md:table">
      <thead className="block md:table-header-group">
        <tr className="border border-gray-300 md:border-none block md:table-row">
          {headings.map((heading, index) => (
            <th
              key={index}
              className="bg-gray-200 p-2 text-left font-bold md:border md:border-gray-300 block md:table-cell"
            >
              {heading}
            </th>
          ))}
          {hasAction && (
            <th className="bg-gray-200 p-2 text-left font-bold md:border md:border-gray-300 block md:table-cell">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="bg-white border border-gray-300 md:border-none block md:table-row"
          >
            {headings.map((heading, cellIndex) => (
              <td
                key={cellIndex}
                className="p-2 text-left md:border md:border-gray-300 block md:table-cell"
              >
                {row[heading.toLowerCase()]}
              </td>
            ))}
            {hasAction && (
              <td className="p-2 text-left md:border md:border-gray-300 block md:table-cell">
                <button className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;


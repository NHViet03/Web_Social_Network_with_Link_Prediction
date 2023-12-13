import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExportCSV = ({ csvData, filename }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, filename) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = {
      Sheets: { data: ws },
      SheetNames: ["data"],
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + fileExtension);
  };

  return (
    <button
      className="btn"
      style={{
        backgroundColor: "#0E733A",
        color: "#fff",
        fontWeight: "500",
      }}
      onClick={() => exportToCSV(csvData, filename)}
    >
      <i
        className="fa-solid fa-file-excel"
        style={{
          fontSize: "18px",
          marginRight: "6px",
        }}
      />
      Xuất Excel
    </button>
  );
};

export default ExportCSV;

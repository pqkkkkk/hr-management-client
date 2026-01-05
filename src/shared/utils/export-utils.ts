import { User } from "shared/types";
import * as XLSX from "xlsx";

export function buildXlsxBlob(rows: any[][], headers: string[]): Blob {
  const aoa = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export async function buildPdfBlob(
  filteredUsers: User[],
  headers: string[],
  departmentIdToName: Record<string, string>
): Promise<Blob> {
  try {
    const pdfMakeRaw: any = await import("pdfmake/build/pdfmake");
    const pdfFontsRaw: any = await import("pdfmake/build/vfs_fonts");
    const pdfMake: any =
      pdfMakeRaw && pdfMakeRaw.default ? pdfMakeRaw.default : pdfMakeRaw;
    const pdfFonts: any =
      pdfFontsRaw && pdfFontsRaw.default ? pdfFontsRaw.default : pdfFontsRaw;

    let vfs: any = undefined;
    if (pdfFonts) {
      if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) vfs = pdfFonts.pdfMake.vfs;
      else if (pdfFonts.vfs) vfs = pdfFonts.vfs;
      else if (pdfFonts.default && pdfFonts.default.vfs)
        vfs = pdfFonts.default.vfs;
    }
    if (vfs) {
      try {
        pdfMake.vfs = vfs;
        if (pdfMake.default) pdfMake.default.vfs = vfs;
      } catch (e) {
        console.warn("pdfMake vfs assignment failed:", e);
      }
    }

    const contentItems: any[] = [];
    contentItems.push({ text: "Danh sách nhân viên", style: "header" });

    for (const u of filteredUsers) {
      const deptName = u.departmentId
        ? departmentIdToName[u.departmentId] || u.departmentId
        : "";
      const gridBody: any[] = [];
      gridBody.push([
        { text: "Mã NV", bold: true },
        u.userId || "",
        { text: "Họ tên", bold: true },
        u.fullName || "",
      ]);
      gridBody.push([
        { text: "Email", bold: true },
        u.email || "",
        { text: "Vai trò", bold: true },
        u.role || "",
      ]);
      gridBody.push([
        { text: "Trạng thái", bold: true },
        u.status || "",
        { text: "Vị trí", bold: true },
        u.position || "",
      ]);
      gridBody.push([
        { text: "Ngày vào", bold: true },
        u.joinDate || "",
        { text: "Số CMND", bold: true },
        u.identityCardNumber || "",
      ]);
      gridBody.push([
        { text: "Ngày sinh", bold: true },
        u.dateOfBirth || "",
        { text: "Giới tính", bold: true },
        u.gender || "",
      ]);
      gridBody.push([
        { text: "SĐT", bold: true },
        u.phoneNumber || "",
        { text: "Địa chỉ", bold: true },
        u.address || "",
      ]);
      gridBody.push([
        { text: "Ngân hàng", bold: true },
        u.bankName || "",
        { text: "Số TK", bold: true },
        u.bankAccountNumber || "",
      ]);
      gridBody.push([
        { text: "Phòng ban", bold: true },
        deptName || "",
        { text: "", bold: true },
        "",
      ]);

      contentItems.push({
        table: {
          widths: [80, "*", 80, "*"],
          body: gridBody,
        },
        layout: {
          hLineWidth: function (i: any, node: any) {
            return i === 0 || i === node.table.body.length ? 0 : 0.5;
          },
          vLineWidth: function () {
            return 0;
          },
          hLineColor: function () {
            return "#bbbbbb";
          },
        },
        margin: [0, 0, 0, 12],
      });
    }

    const docDefinition: any = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [40, 40, 40, 40],
      content: contentItems,
      styles: {
        header: { fontSize: 16, bold: true, margin: [0, 0, 0, 8] },
      },
      defaultStyle: { fontSize: 10 },
    };

    const creator =
      (pdfMake && pdfMake.createPdf) ||
      (pdfMake && pdfMake.default && pdfMake.default.createPdf);
    if (!creator) throw new Error("pdfMake createPdf not available");
    const pdfBlob: Blob = await new Promise((res, rej) => {
      try {
        const generator = creator.call(pdfMake, docDefinition);
        generator.getBlob((b: Blob) => res(b));
      } catch (e) {
        rej(e);
      }
    });

    return pdfBlob;
  } catch (err) {
    console.error("pdfMake dynamic generation failed:", err);
    const txt = filteredUsers.length
      ? "Danh sách nhân viên\n\n" +
      filteredUsers
        .map((u) => `- ${u.userId} ${u.fullName} <${u.email}> - ${u.status}`)
        .join("\n")
      : "Danh sách nhân viên trống";
    return new Blob([txt], { type: "application/pdf" });
  }
}

export const exportHeaders: string[] = [
  "Mã NV",
  "Họ tên",
  "Email",
  "Vai trò",
  "Trạng thái",
  "Vị trí",
  "Ngày vào",
  "Số CMND",
  "Ngày sinh",
  "Giới tính",
  "SĐT",
  "Địa chỉ",
  "Ngân hàng",
  "Số TK",
  "Phòng ban",
];

export const departmentIdToName: Record<string, string> = {
  DPT01: "Kế toán",
  DPT02: "Nhân sự",
  DPT03: "IT",
  DPT04: "Marketing",
};

export function userToRow(u: User): any[] {
  const deptName = u.departmentId
    ? departmentIdToName[u.departmentId] || u.departmentId
    : "";
  return [
    u.userId || "",
    u.fullName || "",
    u.email || "",
    u.role || "",
    u.status || "",
    u.position || "",
    u.joinDate || "",
    u.identityCardNumber || "",
    u.dateOfBirth || "",
    u.gender || "",
    u.phoneNumber || "",
    u.address || "",
    u.bankName || "",
    u.bankAccountNumber || "",
    deptName,
  ];
}

export function usersToRows(users: User[]): any[][] {
  return users.map(userToRow);
}

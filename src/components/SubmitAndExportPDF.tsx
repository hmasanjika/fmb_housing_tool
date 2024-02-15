import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PDFMerger from "pdf-merger-js/browser";
import { Address, WDay, WMonth } from "../models/types";
import logoSrc from "../assets/images/Acc_Logo_Black_Purple_RGB.png";

const MonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Props = {
  disabled: boolean;
  data: WMonth;
  userName: string;
  addresses: Address[];
  mainWorkplace: Address;
  distance: number | null;
  files: FileList;
  onClickSave: () => void;
};

const SubmitAndExportPDF = ({
  disabled,
  data,
  userName,
  addresses,
  mainWorkplace,
  distance,
  files,
  onClickSave,
}: Props) => {
  const primaryPurple = "#7500c0";
  const secondaryPurple = "#B841FE";
  const logo: HTMLImageElement = new Image();
  logo.src = logoSrc;
  const logoDimensions: { w: number; h: number } = {
    w: logo.width * 0.003,
    h: logo.height * 0.003,
  };

  /**
   * Defines and retrieves the paragraph to be displayed between the title and address table
   * @returns - The string of text
   */
  const getOpeningText = (month: string) => {
    let mainWorkplaceText = "";
    if (mainWorkplace.addressName === "Home") {
      mainWorkplaceText = `The main workplace in ${month} ${data.year} was ${mainWorkplace.addressName}, the official place of residence.`;
    } else {
      mainWorkplaceText = `The main workplace in ${month} ${data.year} was ${mainWorkplace.addressName}, which is ${distance} km away from the residential address.`;
    }
    return `Date: ${new Date().toLocaleDateString("en-gb", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}\nName: ${userName}\n\n${mainWorkplaceText}`;
  };

  const handleButtonClick = () => {
    onClickSave();
    generatePDF();
  };

  /**
   * Merges additional files uploaded by the user, adds these files to the workplace document
   * and downloads the resulting PDF file.
   * @param doc - The created FMB document containing the workplace information
   * @param files - Additional files to be appended to the downloadable PDF document
   */
  const mergeFilesAndDownload = async (doc, files, pdfName) => {
    const merger = new PDFMerger();
    const arrayBuffer = doc.output("arraybuffer");

    await merger.add(arrayBuffer);
    for (const file of files) {
      await merger.add(file);
    }

    await merger.save(pdfName);
  };

  const areDaysSplit = () => {
    return data.workdays.some(
      (d) =>
        d.workPlaceAddressAm?.addressName !== d.workPlaceAddressPm?.addressName
    );
  };

  const getOccurrence = (addName: string) => {
    let count = data.workdays.reduce(
      (val, add) =>
        add.workPlaceAddressAm?.addressName === addName ? val + 0.5 : val + 0,
      0
    );
    count += data.workdays.reduce(
      (val, add) =>
        add.workPlaceAddressPm?.addressName === addName ? val + 0.5 : val + 0,
      0
    );
    return count;
  };

  const getColumnStyles = () => {
    return areDaysSplit
      ? {
          0: {
            halign: "left",
            cellWidth: 30,
          },
          1: {
            halign: "center",
          },
          2: {
            halign: "center",
          },
        }
      : {
          0: {
            halign: "center",
            cellWidth: 40,
          },
          1: {
            halign: "center",
          },
        };
  };

  const getHead = () => {
    return areDaysSplit
      ? [
          [
            {
              content: "",
              colSpan: 1,
              styles: { halign: "center", fillColor: "#FFFFFF" },
            },
            {
              content: "Work Location",
              colSpan: 2,
              styles: { halign: "center", fillColor: primaryPurple },
            },
          ],
          [
            {
              content: "Date",
              colSpan: 1,
              styles: { halign: "left", fillColor: primaryPurple },
            },
            {
              content: "AM",
              colSpan: 1,
              styles: { halign: "center", fillColor: secondaryPurple },
            },
            {
              content: "PM",
              colSpan: 1,
              styles: { halign: "center", fillColor: secondaryPurple },
            },
          ],
        ]
      : [["Date", "Work Location"]];
  };

  const getCellStyle = (data) => {
    if (
      data.cell.raw === "WE / PH" ||
      data.cell.raw.startsWith("Sat") ||
      data.cell.raw.startsWith("Sun")
    ) {
      data.cell.styles.fillColor = "#DFDFDF";
      if (data.cell.raw === "WE / PH") {
        data.cell.styles.textColor = "#878787";
        data.cell.styles.fontStyle = "italic";
      }
    } else if (data.cell.raw === "PTO") {
      data.cell.styles.fillColor = "#F3F3F3";
      data.cell.styles.textColor = "#878787";
      data.cell.styles.fontStyle = "italic";
      // If the cell contains a location
    } else if (data.cell.styles.cellWidth === "auto") {
      data.cell.styles.fontStyle = "bold";
    }
  };

  const getLocation = (day: WDay, time: string) => {
    if (day[`isWorkday${time}`]) {
      return day[`workPlaceAddress${time}`].addressName;
    }
    if (day.isWeekend) {
      return "WE / PH";
    }
    // If paid time off,
    return "PTO";
  };

  /**
   * Generates the PDF file using jsPDF
   */
  const generatePDF = async () => {
    const month: string = MonthNames[data.month];
    const pdfName: string = `FMB-workplace-document_${userName.replace(
      / /g,
      "_"
    )}_${month}-${data.year}`;

    const doc = new jsPDF("p", "mm");
    const docMargin: number = 15;

    /** TITLE **/
    const title: string = `FMB Usual Workplace Document - ${month} ${data.year}`;
    doc
      .setFontSize(12)
      .setFont(undefined, "bold")
      .text(title, docMargin, docMargin);

    /** LOGO */
    doc.addImage(
      logo,
      "png",
      doc.internal.pageSize.width - logoDimensions.w - docMargin,
      docMargin - doc.getTextDimensions(title).h,
      logoDimensions.w,
      logoDimensions.h,
      "Accenture logo",
      "FAST"
    );

    /** OPENING TEXT **/
    const openingText: string = getOpeningText(month);
    doc.setFontSize(9);
    doc.setFont(undefined, "normal").text(openingText, docMargin, 25);

    /** TABLE OF ADDRESSES **/
    const addressesStartY: number =
      mainWorkplace.addressName === "Home" ? 45 : 50;
    // Title
    doc
      .setFont(undefined, "bold")
      .text("Work Locations", docMargin, addressesStartY);

    // Creating array of data to fill the cells in the following table of addresses
    const addressesData = [];
    addresses.forEach((add: Address) => {
      const rowData = [
        add.addressName,
        add.address,
        getOccurrence(add.addressName),
        add.distanceFromHome,
      ];
      addressesData.push(rowData);
    });

    // Creating address table
    let addressesEndY: number | undefined = 0;
    autoTable(doc, {
      theme: "grid",
      styles: { fontSize: 9 },
      head: [["Name", "Address", "Total Worked Days", "Distance* (km)"]],
      body: addressesData,
      startY: addressesStartY + 2,
      headStyles: {
        fillColor: primaryPurple,
      },
      columnStyles: {
        2: {
          cellWidth: 20,
        },
        3: {
          cellWidth: 20,
        },
      },
      didDrawPage: function (data) {
        addressesEndY = data.cursor?.y;
      },
    });

    // Address table notes
    const addrTabNotes = "*Distance from the official place of residence";
    doc
      .setFont(undefined, "normal")
      .setFontSize(7)
      .text(addrTabNotes, docMargin, addressesEndY + 4);

    /** CALENDAR **/
    // Title
    doc
      .setFont(undefined, "bold")
      .setFontSize(9)
      .text(
        "Calendar",
        docMargin,
        addressesEndY + doc.getTextDimensions(addrTabNotes).h + 10
      );

    // Calendar table notes - abbreviation descriptions
    const abbrDesc = "WE / PH = Weekend or Public Holiday, PTO = Paid Time Off";
    doc
      .setFont(undefined, "normal")
      .text(
        abbrDesc,
        doc.internal.pageSize.width -
          doc.getTextDimensions(abbrDesc).w -
          docMargin,
        addressesEndY + doc.getTextDimensions(addrTabNotes).h + 10
      );

    // Creating array of data to fill the cells in the following calendar table
    const calendarData = [];
    data.workdays.forEach((day: WDay) => {
      const rowData = [
        new Date(day.workDate).toLocaleDateString("en-gb", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
        getLocation(day, "Am"),
        areDaysSplit() ? getLocation(day, "Pm") : null,
      ];
      calendarData.push(rowData);
    });

    // TO DO: Improve table layout (with AM and PM)
    // Creating calendar table
    let calendarTableY: number | undefined = 0;
    (doc as any).autoTable({
      theme: "grid",
      styles: { fontSize: 9 },
      head: getHead(),
      body: calendarData,
      startY: addressesEndY + doc.getTextDimensions(addrTabNotes).h + 12,
      columnStyles: getColumnStyles(),
      didDrawPage: function (data) {
        calendarTableY = data.cursor?.y;
      },
      didParseCell: function (data) {
        if (data.section === "body") {
          getCellStyle(data);
        }
      },
    });

    doc
      .setFont(undefined, "italic")
      .text(
        `I acknowledge that the information above is correct and confirm I have worked the majority of my working time from ${mainWorkplace.addressName}.`,
        docMargin,
        calendarTableY + 10,
        { maxWidth: doc.internal.pageSize.width - 2 * docMargin, align: "left" }
      );

    if (files && Array.from(files).length > 0) {
      await mergeFilesAndDownload(doc, files, pdfName);
    } else {
      /** FOOTER **/
      // TO DO: Find a way to add the page number to all pages when additional files are uploaded
      // const pageCount = doc.internal.getNumberOfPages();
      // for (let i = 1; i <= pageCount; i++) {
      //   const footerText: string = `Page ${i} of ${pageCount}`;
      //   doc.setPage(i);
      //   doc.setFontSize(10);
      //   doc.setTextColor(150);
      //   doc.text(
      //     footerText,
      //     doc.internal.pageSize.getWidth() * 0.5 -
      //       doc.getTextWidth(footerText) * 0.5,
      //     doc.internal.pageSize.getHeight() - 10
      //   );
      // }
      doc.save(`${pdfName}.pdf`);
    }
  };

  return (
    <button
      className="btn btn-primary"
      style={{ marginLeft: "10px" }}
      disabled={disabled}
      onClick={handleButtonClick}
    >
      Save and generate PDF
    </button>
  );
};

export default SubmitAndExportPDF;

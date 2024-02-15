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
  onClickSave: () => void;
};

const SubmitAndExportPDF = ({
  disabled,
  data,
  userName,
  addresses,
  mainWorkplace,
  distance,
  onClickSave,
}: Props) => {
  /**
   * Defines and retrieves the paragraph to be displayed between the title and address table
   * @returns - The string of text
   */
  const getOpeningText = (month: string) => {
    let mainWorkplaceText = "";
    if (mainWorkplace.addressName === "Home") {
      mainWorkplaceText = `Your main workplace in ${month} ${data.year} was ${mainWorkplace.addressName}, which is your place of residence.`;
    } else {
      mainWorkplaceText = `Your main workplace in ${month} ${data.year} was ${mainWorkplace.addressName}, which is ${distance} km away from your residential address.`;
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
    console.log(count);
    return count;
  };

  const getColumnStyles = () => {
    return areDaysSplit
      ? {
          1: {
            halign: "center",
            cellWidth: 14,
          },
          2: {
            halign: "center",
            cellWidth: 30,
          },
          3: {
            halign: "center",
            cellWidth: 30,
          },
        }
      : {
          1: {
            halign: "center",
            cellWidth: 14,
          },
          2: {
            halign: "center",
            cellWidth: 60,
          },
        };
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

    /** TITLE AND LOGO **/
    const logo: HTMLImageElement = new Image();
    logo.src = logoSrc;
    const logoDimensions: { w: number; h: number } = {
      w: logo.width * 0.002,
      h: logo.height * 0.002,
    };
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
    const addressesStartY: number = 50;
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
      head: [["Name", "Address", "Total worked days", "Distance (km)"]],
      body: addressesData,
      startY: addressesStartY + 2,
      theme: "grid",
      headStyles: {
        fillColor: "#7500c0",
      },
      didDrawPage: function (data) {
        addressesEndY = data.cursor?.y;
      },
    });

    /** CALENDAR **/
    // Title
    doc
      .setFont(undefined, "bold")
      .text("Calendar", docMargin, addressesEndY + 10);

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
        day.workPlaceAddressAm?.addressName,
        areDaysSplit() ? day.workPlaceAddressPm?.addressName : null,
      ];
      calendarData.push(rowData);
    });

    // TO DO: Improve table layout (with AM and PM)
    // Creating calendar table
    let calendarTableY: number | undefined = 0;
    let head = [
      [
        {
          content: "",
          colSpan: 1,
          styles: { halign: "center", fillColor: "#7500c0" },
        },
        {
          content: "Work Location",
          colSpan: 2,
          styles: { halign: "center", fillColor: "#e6dcff" },
        },
      ],
      ["Date", "AM", "PM"],
    ];
    // let column = {
    //   1: {
    //     halign: "center",
    //     cellWidth: 14,
    //   },
    //   2: {
    //     halign: "center",
    //     cellWidth: 30,
    //   },
    //   3: {
    //     halign: "center",
    //     cellWidth: 30,
    //   },
    // };
    if (!areDaysSplit()) {
      head = [["Date", "Work Location"]];
    }
    (doc as any).autoTable({
      head: head,
      body: calendarData,
      startY: addressesEndY + 12,
      theme: "grid",
      headStyles: {
        fillColor: "#7500c0",
      },
      columnStyles: getColumnStyles(),
      didDrawPage: function (data) {
        calendarTableY = data.cursor?.y;
      },
    });

    // Calendar table footnotes
    doc
      .setFont(undefined, "normal")
      .text(
        "*Paid time off\n**Weekend or public holiday",
        docMargin,
        calendarTableY + 25
      );

    doc
      .setFont(undefined, "italic")
      .text(
        `I acknowledge that the information above is correct and confirm I have worked the majority of my working time\nfrom ${mainWorkplace.addressName}.`,
        docMargin,
        calendarTableY + 10
      );

    const fileInput = document.getElementById(
      "uploadedFiles"
    ) as HTMLInputElement;
    const uploadedFiles: FileList = fileInput?.files;

    if (uploadedFiles && Array.from(uploadedFiles).length > 0) {
      await mergeFilesAndDownload(doc, uploadedFiles, pdfName);
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

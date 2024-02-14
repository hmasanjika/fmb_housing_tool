import React, { Dispatch, SetStateAction, useState } from "react";
import { Tooltip } from "react-tooltip";
import AlertModal from "./AlertModal";
import { ModalDetails } from "../models/types";
import { ModalTypes } from "../models/enums";
import trash from "../assets/icons/trash.png";
import trashPurple from "../assets/icons/trash_purple.png";
import info from "../assets/icons/info.png";
import Collapsible from "./Collapsible";
import { arrayBuffer } from "stream/consumers";

type AttachmentsProps = {
  files: FileList | null;
  setFiles: Dispatch<SetStateAction<FileList | null>>;
  saveFiles: (files) => void;
};
type FileItemProps = {
  file: File;
  index: number;
};
const Attachments = ({ files, setFiles, saveFiles }: AttachmentsProps) => {
  console.log(files);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<ModalDetails>({
    message: "Unknown alert",
    type: ModalTypes.ERROR,
  });

  const addFiles = async (newFiles: FileList | null) => {
    const updatedFileList = new DataTransfer();
    if (files) {
      for (const file of files) {
        updatedFileList.items.add(file);
      }
    }
    if (newFiles) {
      for (const file of newFiles) {
        updatedFileList.items.add(file);
      }
    }
    (document.getElementById("uploadedFiles") as HTMLInputElement).files =
      updatedFileList.files;
    setFiles(updatedFileList.files);
    const toStore = [];
    for (const file of updatedFileList.files) {
      const compatibleFile = {
        name: file.name,
        base64: await toBase64(file),
      };
      toStore.push(compatibleFile);
    }
    saveFiles(toStore);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const deleteFile = (index: number) => {
    const uploadedFiles: FileList | null = (
      document.getElementById("uploadedFiles") as HTMLInputElement
    ).files;
    if (uploadedFiles) {
      const updatedFileList = new DataTransfer();
      for (let i = 0; i < uploadedFiles.length; i++) {
        if (index !== i) {
          updatedFileList.items.add(uploadedFiles[i]);
        }
      }
      (document.getElementById("uploadedFiles") as HTMLInputElement).files =
        updatedFileList.files;
      setFiles(updatedFileList.files);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalDetails({
      message: "Unknown alert",
      type: ModalTypes.ERROR,
    });
  };

  const FileItem = ({ file, index }: FileItemProps) => {
    console.log(file);
    const [isDeleteHovered, setIsDeleteHovered] = useState<boolean>(false);

    const openPreviewModal = () => {
      setModalDetails({
        message: "",
        type: ModalTypes.PREVIEW_URL,
        url: URL.createObjectURL(file),
      });
      setIsModalOpen(true);
    };

    return (
      <li className="flex w-fit">
        <button
          className="iconBtn"
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          onClick={() => deleteFile(index)}
          data-tooltip-id="tooltip-delete"
          data-tooltip-content="Delete"
        >
          {!isDeleteHovered ? (
            <img src={trash} alt="Delete" width={15} />
          ) : (
            <img src={trashPurple} alt="Delete" width={15} />
          )}
        </button>
        <p
          className="mouseHover"
          onClick={() => openPreviewModal()}
          data-tooltip-id="tooltip-preview-file"
          data-tooltip-content="Preview file"
        >
          {file.name}
        </p>
        <Tooltip id="tooltip-delete" />
        <Tooltip id="tooltip-preview-file" />
      </li>
    );
  };

  const AddAttachmentsForm = () => {
    return (
      <div className="attachments text-sm">
        <form>
          <div className="flex">
            <h1>
              Upload PDF files to be appended to the document (e.g. your rental
              or mortgage contract).
            </h1>
            <img
              className="info-icon"
              src={info}
              alt="Info"
              data-tooltip-id="tooltip-attachment-info"
              data-tooltip-content="Only
          accepts files in PDF format. Multiple files can be selected at once."
            />
          </div>
          <Tooltip id="tooltip-attachment-info" />
          <label
            htmlFor="uploadedFiles"
            className="btn btn-primary btn-outline"
          >
            Choose files
          </label>
          <input
            type="file"
            id="uploadedFiles"
            multiple
            accept="application/pdf"
            onChange={(e) => addFiles(e.target.files)}
          />
        </form>
        {files && files.length > 0 && (
          <div>
            <h2 className="subSectionTitle -ml-10">Uploaded files</h2>
            <ul>
              {Array.from(files)?.map((file, index) => (
                <FileItem key={index} file={file} index={index} />
              ))}
            </ul>
          </div>
        )}
        <AlertModal
          modalIsOpen={isModalOpen}
          modalDetails={modalDetails}
          closeModal={closeModal}
        />
      </div>
    );
  };
  return (
    <div className="container">
      <Collapsible title="Attachments" child={<AddAttachmentsForm />} />
    </div>
  );
};

export default Attachments;

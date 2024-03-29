import { StorageTypes } from "../models/enums";
import { Address, MainWorkplace, Workdays } from "../models/types";

const useLocalStorage = () => {
  const setItem = (
    key: string,
    value: string | Address | Address[] | FileList | Workdays | MainWorkplace | null
  ) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const getFiles = async (item: string) => {
    const array = JSON.parse(item);
    if (array) {
      const fileList = new DataTransfer();
      await array.forEach(async (f) => {
        const res: Response = await fetch(f.base64);
        const blob: Blob = await res.blob();
        const file = new File([blob], f.name, { type: "application/pdf" });
        fileList.items.add(file);
        // fetch(f.base64)
        //   .then((res) => res.blob())
        //   .then((blob) => {
        //     const file = new File([blob], f.name, {
        //       type: "application/pdf",
        //     });
        //     console.log(file);
        //     fileList.items.add(file);
        //   });
        // const file = new File([f.base64], f.name, {
        //   type: "application/pdf",
        // });
      });

      return fileList.files;
    }
    return null;
  };

  const getItem = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (key === StorageTypes.FILES) {
        return getFiles(item);
      }
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem };
};

export default useLocalStorage;

import { Component } from "solid-js";

export interface FilesInputButtonProps {
  onChange: (files: FileList) => void;
}

export const FilesInputButton: Component<FilesInputButtonProps> = (
  { onChange },
) => {
  return (
    <button
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.onchange = () => {
          onChange(input.files!);
        };
        input.click();
      }}
    >
      Add Files
    </button>
  );
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import UploadInterface from "./UploadInterface";
import { useRef } from "react";
import { Library } from "../../models/library";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { handlers } from "../../../../mocks/handlers";

const meta: Meta<typeof UploadInterface> = {
  component: UploadInterface,
};

export default meta;
type Story = StoryObj<typeof UploadInterface>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers,
    },
  },
  loaders: [
    async () => {
      const currentPath = [0, 3, 4, 7];
      const library = new Library();

      await library.insertFamilyTreeAndInstantiate(currentPath);
      return {
        library,
        currentPath,
      };
    },
  ],
  render: (_args, { loaded: { library, currentPath } }) => {
    const store = configureStore({
      reducer: {
        library: () => ({ effectivePathTree: currentPath }),
      },
    });
    const libraryRef = useRef<Library>(library);
    return (
      <Provider store={store}>
        <UploadInterface libraryRef={libraryRef} />
      </Provider>
    );
  },
};

import { CommandProps, Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    direction: {
      setDirection: (direction: "ltr" | "rtl" | null) => ReturnType;
      toggleDirection: () => ReturnType;
    };
  }
}

// Direction Extension for block-level direction control
export const DirectionExtension = Extension.create({
  name: "direction",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          dir: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute("dir"),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.dir) return {};
              return { dir: attributes.dir };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setDirection:
        (direction: "ltr" | "rtl" | null) =>
        ({ tr, state, dispatch }: CommandProps) => {
          const { selection } = state;
          const { from, to } = selection;

          if (dispatch) {
            const nodeType = state.schema.nodes.paragraph;
            tr.setBlockType(from, to, nodeType, { dir: direction });
            dispatch(tr);
          }
          return true;
        },

      toggleDirection:
        () =>
        ({ tr, state, dispatch }: CommandProps) => {
          const { selection } = state;
          const { $from, from, to } = selection;
          const currentDir = $from.node().attrs.dir;
          const newDir = currentDir === "rtl" ? "ltr" : "rtl";

          if (dispatch) {
            const nodeType = state.schema.nodes.paragraph;
            tr.setBlockType(from, to, nodeType, { dir: newDir });
            dispatch(tr);
          }
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-x": () => this.editor.commands.toggleDirection(),
      "Ctrl-Shift-x": () => this.editor.commands.toggleDirection(),
    };
  },
});

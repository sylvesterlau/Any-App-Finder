figma.showUI(__html__, {
  themeColors: true,
  width: 300,
  height: 600,
  title: "Any App Finder",
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-image") {
    // No layer is selected
    if (!figma.currentPage.selection[0]) {
      figma.notify("Select layer(s) to add icon");
    } else {
      // A single layer or Multiple layers are selected
      for (const selection of figma.currentPage.selection) {
        if ("fills" in selection && selection.type !== "TEXT") {
          const newPaint = {
            type: "IMAGE",
            scaleMode: "FILL",
            imageHash: "",
            imageTransform: [
              [1, 0, 0],
              [0, 1, 0],
            ],
            filters: {
              contrast: 0,
              exposure: 0,
              highlights: 0,
              saturation: 0,
              shadows: 0,
              temperature: 0,
              tint: 0,
            },
            rotation: 0,
            scalingFactor: 0.5,
            visible: true,
          };
          newPaint.imageHash = figma.createImage(msg.data).hash;
          const newFills = [];
          newFills.push(newPaint);
          selection.fills = newFills;
        } else {
          //no fill in selection
          figma.notify("Please select shapes or frames to add the image");
        }
      }
    }
  }
  if (msg.type === "close") {
    figma.closePlugin();
  }
  if (msg.type === "insert-text") {
    // No layer is selected
    if (!figma.currentPage.selection[0]) {
      figma.notify("You haven't select a layer");
    } else {
      // A single layer or Multiple layers are selected
      for (const selection of figma.currentPage.selection) {
        if (selection.type == "TEXT") {
          const myFontLoadingFunction = async () => {
            await figma.loadFontAsync(selection.fontName);
          };
          myFontLoadingFunction().then(() => {
            // font loading Success!
            selection.characters = msg.text;
          });
        } else {
          figma.notify("Select text layer(s) to insert");
        }
      }
    }
  }

  if (msg.type === "set-client-storage") {
    figma.clientStorage.deleteAsync("anyapp-finder-storage");
    figma.clientStorage.setAsync("anyapp-finder-storage", msg.storageMsg);
  }
  if (msg.type === "get-client-storage") {
    const pluginStorage = await figma.clientStorage.getAsync(
      "anyapp-finder-storage"
    );
    figma.ui.postMessage({
      type: "get-last-region",
      lastRegion: pluginStorage.lastRegion || null,
    });
  }
};

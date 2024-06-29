figma.showUI(__html__, {
  themeColors: true,
  width: 300,
  height: 600,
  title: "Any App Finder",
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-image") {
    // create new fills
    const newFills = [
      {
        type: "IMAGE",
        scaleMode: "FILL",
        imageHash: figma.createImage(msg.data).hash,
      },
    ];

    if (!figma.currentPage.selection[0]) {
      const rect = figma.createRectangle();
      rect.x = figma.viewport.center.x;
      rect.y = figma.viewport.center.y;
      rect.resize(msg.imgW ? msg.imgW : 80, msg.imgH ? msg.imgH : 80);
      rect.fills = newFills;
      rect.name = msg.appName ? msg.appName : "app";
      figma.currentPage.appendChild(rect);
    } else {
      // A single layer or Multiple layers are selected
      for (const selection of figma.currentPage.selection) {
        if ("fills" in selection && selection.type !== "TEXT") {
          selection.fills = newFills;
        } else {
          figma.notify("Select shapes or frames to add the image");
        }
      }
    }
  }
  if (msg.type === "insert-text") {
    // No layer is selected
    if (!figma.currentPage.selection[0]) {
      (async () => {
        const newText = figma.createText();
        newText.x = figma.viewport.center.x;
        newText.y = figma.viewport.center.y;
        await figma.loadFontAsync(newText.fontName);
        newText.characters = msg.text ? msg.text : "something is wrong...";
        figma.currentPage.appendChild(newText);
      })();
    } else {
      // A single layer or Multiple layers are selected
      for (const selection of figma.currentPage.selection) {
        if (selection.type == "TEXT") {
          await figma.loadFontAsync(selection.fontName);
          selection.characters = msg.text ? msg.text : "error";
        } else {
          figma.notify("Select text layers to insert text");
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

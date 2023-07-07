figma.showUI(__html__, { width: 300, height: 480, title: "AnyApp Finder" });

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'create-image') {
        // No layer is selected
        if (!figma.currentPage.selection[0]) {
            figma.notify("Select layer(s) to add icon");
        }else {
    
        // A single layer or Multiple layers are selected
        for (const selection of figma.currentPage.selection) {
            if ("fills" in selection) {
                const newPaint = {
                    type: "IMAGE",
                    scaleMode: "FILL",
                    imageHash: "",
                    imageTransform: [[1, 0, 0], [0, 1, 0]],
                    filters: { contrast: 0, exposure: 0, highlights: 0, saturation: 0, shadows: 0, temperature: 0, tint: 0 },
                    rotation: 0,
                    scalingFactor: 0.5,
                    visible: true,
                };
                newPaint.imageHash = figma.createImage(msg.data).hash;
                const newFills = [];
                newFills.push(newPaint);
                selection.fills = newFills;
            }else{
                //no fill in selection
                figma.notify("Please select shapes or frames to add the image");
            }}}
    }
    if (msg.type === 'close') {
        figma.closePlugin();
    }
});
